export const toggleWeek = (weekIndex, setProgram) => {
  setProgram((prev) => {
    const newProgram = { 
      ...prev, 
      weeks: prev.weeks.map((week, index) =>
        index === weekIndex ? { ...week, isOpen: !week.isOpen } : week
      )
    };
    return newProgram;
  });
};


export const toggleWorkout = (weekIndex, workoutIndex, setProgram) => {
  setProgram((prev) => {
    const newProgram = {
      ...prev,
      weeks: prev.weeks.map((week, index) =>
        index === weekIndex
          ? {
              ...week,
              workouts: week.workouts.map((workout, wIndex) =>
                wIndex === workoutIndex
                  ? { ...workout, isOpen: !workout.isOpen }
                  : workout
              ),
            }
          : week
      ),
    };
    return newProgram;
  });
};


export const toggleExercise = (weekIndex, workoutIndex, exerciseIndex, setProgram) => {
  setProgram((prev) => {
    const newProgram = {
      ...prev,
      weeks: prev.weeks.map((week, wIndex) =>
        wIndex === weekIndex
          ? {
              ...week,
              workouts: week.workouts.map((workout, woIndex) =>
                woIndex === workoutIndex
                  ? {
                      ...workout,
                      exercises: workout.exercises.map((exercise, eIndex) =>
                        eIndex === exerciseIndex
                          ? { ...exercise, isOpen: !exercise.isOpen }
                          : exercise
                      ),
                    }
                  : workout
              ),
            }
          : week
      ),
    };
    return newProgram;
  });
};