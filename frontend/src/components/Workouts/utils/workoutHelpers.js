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


// Transform the program data into a more usable structure with completion status
export const transformProgramData = (programData) => {
  if (!programData || !programData.program || !programData.execution) {
    return null;
  }

  const { program, execution, completedWorkouts = [] } = programData;
  
  // Create a map of completed workouts by ID for faster lookup
  const completedWorkoutMap = {};
  completedWorkouts.forEach(workout => {
    // Check if completedWorkouts has the workoutId property
    // If not, try to match by name or other properties
    if (workout.workoutId) {
      completedWorkoutMap[workout.workoutId] = workout;
    } else {
      // For already saved workouts without workoutId, try to match by name
      program.Weeks.forEach(week => {
        week.Workouts.forEach(w => {
          if (w.name === workout.name) {
            completedWorkoutMap[w.id] = workout;
          }
        });
      });
    }
  });

  // Transform the weeks and workouts with completion status
  const weeks = program.Weeks.map((week, weekIndex) => {
    return {
      id: week.id,
      name: week.name,
      order: week.order,
      weekIndex,
      isCurrentWeek: weekIndex === execution.weekIndex,
      workouts: week.Workouts.map((workout, workoutIndex) => {
        const isCompleted = !!completedWorkoutMap[workout.id];
        const isCurrentWorkout = weekIndex === execution.weekIndex && 
                                workoutIndex === execution.workoutIndex;
        
        return {
          id: workout.id,
          name: workout.name,
          order: workout.order,
          weekIndex,
          workoutIndex,
          isCompleted,
          isCurrentWorkout,
          completedData: completedWorkoutMap[workout.id] || null,
          // Add references to original data for exercise details if needed
          originalData: workout
        };
      })
    };
  });

  return {
    programId: program.id,
    programName: program.name,
    programExecutionId: execution.id,
    currentWeekIndex: execution.weekIndex,
    currentWorkoutIndex: execution.workoutIndex,
    weeks
  };
}

// Get a specific workout by week and workout indices
export const getWorkoutByIndices = (transformedProgram, weekIndex, workoutIndex) => {
  if (!transformedProgram || !transformedProgram.weeks) {
    return null;
  }
  
  const week = transformedProgram.weeks[weekIndex];
  if (!week || !week.workouts) {
    return null;
  }
  
  return week.workouts[workoutIndex] || null;
}

// Get current workout based on execution indices
export const getCurrentWorkout = (transformedProgram) => {
  if (!transformedProgram) {
    return null;
  }
  
  return getWorkoutByIndices(
    transformedProgram,
    transformedProgram.currentWeekIndex,
    transformedProgram.currentWorkoutIndex
  );
}

// Get previous, current, and next workouts for navigation
export const getWorkoutNavigation = (transformedProgram) => {
  if (!transformedProgram || !transformedProgram.weeks) {
    return { prev: null, current: null, next: null };
  }
  
  const { currentWeekIndex, currentWorkoutIndex } = transformedProgram;
  const current = getCurrentWorkout(transformedProgram);
  
  // Find previous workout
  let prevWeekIndex = currentWeekIndex;
  let prevWorkoutIndex = currentWorkoutIndex - 1;
  
  if (prevWorkoutIndex < 0) {
    prevWeekIndex--;
    if (prevWeekIndex >= 0) {
      const prevWeek = transformedProgram.weeks[prevWeekIndex];
      prevWorkoutIndex = prevWeek.workouts.length - 1;
    } else {
      prevWeekIndex = -1;
      prevWorkoutIndex = -1;
    }
  }
  
  // Find next workout
  let nextWeekIndex = currentWeekIndex;
  let nextWorkoutIndex = currentWorkoutIndex + 1;
  
  const currentWeek = transformedProgram.weeks[currentWeekIndex];
  if (nextWorkoutIndex >= currentWeek.workouts.length) {
    nextWeekIndex++;
    nextWorkoutIndex = 0;
    
    if (nextWeekIndex >= transformedProgram.weeks.length) {
      nextWeekIndex = -1;
      nextWorkoutIndex = -1;
    }
  }
  
  const prev = prevWeekIndex >= 0 && prevWorkoutIndex >= 0 
    ? getWorkoutByIndices(transformedProgram, prevWeekIndex, prevWorkoutIndex)
    : null;
    
  const next = nextWeekIndex >= 0 && nextWorkoutIndex >= 0
    ? getWorkoutByIndices(transformedProgram, nextWeekIndex, nextWorkoutIndex)
    : null;
    
  return { prev, current, next };
}