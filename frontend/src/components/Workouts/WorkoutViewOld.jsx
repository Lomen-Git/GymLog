import React, { useEffect, useState } from 'react'
import { Info, MoreVertical, Check } from 'lucide-react'
import {
  getWorkoutByIndex,                    // Util
  createWorkoutSession                  // Util
} from './utils/workoutHelpers'
import {
  getOngoingProgram,                    // Serivce
  getProgramList,                       // Service
  createOngoingProgram,                 // Serivce
  createCompletedWorkout                // Service
} from '../../services/programServices'

// Components
import ExerciseView from './components/ExerciseView/ExerciseView'
import ProgramListView from '../EditProgram/ProgramListView'
// Popups
import { StartProgramPopup } from './Popups/StartProgramPopup'


const WorkoutView = () => {
  const [selectedExercise, setSelectedExercise] = useState(null)  // Suorituksessa oleva liike
  const [isMenuOpen, setIsMenuOpen] = useState(false)             //
  const [programList, setProgramList] = useState([])              // Ohjelmat, jos mikään ei suorituksessa
  const [workout, setWorkout] = useState(null)                    // Treeni
  const [showStartPopup, setShowStartPopup] = useState(false)     //
  const [selectedProgram, setSelectedProgram] = useState(null)    // Ohjelman aloitusta

  // Haetaan suoritettava ohjelma
  useEffect(() => {
    fetchOngoing()
  }, [])

  // Tulosta ohjelma
  useEffect(() => {
    console.log(workout)
  }, [workout])

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
        const workoutSession = createWorkoutSession(workout)
        setWorkout(workoutSession)
      }
      
    } catch (error) {
      console.error(error)
    }
  }

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

  const handleExerciseComplete = (exerciseId, updatedSets) => {
    setWorkout((prevWorkout) => {
      const newWorkout = { ...prevWorkout };
  
      const exerciseIndex = newWorkout.exercises.findIndex((ex) => ex.id === exerciseId);
      if (exerciseIndex !== -1) {
        newWorkout.exercises[exerciseIndex] = {
          ...newWorkout.exercises[exerciseIndex],
          sets: updatedSets,
          isCompleted: updatedSets.every(set => set.isCompleted),
        }
      }
  
      return newWorkout
    })
  }
  
  // Palautetaan suorituksessa oleva liike
  if (selectedExercise) {
    return (
      <ExerciseView
        exercise={selectedExercise}
        onClose={(updatedSets) => {
          handleExerciseComplete(selectedExercise.id, updatedSets)
          setSelectedExercise(null)
        }}
      />
    )
  }

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gray-900 bg-opacity-20 text-white p-4">
      {workout === null ? (
        <div className="text-white">
          <p>You dont have program in progress</p>
          {programList && 
            <ProgramListView
            programs={programList}
            onProgramSelect={startProgram}
            />
          }
        </div>
        ) : (
        <>
          {/* Ylärivi */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-100">{workout.name}</h1>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Info className="w-6 h-6" />
            </button>
          </div>

          {/* Harjoituslista - varmistettu flex-säiliön korkeus */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-3">
            {workout.exercises.map((exercise) => (
              <div
                key={exercise.id}
                onClick={() => setSelectedExercise(exercise)}
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
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Alarivi - varmistettu kiinnitys alareunaan */}
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
              
              <button className="flex items-center gap-2 px-5 py-2.5 
                              bg-blue-600 hover:bg-blue-500 rounded-lg 
                              transition-colors"
                      onClick={() => createCompletedWorkout(workout)}
              >  
                <Check className="w-6 h-6" />
                <span className="font-medium">Done</span>
              </button>
            </div>
          </div>
        </>
      )}
      <StartProgramPopup
        isOpen={showStartPopup}
        onClose={() => setShowStartPopup(false)}
        onConfirm={handleConfirm}
        programName={selectedProgram? selectedProgram.name : 'asd'}
      />
    </div>
  )
}

export default WorkoutView