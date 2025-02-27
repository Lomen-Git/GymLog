import React from 'react';
import { Info, MoreVertical, Check, ArrowLeft, Plus, RefreshCcw } from 'lucide-react';

// Components
import ExerciseView from './components/ExerciseView/ExerciseView';
import ProgramListView from '../EditProgram/ProgramListView';
import WorkoutNavigation from './components/WorkoutNavigation';
import CompletedWorkoutView from './components/CompletedWorkoutView';
import ExerciseSetRPM from './components/ExerciseView/components/ExerciseSetRPM';
import Timer from './components/ExerciseView/components/Timer';
import ExerciseHistoryView from './components/ExerciseHistoryView';

// Popups
import { StartProgramPopup } from './Popups/StartProgramPopup';

const WorkoutView = (props) => {
  const {
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
  } = props;

  // Local UI state
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
            handleExerciseClose(selectedExercise.exerciseId, null, false);
          }
        }}
        onViewHistory={() => handleViewExerciseHistory(selectedExercise)}
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

  // If in exercise history view
  if (viewMode === 'exerciseHistory' && viewingHistoryForExercise) {
    return (
      <ExerciseHistoryView
        exerciseId={viewingHistoryForExercise.exerciseId}
        exerciseName={viewingHistoryForExercise.name}
        onBack={handleBackFromHistory}
      />
    );
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
            {activeWorkout && Array.isArray(activeWorkout.exercises) && activeWorkout.exercises.length > 0 ? (
              activeWorkout.exercises.map((exercise) => (
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
              ))
            ) : (
              <div className="p-4 text-center text-gray-400">
                {!activeWorkout ? "No workout selected" : 
                !activeWorkout.exercises ? "No exercises found in this workout" :
                "This workout has no exercises"}
              </div>
            )}
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
const ExerciseViewWrapper = ({ exercise, onDataChange, onClose, onBack, onViewHistory, compareWithOriginal }) => {
  const [currentSets, setCurrentSets] = React.useState(exercise.sets || []);
  
  // Track changes to sets
  React.useEffect(() => {
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
          <button 
            onClick={onViewHistory}
            className="text-gray-400 hover:text-white">
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

// Helper function for WorkoutView to access
const getWorkoutByIndices = (program, weekIndex, workoutIndex) => {
  if (!program || !program.weeks || weekIndex === null || workoutIndex === null) {
    return null;
  }
  
  const week = program.weeks[weekIndex];
  if (!week || !week.workouts) {
    return null;
  }
  
  return week.workouts[workoutIndex] || null;
};

export default WorkoutView;