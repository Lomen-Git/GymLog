import React, { useEffect, useState, useCallback } from 'react'
import { Info, MoreVertical, Check, ArrowLeft, Plus } from 'lucide-react'
import {
  getWorkoutByIndex,
  createWorkoutSession
} from './utils/workoutHelpers'
import {
  getOngoingProgram,
  getProgramList,
  createOngoingProgram,
  createCompletedWorkout
} from '../../services/programServices'

// Components
import ExerciseView from './components/ExerciseView/ExerciseView'
import ProgramListView from '../EditProgram/ProgramListView'
import { WorkoutHeader } from './components/WorkoutHeader'
import { WorkoutFooter } from './components/WorkoutFooter'
import Timer from './components/ExerciseView/components/Timer'
import ExerciseSetRPM from './components/ExerciseView/components/ExerciseSetRPM'
// Popups
import { StartProgramPopup } from './Popups/StartProgramPopup'

const WorkoutView = () => {
  // Originaali data kannasta
  const [originalWorkout, setOriginalWorkout] = useState(null)
  // Muokattava versio
  const [activeWorkout, setActiveWorkout] = useState(null)
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [exerciseDataBeforeEdit, setExerciseDataBeforeEdit] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [programList, setProgramList] = useState([])
  const [showStartPopup, setShowStartPopup] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [hasExerciseChanged, setHasExerciseChanged] = useState(false)

  // Haetaan suoritettava ohjelma
  useEffect(() => {
    fetchOngoing()
  }, [])

  // Logitus vain kehitystä varten
  useEffect(() => {
    console.log('Original workout data:', originalWorkout)
    console.log('Active workout data:', activeWorkout)
  }, [originalWorkout, activeWorkout])


  const fetchOngoing = async () => {
    try {
      const data = await getOngoingProgram()
      if (data === null) {
        try {
          const listData = await getProgramList()
          setProgramList(listData)
        } catch (error) {
          console.error('Error fetching program list')
        }
      } else { 
        const workout = getWorkoutByIndex(
          data.program,
          data.execution.weekIndex,
          data.execution.workoutIndex,
          data.execution.id
        )
        
        // Lisätään tarpeelliset metatiedot workout-olioon
        const workoutSession = {
          ...createWorkoutSession(workout),
          // Lisätään viikko- ja treeni-indeksit
          weekIndex: data.execution.weekIndex, 
          workoutIndex: data.execution.workoutIndex,
          // Lisätään ohjelmatietoja
          programExecutionId: data.execution.id,
          programId: data.program.id,
          totalWeeks: data.program.weeks.length,
          // Lisää tarvittavat metatiedot ohjelmasta
          totalWorkoutsInWeek: data.program.weeks[data.execution.weekIndex].workouts.length
        }
        
        // Tallennetaan sekä alkuperäinen että aktiivinen versio
        setOriginalWorkout(workoutSession)
        // Syvä kopio sisältää myös lisätyt metatiedot
        setActiveWorkout(JSON.parse(JSON.stringify(workoutSession)))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const moveToNextWorkout = async () => {
    try {
      if (!activeWorkout) return; // Ei aktiivista treeniä
      
      let { weekIndex, workoutIndex, totalWorkoutsInWeek, totalWeeks, programExecutionId } = activeWorkout;
      
      // Tarkistetaan onko viikossa vielä treenejä jäljellä
      if (workoutIndex + 1 < totalWorkoutsInWeek) {
        // Samalla viikolla seuraava treeni
        workoutIndex++;
      } else if (weekIndex + 1 < totalWeeks) {
        // Seuraava viikko, ensimmäinen treeni
        weekIndex++;
        workoutIndex = 0;
      } else {
        // Ohjelma on valmis
        console.log("Ohjelma suoritettu loppuun!");
        // Tässä voisi esim. nollata käynnissä olevan ohjelman
        return;
      }
      
      // Päivitä käynnissä oleva ohjelma uusilla indekseillä
      await updateProgramExecution(programExecutionId, weekIndex, workoutIndex);
      
      // Hae seuraava treeni päivitetyillä indekseillä
      await fetchOngoing();
    } catch (error) {
      console.error("Error moving to next workout:", error);
    }
  };

  // Aloitetaan ohjelman suoritus
  const startProgram = (id) => {
    for (let program of programList) {
      if (program.id === id) {
        setSelectedProgram(program)
        break
      }
    }
    setShowStartPopup(true)
  }
  
  const handleConfirm = async (id) => {
    await createOngoingProgram(selectedProgram.id)
    await fetchOngoing()
    setShowStartPopup(false)
  }

  // Avaa exercise-näkymän ja tallentaa sen nykyisen tilan
  const openExerciseView = useCallback((exercise) => {
    // Tallennetaan liikedata ennen muokkausta vertailua varten
    setExerciseDataBeforeEdit(JSON.parse(JSON.stringify(exercise)));
    setSelectedExercise(exercise);
    setHasExerciseChanged(false);
  }, []);

  // Vertaile onko exercise muuttunut
  const hasDataChanged = useCallback((originalData, newData) => {
    if (!originalData || !newData) return false;
    
    // Jos sarjojen määrä on muuttunut
    if (originalData.sets.length !== newData.length) return true;
    
    // Tarkistetaan jokainen sarja muutosten varalta
    for (let i = 0; i < originalData.sets.length; i++) {
      const origSet = originalData.sets[i];
      const newSet = newData[i];
      
      if (
        origSet.completedReps !== newSet.completedReps ||
        origSet.completedValue !== newSet.completedValue ||
        origSet.weight !== newSet.weight ||
        origSet.isCompleted !== newSet.isCompleted
      ) {
        return true;
      }
    }
    
    return false;
  }, []);

  // Kun exercise-näkymässä painetaan Done/Back
  const handleExerciseClose = useCallback((exerciseId, updatedSets, saveChanges = true) => {
    // Jos ei tallenneta muutoksia, palataan alkuperäiseen tilaan
    if (!saveChanges) {
      setSelectedExercise(null);
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
        }
      }
  
      // Tarkistetaan onko koko workout valmis
      newWorkout.isCompleted = newWorkout.exercises.every(ex => ex.isCompleted);
      
      return newWorkout;
    });
    
    setSelectedExercise(null);
  }, []);
  
  const handleCompleteWorkout = async () => {
    try {
      await moveToNextWorkout()
      await createCompletedWorkout(activeWorkout);
      // Nollataan tilat treenit suorituksen jälkeen
      setActiveWorkout(null);
      setOriginalWorkout(null);
      await fetchOngoing(); // Haetaan seuraavan treeni tai ohjelmalista
    } catch (error) {
      console.error("Error completing workout:", error);
    }
  };
  
  // Jos exercise on valittu, näytetään sen näkymä
  if (selectedExercise) {
    return (
      <ExerciseViewWrapper
        exercise={selectedExercise}
        onDataChange={(hasChanged) => setHasExerciseChanged(hasChanged)}
        onClose={(updatedSets, saveChanges) => {
          handleExerciseClose(selectedExercise.exerciseId, updatedSets, saveChanges);
        }}
        onBack={() => {
          // Tarkista onko muutoksia ennen peruuttamista
          if (hasExerciseChanged) {
            // TODO: kysy käyttäjältä haluaako tallentaa muutokset
            // Tässä voisi avata modaalin jossa kysytään haluaako tallentaa
            if (window.confirm("Haluatko tallentaa muutokset?")) {
              handleExerciseClose(selectedExercise.exerciseId, selectedExercise.sets, true);
            } else {
              handleExerciseClose(selectedExercise.exerciseId, null, false);
            }
          } else {
            // Ei muutoksia, palataan suoraan
            setSelectedExercise(null);
          }
        }}
        compareWithOriginal={exerciseDataBeforeEdit}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gray-900 bg-opacity-20 text-white p-4">
      {activeWorkout === null ? (
        <div className="text-white">
          <p>You don't have program in progress</p>
          {programList && 
            <ProgramListView
              programs={programList}
              onProgramSelect={startProgram}
            />
          }
        </div>
      ) : (
        <>
          <WorkoutHeader workoutName={activeWorkout.name} />

          {/* Harjoituslista */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-3">
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

          <div className="pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <MoreVertical className="w-7 h-7" />
                </button>
                
                {isMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-32 
                              bg-gray-800 rounded-lg shadow-xl p-2">
                    <button className="w-full p-2 text-left hover:bg-gray-700 rounded-md">
                      Muokkaa
                    </button>
                    <button className="w-full p-2 text-left hover:bg-gray-700 rounded-md">
                      Jaa
                    </button>
                  </div>
                )}
              </div>
              
              <button 
                className={`flex items-center gap-2 px-5 py-2.5 
                ${activeWorkout.isCompleted 
                  ? 'bg-green-600 hover:bg-green-500' 
                  : 'bg-blue-600 hover:bg-blue-500'} 
                rounded-lg transition-colors`}
                onClick={handleCompleteWorkout}
              >  
                <Check className="w-6 h-6" />
                <span className="font-medium">
                  {activeWorkout.isCompleted ? 'Complete Workout' : 'Done'}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
      <StartProgramPopup
        isOpen={showStartPopup}
        onClose={() => setShowStartPopup(false)}
        onConfirm={handleConfirm}
        programName={selectedProgram ? selectedProgram.name : ''}
      />
    </div>
  )
}

// Wrapper ExerciseView:lle joka seuraa muutoksia
const ExerciseViewWrapper = ({ exercise, onDataChange, onClose, onBack, compareWithOriginal }) => {
  const [currentSets, setCurrentSets] = useState(exercise.sets || []);
  
  // Seurataan muutoksia
  useEffect(() => {
    const hasChanged = compareData(compareWithOriginal?.sets, currentSets);
    onDataChange(hasChanged);
  }, [currentSets, compareWithOriginal, onDataChange]);
  
  // Vertailu funktio
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
  
  const handleSetUpdate = (index, data) => {
    const newSets = [...currentSets];
    newSets[index] = { ...newSets[index], ...data };
    setCurrentSets(newSets);
  };
  
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
      {/* Otsikkorivi */}
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
      
      {/* Sarjojen lista */}
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
      
      {/* Alarivi: vasemmalla Add set, oikealla Back/Done */}
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

export default WorkoutView