export const getWorkoutByIndex = (program, weekIndex, workoutIndex, programExecutionId) => {
    try {
      if (!program.Weeks?.length) throw new Error('No weeks found in program')
      const week = program.Weeks[weekIndex]
      if (!week) throw new Error(`Week with index ${weekIndex} not found`)
      if (!week.Workouts?.length) throw new Error('No workouts found in week')
      const workout = week.Workouts[workoutIndex]
      if (!workout) throw new Error(`Workout with index ${workoutIndex} not found`)
      workout.programExecutionId = programExecutionId
      return workout
    } catch (error) {
      console.error('Error getting workout:', error)
      throw error
    }
  }
  
  export const createWorkoutSession = (workout) => {
    if (!workout?.WorkoutExercises) throw new Error('Invalid workout data')
    
    return {
      workoutId: workout.id,
      programExecutionId: workout.programExecutionId,
      name: workout.name,
      isCompleted: false,
      exercises: workout.WorkoutExercises.map(exercise => ({
        exerciseId: exercise.exerciseId,
        name: exercise.Exercise.name,
        isCompleted: false,
        sets: exercise.Sets.map(set => ({
          setId: set.id,
          targetReps: set.reps,
          targetValue: set.value,
          completedReps: null,
          completedValue: null,
          weight: null,
          isCompleted: false
        }))
      }))
    }
  }