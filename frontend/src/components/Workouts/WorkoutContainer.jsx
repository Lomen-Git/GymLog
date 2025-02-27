import React, { useState, useEffect, useCallback } from 'react';
import { 
  getOngoingProgram, 
  getProgramList, 
  createOngoingProgram,
  createCompletedWorkout,
  getSavedWorkoutProgress,
  saveExerciseProgress
} from '../../services/programServices';
import { 
  transformProgramData, 
  getWorkoutByIndices,
  getWorkoutNavigation 
} from './utils/workoutHelpers';

// Import original WorkoutView (will be used as a presentational component)
import WorkoutView from './WorkoutView';

const WorkoutContainer = () => {
  // Core application state
  const [programData, setProgramData] = useState(null);
  const [transformedProgram, setTransformedProgram] = useState(null);
  const [programList, setProgramList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // View state
  const [viewMode, setViewMode] = useState('navigation'); // 'navigation', 'workout', 'exercise', 'history', 'exerciseHistory'
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(null);
  const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState(null);
  
  // Exercise state
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseDataBeforeEdit, setExerciseDataBeforeEdit] = useState(null);
  const [hasExerciseChanged, setHasExerciseChanged] = useState(false);
  const [viewingHistoryForExercise, setViewingHistoryForExercise] = useState(null);
  
  // UI state
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [showStartPopup, setShowStartPopup] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Fetch ongoing program on component mount
  useEffect(() => {
    fetchOngoingProgram();
  }, []);

  // Transform raw program data into a more usable format
  useEffect(() => {
    if (programData) {
      const transformed = transformProgramData(programData);
      setTransformedProgram(transformed);
    }
  }, [programData]);

  // Update selected indices when transformedProgram changes
  useEffect(() => {
    if (transformedProgram) {
      setSelectedWeekIndex(transformedProgram.currentWeekIndex);
      setSelectedWorkoutIndex(transformedProgram.currentWorkoutIndex);
    }
  }, [transformedProgram]);

  // Update active workout when selected indices change
  useEffect(() => {
    if (transformedProgram && selectedWeekIndex !== null && selectedWorkoutIndex !== null) {
      const workout = getWorkoutByIndices(transformedProgram, selectedWeekIndex, selectedWorkoutIndex);
      if (workout) {
        // Create a workout session from the selected workout
        createWorkoutSession(workout, transformedProgram).then(workoutSession => {
          setActiveWorkout(workoutSession);
        });
      }
    }
  }, [transformedProgram, selectedWeekIndex, selectedWorkoutIndex]);

  // Fetch ongoing program data
  const fetchOngoingProgram = async () => {
    setIsLoading(true);
    try {
      const data = await getOngoingProgram();
      if (data === null) {
        try {
          const listData = await getProgramList();
          setProgramList(listData);
        } catch (error) {
          console.error('Error fetching program list', error);
        }
      } else {
        setProgramData(data);
        setViewMode('navigation'); // Start with program navigation view
      }
    } catch (error) {
      console.error('Error fetching ongoing program', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to create a workout session from a transformed workout
  const createWorkoutSession = async (workout, program) => {
    // Check which path contains the WorkoutExercises
    const exercisesPath = workout?.originalData?.WorkoutExercises || workout?.WorkoutExercises;
    
    if (!exercisesPath || !Array.isArray(exercisesPath) || exercisesPath.length === 0) {
      console.error("No exercises found in workout data:", workout);
      return null;
    }
    
    // Create the basic workout session
    const workoutSession = {
      workoutId: workout.id,
      programExecutionId: program.programExecutionId || program.execution?.id,
      name: workout.name,
      isCompleted: workout.isCompleted || false,
      weekIndex: workout.weekIndex,
      workoutIndex: workout.workoutIndex,
      exercises: exercisesPath.map(exercise => ({
        exerciseId: exercise.exerciseId,
        name: exercise.Exercise?.name || "Unknown Exercise",
        isCompleted: false,
        sets: Array.isArray(exercise.Sets) ? exercise.Sets.map(set => ({
          setId: set.id,
          targetReps: set.reps || 0,
          targetValue: set.value || 0,
          completedReps: null,
          completedValue: null,
          weight: null,
          isCompleted: false
        })) : []
      }))
    };
  
    // Try to fetch saved progress
    try {
      if (workoutSession.programExecutionId && workout.id) {
        const savedProgress = await getSavedWorkoutProgress(
          workoutSession.programExecutionId, 
          workout.id
        );
        
        // If we have saved progress, merge it with the workout session
        if (savedProgress && savedProgress.exercises && savedProgress.exercises.length > 0) {
          // For each exercise in the saved progress
          savedProgress.exercises.forEach(savedExercise => {
            // Find the matching exercise in our workout session
            const exerciseIndex = workoutSession.exercises.findIndex(
              ex => ex.exerciseId === savedExercise.exerciseId
            );
            
            if (exerciseIndex !== -1) {
              // Update the exercise with saved progress
              workoutSession.exercises[exerciseIndex] = {
                ...workoutSession.exercises[exerciseIndex],
                sets: savedExercise.sets,
                isCompleted: savedExercise.sets.every(set => set.isCompleted)
              };
            }
          });
          
          // Update the overall completion status
          workoutSession.isCompleted = workoutSession.exercises.every(ex => ex.isCompleted);
        }
      }
    } catch (error) {
      console.error("Error loading saved progress:", error);
      // Continue with the basic workout session if we can't load progress
    }
  
    return workoutSession;
  };

  // Select a workout to view/perform
  const handleSelectWorkout = (weekIndex, workoutIndex) => {
    setSelectedWeekIndex(weekIndex);
    setSelectedWorkoutIndex(workoutIndex);
    
    // If the workout is already completed, show history view instead
    const workout = getWorkoutByIndices(transformedProgram, weekIndex, workoutIndex);
    if (workout && workout.isCompleted) {
      setViewMode('history');
    } else {
      setViewMode('workout');
    }
  };

  // Start a program
  const startProgram = (id) => {
    const program = programList.find(p => p.id === id);
    if (program) {
      setSelectedProgram(program);
      setShowStartPopup(true);
    }
  };

  // Confirm program start
  const handleConfirmStart = async () => {
    try {
      await createOngoingProgram(selectedProgram.id);
      await fetchOngoingProgram();
      setShowStartPopup(false);
    } catch (error) {
      console.error('Error starting program', error);
    }
  };

  // Open exercise view
  const openExerciseView = useCallback((exercise) => {
    setExerciseDataBeforeEdit(JSON.parse(JSON.stringify(exercise)));
    setSelectedExercise(exercise);
    setHasExerciseChanged(false);
    setViewMode('exercise');
  }, []);

  // Handle exercise close
  const handleExerciseClose = useCallback(async (exerciseId, updatedSets, saveChanges = true) => {
    if (!saveChanges) {
      setSelectedExercise(null);
      setViewMode('workout');
      return;
    }

    try {
      // Update local state
      setActiveWorkout((prevWorkout) => {
        const newWorkout = { ...prevWorkout };
    
        const exerciseIndex = newWorkout.exercises.findIndex((ex) => ex.exerciseId === exerciseId);
        
        if (exerciseIndex !== -1) {
          newWorkout.exercises[exerciseIndex] = {
            ...newWorkout.exercises[exerciseIndex],
            sets: updatedSets,
            isCompleted: updatedSets.every(set => set.isCompleted),
          };
        }
    
        // Check if the entire workout is completed
        newWorkout.isCompleted = newWorkout.exercises.every(ex => ex.isCompleted);
        
        return newWorkout;
      });
      
      // Save the progress to backend
      if (activeWorkout) {
        await saveExerciseProgress(activeWorkout, exerciseId, updatedSets);
      }
    } catch (error) {
      console.error("Error saving exercise progress:", error);
    }
    
    setSelectedExercise(null);
    setViewMode('workout');
  }, [activeWorkout]);

  // Complete the current workout
  const handleCompleteWorkout = async () => {
    try {
      if (!activeWorkout) return;
      
      setIsLoading(true);
      
      // Save the workout completion
      await createCompletedWorkout(activeWorkout);
      
      // Refresh program data
      await fetchOngoingProgram();
      
      // Move to the next workout if available
      if (transformedProgram) {
        const { next } = getWorkoutNavigation(transformedProgram);
        if (next) {
          setSelectedWeekIndex(next.weekIndex);
          setSelectedWorkoutIndex(next.workoutIndex);
        }
      }
      
      // Return to navigation view
      setViewMode('navigation');
    } catch (error) {
      console.error("Error completing workout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Return to navigation view
  const handleBackToNavigation = () => {
    setViewMode('navigation');
  };

  // Skip to the next workout
  const handleSkipWorkout = async () => {
    try {
      // Refresh program data (which will move to next workout)
      await fetchOngoingProgram();
      setViewMode('navigation');
    } catch (error) {
      console.error("Error skipping workout:", error);
    }
  };

  // Handle viewing exercise history
  const handleViewExerciseHistory = (exercise) => {
    // Save current progress before viewing history
    if (hasExerciseChanged) {
      handleExerciseClose(selectedExercise.exerciseId, selectedExercise.sets, true);
    }
    setViewingHistoryForExercise(exercise);
    setViewMode('exerciseHistory');
  };

  // Return from exercise history
  const handleBackFromHistory = () => {
    setViewMode('exercise');
    setViewingHistoryForExercise(null);
  };

  // Pass all state and handlers to the WorkoutView component
  const workoutViewProps = {
    // State
    programData,
    transformedProgram,
    programList,
    isLoading,
    viewMode,
    selectedWeekIndex,
    selectedWorkoutIndex,
    selectedExercise,
    exerciseDataBeforeEdit,
    hasExerciseChanged,
    viewingHistoryForExercise,
    activeWorkout,
    showStartPopup,
    selectedProgram,
    
    // Handlers
    fetchOngoingProgram,
    handleSelectWorkout,
    startProgram,
    handleConfirmStart,
    openExerciseView,
    handleExerciseClose,
    handleCompleteWorkout,
    handleBackToNavigation,
    handleSkipWorkout,
    handleViewExerciseHistory,
    handleBackFromHistory,
    setHasExerciseChanged
  };

  return <WorkoutView {...workoutViewProps} />;
};

export default WorkoutContainer;