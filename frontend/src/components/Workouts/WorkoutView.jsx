import React, { useEffect, useState, useCallback } from 'react';
import { Info, MoreVertical, Check, ArrowLeft, Plus, ArrowRight, Calendar, RefreshCcw } from 'lucide-react';

// Helpers and utilities
import {
  transformProgramData,
  getCurrentWorkout,
  getWorkoutByIndices,
  getWorkoutNavigation
} from './utils/workoutHelpers';

// Services
import {
  getOngoingProgram,
  getProgramList,
  createOngoingProgram,
  createCompletedWorkout
} from '../../services/programServices';

// Components
import ExerciseView from './components/ExerciseView/ExerciseView';
import ProgramListView from '../EditProgram/ProgramListView';
import WorkoutNavigation from './components/WorkoutNavigation';
import CompletedWorkoutView from './components/CompletedWorkoutView';
import ExerciseSetRPM from './components/ExerciseView/components/ExerciseSetRPM';
import Timer from './components/ExerciseView/components/Timer';

// Popups
import { StartProgramPopup } from './Popups/StartProgramPopup';

const WorkoutView = () => {
  // Program state
  const [programData, setProgramData] = useState(null);
  const [transformedProgram, setTransformedProgram] = useState(null);
  const [programList, setProgramList] = useState([]);
  
  // View state
  const [viewMode, setViewMode] = useState('navigation'); // 'navigation', 'workout', 'exercise', 'history'
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(null);
  const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState(null);
  
  // Exercise state
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseDataBeforeEdit, setExerciseDataBeforeEdit] = useState(null);
  const [hasExerciseChanged, setHasExerciseChanged] = useState(false);
  
  // UI state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showStartPopup, setShowStartPopup] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch ongoing program on component mount
  useEffect(() => {
    fetchOngoingProgram();
  }, []);

  // Transform raw program data into a more usable format
  useEffect(() => {
    if (programData) {
      const transformed = transformProgramData(programData);
      setTransformedProgram(transformed);
      
      // Set selected indices to current if available
      if (transformed) {
        setSelectedWeekIndex(transformed.currentWeekIndex);
        setSelectedWorkoutIndex(transformed.currentWorkoutIndex);
      }
    }
  }, [programData]);

  // Update active workout when selected indices change
  useEffect(() => {
    if (transformedProgram && selectedWeekIndex !== null && selectedWorkoutIndex !== null) {
      const workout = getWorkoutByIndices(transformedProgram, selectedWeekIndex, selectedWorkoutIndex);
      if (workout) {
        // Create a workout session from the selected workout
        const workoutSession = createWorkoutSession(workout, transformedProgram);
        setActiveWorkout(workoutSession);
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

  // Handle exercise completion
  const handleExerciseClose = useCallback((exerciseId, updatedSets, saveChanges = true) => {
    if (!saveChanges) {
      setSelectedExercise(null);
      setViewMode('workout');
      return;
    }

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
    
    setSelectedExercise(null);
    setViewMode('workout');
  }, []);

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

  // Helper function to create a workout session from a transformed workout
  const createWorkoutSession = (workout, program) => {
    if (!workout?.originalData?.WorkoutExercises) {
      return null;
    }

    return {
      workoutId: workout.id,
      programExecutionId: program.programExecutionId,
      name: workout.name,
      isCompleted: workout.isCompleted,
      weekIndex: workout.weekIndex,
      workoutIndex: workout.workoutIndex,
      exercises: workout.originalData.WorkoutExercises.map(exercise => ({
        exerciseId: exercise.exerciseId,
        name: exercise.Exercise.name,
        isCompleted: false, // Start as not completed for the current session
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
    };
  };

  // Return to navigation view
  const handleBackToNavigation = () => {
    setViewMode('navigation');
  };

  // Skip to the next workout
  const handleSkipWorkout = async () => {
    // Logic to move to next workout without completing current one
    try {
      // Refresh program data (which will move to next workout)
      await fetchOngoingProgram();
      setViewMode('navigation');
    } catch (error) {
      console.error("Error skipping workout:", error);
    }
  };

  // If in exercise view, show ExerciseView component
  if (viewMode === 'exercise' && selectedExercise) {
    return (
      <ExerciseViewWrapper
        exercise={selectedExercise}
        onDataChange={(hasChanged) => setHasExerciseChanged(hasChanged)}
        onClose={(updatedSets, saveChanges) => {
          handleExerciseClose(selectedExercise.exerciseId, updatedSets, saveChanges);
        }}
        onBack={() => {
          if (hasExerciseChanged) {
            if (window.confirm("Do you want to save changes?")) {
              handleExerciseClose(selectedExercise.exerciseId, selectedExercise.sets, true);
            } else {
              handleExerciseClose(selectedExercise.exerciseId, null, false);
            }
          } else {
            setSelectedExercise(null);
            setViewMode('workout');
          }
        }}
        compareWithOriginal={exerciseDataBeforeEdit}
      />
    );
  }

  // If in history view, show CompletedWorkoutView
  if (viewMode === 'history' && transformedProgram) {
    const historyWorkout = getWorkoutByIndices(transformedProgram, selectedWeekIndex, selectedWorkoutIndex);
    
    if (historyWorkout) {
      return (
        <CompletedWorkoutView 
          workout={historyWorkout}
          onBack={handleBackToNavigation}
        />
      );
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-center bg-gray-900 bg-opacity-20 text-white p-4">
        <div className="animate-spin mb-4">
          <RefreshCcw className="w-8 h-8" />
        </div>
        <p>Loading your workout data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-gray-900 bg-opacity-20 text-white">
      {/* No active program */}
      {!programData && (
        <div className="flex-1 p-4">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">No Active Program</h2>
            <p className="text-gray-400 mb-8">Select a program to get started</p>
          </div>
          
          {programList.length > 0 && (
            <ProgramListView
              programs={programList}
              onProgramSelect={startProgram}
            />
          )}
        </div>
      )}

      {/* Program navigation view */}
      {programData && viewMode === 'navigation' && (
        <WorkoutNavigation 
          programData={transformedProgram}
          onSelectWorkout={handleSelectWorkout}
          onRefresh={fetchOngoingProgram}
          currentWeekIndex={transformedProgram?.currentWeekIndex}
          currentWorkoutIndex={transformedProgram?.currentWorkoutIndex}
        />
      )}

      {/* Active workout view */}
      {programData && viewMode === 'workout' && activeWorkout && (
        <div className="flex flex-col min-h-screen">
          {/* Workout header with back button */}
          <div className="flex items-center p-4 border-b border-gray-800">
            <button 
              onClick={handleBackToNavigation}
              className="mr-4 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">{activeWorkout.name}</h1>
          </div>

          {/* Exercise list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {activeWorkout.exercises.map((exercise) => (
              <div
                key={exercise.exerciseId}
                onClick={() => openExerciseView(exercise)}
                className={`
                  p-4 bg-gray-800 rounded-lg cursor-pointer 
                  hover:bg-gray-700 transition-colors
                  border ${exercise.isCompleted ? 'border-green-600' : 'border-gray-600'}
                `}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-100">{exercise.name}</span>
                  <span className="text-sm text-gray-400">
                    {exercise.sets.length} sets
                    {exercise.isCompleted && 
                      <span className="ml-2 text-green-500">✓</span>
                    }
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  {exercise.sets.filter(set => set.isCompleted).length} / {exercise.sets.length} sets completed
                </div>
              </div>
            ))}
          </div>

          {/* Footer with complete button */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex justify-between items-center">
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <MoreVertical className="w-6 h-6" />
                </button>
                
                {isMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-40 
                              bg-gray-800 rounded-lg shadow-xl p-2 z-10">
                    <button 
                      className="w-full p-2 text-left hover:bg-gray-700 rounded-md"
                      onClick={handleSkipWorkout}
                    >
                      Skip Workout
                    </button>
                    <button 
                      className="w-full p-2 text-left hover:bg-gray-700 rounded-md"
                      onClick={handleBackToNavigation}
                    >
                      View Program
                    </button>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleCompleteWorkout}
                className={`flex items-center gap-2 px-5 py-2.5 
                  ${activeWorkout.isCompleted 
                    ? 'bg-green-600 hover:bg-green-500' 
                    : 'bg-blue-600 hover:bg-blue-500'} 
                  rounded-lg transition-colors`}
              >  
                <Check className="w-6 h-6" />
                <span className="font-medium">
                  {activeWorkout.isCompleted ? 'Mark as Complete' : 'Complete Workout'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup for program start */}
      <StartProgramPopup
        isOpen={showStartPopup}
        onClose={() => setShowStartPopup(false)}
        onConfirm={handleConfirmStart}
        programName={selectedProgram ? selectedProgram.name : ''}
      />
    </div>
  );
};

// Wrapper for ExerciseView that tracks changes
const ExerciseViewWrapper = ({ exercise, onDataChange, onClose, onBack, compareWithOriginal }) => {
  const [currentSets, setCurrentSets] = useState(exercise.sets || []);
  
  // Track changes to sets
  useEffect(() => {
    const hasChanged = compareData(compareWithOriginal?.sets, currentSets);
    onDataChange(hasChanged);
  }, [currentSets, compareWithOriginal, onDataChange]);
  
  // Compare data helper
  const compareData = (originalSets, currentSets) => {
    if (!originalSets || !currentSets) return false;
    
    if (originalSets.length !== currentSets.length) return true;
    
    for (let i = 0; i < originalSets.length; i++) {
      const origSet = originalSets[i];
      const currSet = currentSets[i];
      
      if (
        origSet.completedReps !== currSet.completedReps ||
        origSet.completedValue !== currSet.completedValue ||
        origSet.weight !== currSet.weight ||
        origSet.isCompleted !== currSet.isCompleted
      ) {
        return true;
      }
    }
    
    return false;
  };
  
  // Update a set's data
  const handleSetUpdate = (index, data) => {
    const newSets = [...currentSets];
    newSets[index] = { ...newSets[index], ...data };
    setCurrentSets(newSets);
  };
  
  // Add a new set
  const addSet = () => {
    const len = currentSets.length + 1;
    const newSet = {
      setId: len,
      targetReps: exercise.sets[0]?.targetReps || -1,
      targetValue: exercise.sets[0]?.targetValue || -1,
      completedReps: null,
      completedValue: null,
      isCompleted: false,
      weight: ''
    };
    setCurrentSets([...currentSets, newSet]);
  };
  
  const hasChanges = compareData(compareWithOriginal?.sets, currentSets);
  
  return (
    <div className="max-w-md mx-auto h-screen flex flex-col text-white p-4">
      {/* Header with back button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <button 
            onClick={onBack} 
            className="mr-3 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold">{exercise.name}</h3>
        </div>
        <div className="flex gap-2">
          <button className="text-gray-400 hover:text-white">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Timer */}
      <Timer />
      
      {/* Sets list */}
      <div className="flex-grow flex flex-col gap-3 mb-4 overflow-y-auto">
        {currentSets.map((set, index) => (
          <ExerciseSetRPM
            key={index}
            setNumber={index + 1}
            targetReps={set.targetReps}
            targetValue={set.targetValue}
            onUpdate={(_, data) => handleSetUpdate(index, data)}
            set={set}
          />
        ))}
      </div>
      
      {/* Footer with add set and save buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-indigo-700">
        <button
          onClick={addSet}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <Plus className="w-5 h-5" /> Add set
        </button>
        <button
          onClick={() => onClose(currentSets, true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
            ${hasChanges 
              ? 'bg-green-600 hover:bg-green-500' 
              : 'bg-indigo-700 hover:bg-indigo-600'}`}
        >
          <Check className="w-5 h-5" /> {hasChanges ? 'Save Changes' : 'Back'}
        </button>
      </div>
    </div>
  );
};

export default WorkoutView;