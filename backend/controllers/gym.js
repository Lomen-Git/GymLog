const express = require('express')
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
  ProgramExecution
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

    res.json(program);
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
});

// Aloita uusi ohjelma
router.post('/programs/start/:id', tokenSessionExtractor, async (req, res) => {
  try {
    await ProgramExecution.create({
      programId: req.params.id,
      userId: req.user.id,
      status: true
    })
    
    res.status(201).end()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

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