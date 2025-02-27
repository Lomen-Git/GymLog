const router = require('express').Router()
const {
  User,
  Exercise,
  UserExercise,
  Program,
  Workout,
  WorkoutExercise,
  Set,
  Week,
  ProgramExecution,
  CompletedWorkout,
  CompletedExercise,
  CompletedSet,
  TempWorkoutProgress
  } = require('../models/zzz_index')
const { sequelize } = require('../util/db')
const tokenSessionExtractor = require('../customMW/tokenSessionExtractor')


router.post('/exercises', tokenSessionExtractor, async (req, res) => {
  const { name } = req.body
  const userId = req.user.id

  try {
      const exercise = await Exercise.create({
        name: name,
      })

      const result = await UserExercise.create({
        userId: userId,
        exerciseId: exercise.id
      })

    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/exercises', tokenSessionExtractor, async (req, res) => {
  const userId = req.user.id

  try {
    const exercises = await Exercise.findAll({
      include: [{
        model: UserExercise,
        where: { userId: userId },
      }]
    })

    res.status(200).json(exercises)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/programs', tokenSessionExtractor, async (req, res) => {
  const { name, unit, weeks } = req.body.program
  const userId = req.user.id

  console.log('kohta tallennetaan', req.body)
  
  const choiceMap = {
    'RPM': 1,
    '%': 2,
    default: 3
  }
  const choice = choiceMap[unit] || choiceMap.default

  try {
    const createdProgram = await Program.create({
      userId: userId,
      name: name,
      choice: choice
    })

    for (const [weekIndex, week] of weeks.entries()) {
      const createdWeek = await Week.create({
        name: week.name,
        order: week.weekNumber,
        programId: createdProgram.id
      })

      for (const [workoutIndex, workout] of week.workouts.entries()) {
        const createdWorkout = await Workout.create({
          name: workout.name,
          order: workoutIndex + 1,
          weekId: createdWeek.id
        })
         
        for (const [exerciseIndex, exercise] of workout.exercises.entries()) {
          const createdWorkoutExercise = await WorkoutExercise.create({
            workoutId: createdWorkout.id,
            exerciseId: exercise.exerciseId,
            order: exerciseIndex + 1,
            comment: '',
            choice: choice
          })

          for (const set of exercise.sets) {
            await Set.create({
              workoutExerciseId: createdWorkoutExercise.id,
              reps: parseInt(set.reps, 10),
              value: parseFloat(set.value)
            })
          }
        }
      }
    }

    res.status(201).json(createdProgram)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/programs/:id', tokenSessionExtractor, async (req, res) => {
  const programId = req.params.id
  const { name, unit, weeks } = req.body.program
  const userId = req.user.id

  const choiceMap = {
    'RPM': 1,
    '%': 2,
    default: 3
  }
  const choice = choiceMap[unit] || choiceMap.default

  const transaction = await sequelize.transaction()

  try {
    // Tarkista että ohjelma kuuluu käyttäjälle
    const program = await Program.findOne({
      where: { 
        id: programId,
        userId: userId  // Käytetään snake_case muotoa määrittelyjen mukaisesti
      }
    }, { transaction })

    if (!program) {
      await transaction.rollback()
      return res.status(404).json({ error: 'Program not found or unauthorized' })
    }

    // Päivitä ohjelman perustiedot
    await program.update({
      name: name,
      choice: choice
    }, { transaction })

    // Poista vanhat viikot, cascade hoitaa automaattisesti:
    // - weeks → workouts
    // - workouts → workout_exercises
    // - workout_exercises → sets
    await Week.destroy({
      where: { programId: programId },
      transaction
    })

    // Luo uudet viikot ja niihin liittyvät tiedot
    for (const [weekIndex, week] of weeks.entries()) {
      const createdWeek = await Week.create({
        name: week.name,
        order: week.weekNumber,
        programId: programId  // snake_case
      }, { transaction })

      for (const [workoutIndex, workout] of week.workouts.entries()) {
        const createdWorkout = await Workout.create({
          name: workout.name,
          order: workoutIndex + 1,
          weekId: createdWeek.id  // snake_case
        }, { transaction })
         
        for (const [exerciseIndex, exercise] of workout.exercises.entries()) {
          // Tarkista että harjoite on olemassa
          const existingExercise = await Exercise.findByPk(exercise.exerciseId, { transaction })
          if (!existingExercise) {
            await transaction.rollback()
            return res.status(400).json({ error: `Exercise with id ${exercise.exerciseId} not found` })
          }

          const createdWorkoutExercise = await WorkoutExercise.create({
            workoutId: createdWorkout.id,  // snake_case
            exerciseId: exercise.exerciseId,  // snake_case
            order: exerciseIndex + 1,
            comment: exercise.comment || '',
            choice: choice
          }, { transaction })

          for (const set of exercise.sets) {
            await Set.create({
              workoutExerciseId: createdWorkoutExercise.id,  // snake_case
              reps: parseInt(set.reps, 10),
              value: parseFloat(set.value)
            }, { transaction })
          }
        }
      }
    }

    await transaction.commit()

    // Hae päivitetty ohjelma ja palauta se
    const updatedProgram = await Program.findByPk(programId, {
      include: [{
        model: Week,
        include: [{
          model: Workout,
          include: [{
            model: WorkoutExercise,
            include: [
              { model: Exercise },
              { model: Set }
            ]
          }]
        }]
      }]
    })

    res.json(updatedProgram)
  } catch (error) {
    await transaction.rollback()
    res.status(500).json({ error: error.message })
  }
})

router.get('/programs', tokenSessionExtractor, async (req, res) => {
  const userId = req.user.id

  try {
    const programs = await Program.findAll({
      where: { userId: userId },
      attributes: ['id', 'name', 'choice', 'createdAt', 'updatedAt']
    })

    res.status(200).json(programs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Hae käynnissä oleva ohjelma *************************
router.get('/programs/ongoing', tokenSessionExtractor, async (req, res) => {
  try {
    // 1. Etsi ensin käyttäjän aktiivinen ohjelmasuoritus
    const execution = await ProgramExecution.findOne({
      where: {
        userId: req.user.id,
        status: true
      }
    });

    // 2. Jos ei aktiivista suoritusta, palauta heti
    if (!execution) {
      console.log('Ei aktiivista ohjelmasuoritusta');
      return res.json(null);
    }

    // 3. Hae ohjelma suorituksen programId:n perusteella
    const program = await Program.findOne({
      where: { id: execution.programId },
      include: [
        {
          model: Week,
          include: [{
            model: Workout,
            include: [{
              model: WorkoutExercise,
              include: [
                { model: Set },
                { model: Exercise },
              ]
            }]
          }]
        }
      ]
    });

    // 4. Hae käyttäjän suorittamat treenit tätä ohjelmaa varten
    const completedWorkouts = await CompletedWorkout.findAll({
      where: { 
        programExecutionId: execution.id,
        userId: req.user.id
      },
      include: [
        {
          model: CompletedExercise,
          include: [
            { model: CompletedSet },
            { model: Exercise }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ 
      execution, 
      program,
      completedWorkouts 
    });
  } catch (error) {
    // 4. Käsiteltävät virhekoodit (PostgreSQL)
    const missingTableCodes = ['42P01', '42S02']; // Puuttuva taulu
    const missingColumnCodes = ['42703', '42S22']; // Puuttuva sarake
    
    if (error.original && (
      missingTableCodes.includes(error.original.code) || 
      missingColumnCodes.includes(error.original.code))
    ) {
      console.log('Tietokantarakenne puutteellinen');
      return res.json(null);
    }

    res.status(500).json({ error: error.message });
  }
})

// Aloita uusi ohjelma
router.post('/programs/start/:id', tokenSessionExtractor, async (req, res) => {
  try {
    await ProgramExecution.create({
      programId: req.params.id,
      userId: req.body.data.userId,
      weekIndex: 0,
      workoutIndex: 0,
      status: true
    })
    
    res.status(201).end()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Treenin suoritus
router.post('/programs/completed', tokenSessionExtractor, async (req, res) => {
  try {
    const { workoutData }= req.body
    console.log('datadatadatadatadatadatadatadatadatadata', workoutData)
    const { workoutId, programExecutionId, name, isCompleted, exercises } = workoutData
    console.log('programexecutionid', programExecutionId)
    console.log('name', name)
    console.log('exercises', exercises)
    const userId = req.user.id


    // 1. Luo completed_workout
    const completedWorkout = await CompletedWorkout.create({
      name: name,
      programExecutionId: programExecutionId,
      workoutId: workoutId,
      notes: '',
      userId: userId
    });

    // 2. Käy läpi harjoitukset
    for (const exercise of exercises) {
      // 3. Luo completed_exercise
      const completedExercise = await CompletedExercise.create({
        name: exercise.name,
        completedWorkoutId: completedWorkout.id,
        exerciseId: exercise.exerciseId,
        notes: '',
        userId: userId
      })

      // 4. Käy läpi sarjat
      for (const set of exercise.sets) {
        await CompletedSet.create({
          completedExerciseId: completedExercise.id,
          targetReps: set.targetReps,
          targetValue: set.targetValue,
          completedReps: set.completedReps,
          completedValue: set.completedValue,
          weight: set.weight,
          userId: userId
        })
      }
    }

    res.status(201).end();
  } catch (error) {
    console.error('Error saving workout:', error);
    res.status(500).json({ error: 'Workout saving failed' })
  }
})

// Add this route to backend/controllers/gym.js

// Save partial workout progress (individual exercise)
router.post('/programs/exercise-progress', tokenSessionExtractor, async (req, res) => {
  try {
    const { exerciseData } = req.body;
    const userId = req.user.id;
    
    // Check if there's an existing temporary progress for this workout
    let progressRecord = await TempWorkoutProgress.findOne({
      where: {
        programExecutionId: exerciseData.programExecutionId,
        userId: userId
      }
    });
    
    // Create or update the progress record
    if (!progressRecord) {
      // Initialize a new progress record with the first exercise
      progressRecord = await TempWorkoutProgress.create({
        programExecutionId: exerciseData.programExecutionId,
        workoutId: exerciseData.workoutId,
        userId: userId,
        progressData: JSON.stringify({
          name: exerciseData.name,
          exercises: exerciseData.exercises
        })
      });
    } else {
      // Update existing progress by merging the updated exercise
      const existingData = JSON.parse(progressRecord.progressData);
      const updatedExercise = exerciseData.exercises[0];
      
      // Find and update the specific exercise in the existing data
      const updatedExercises = existingData.exercises.map(ex => 
        ex.exerciseId === updatedExercise.exerciseId ? updatedExercise : ex
      );
      
      // If exercise doesn't exist in progress yet, add it
      if (!existingData.exercises.some(ex => ex.exerciseId === updatedExercise.exerciseId)) {
        updatedExercises.push(updatedExercise);
      }
      
      // Update the record
      await progressRecord.update({
        progressData: JSON.stringify({
          ...existingData,
          exercises: updatedExercises
        })
      });
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving exercise progress:', error);
    res.status(500).json({ error: 'Failed to save exercise progress' });
  }
});

// Add this route to backend/controllers/gym.js
router.get('/programs/exercise-progress', tokenSessionExtractor, async (req, res) => {
  try {
    const { programExecutionId, workoutId } = req.query;
    const userId = req.user.id;
    
    const progressRecord = await TempWorkoutProgress.findOne({
      where: {
        programExecutionId,
        workoutId,
        userId
      }
    });
    
    if (!progressRecord) {
      return res.json(null);
    }
    
    // Parse the saved progress data
    const progressData = JSON.parse(progressRecord.progressData);
    res.json(progressData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/exercises/:id/history', tokenSessionExtractor, async (req, res) => {
  try {
    const exerciseId = req.params.id;
    const userId = req.user.id;
    
    // Find all completed exercises for this exercise ID
    const completedExercises = await CompletedExercise.findAll({
      where: {
        exerciseId,
        userId
      },
      include: [
        {
          model: CompletedSet,
          attributes: ['id', 'completedReps', 'completedValue', 'weight']
        },
        {
          model: CompletedWorkout,
          attributes: ['id', 'name', 'createdAt']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10 // Limit to the last 10 workouts for performance
    });
    
    // Transform data for frontend
    const history = completedExercises.map(exercise => ({
      id: exercise.id,
      date: exercise.createdAt,
      workoutName: exercise.CompletedWorkout.name,
      workoutId: exercise.CompletedWorkout.id,
      workoutDate: exercise.CompletedWorkout.createdAt,
      sets: exercise.CompletedSets.map(set => ({
        id: set.id,
        completedReps: set.completedReps,
        completedValue: set.completedValue,
        weight: set.weight
      }))
    }));
    
    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/programs/:id', tokenSessionExtractor, async (req, res) => {
  try {
    const program = await Program.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        { 
          model: Week, 
          include: [{ 
            model: Workout, 
            include: [{ 
              model: WorkoutExercise, 
              include: [
                { model: Set },
                { model: Exercise },
              ]
              // tarvitseeko haettava data määtittää tässä?? [id, esim, ...] 
            }]
          }]
        }
      ]
    })
    res.json(program)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
