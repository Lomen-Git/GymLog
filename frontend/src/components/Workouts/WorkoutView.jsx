import React, { useEffect, useState } from 'react';
import ExerciseView from './ExerciseView';
import { Info, MoreVertical, Check } from 'lucide-react';
import { getOngoingProgram, getProgramList } from '../../services/programServices';
import ProgramListView from '../EditProgram/ProgramListView';

const WorkoutView = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [programList, setProgramList] = useState([])
  const [workout, setWorkout] = useState(null)

  useEffect(() => {
    fetchOngoing()
  }, [])

  const fetchOngoing = async () => {
    try {
      const program = await getOngoingProgram()
      console.log('tälläi löytyi, tai siis ei löytyny', program)

      if (program === null) {
          try {
            const data = await getProgramList()
            setProgramList(data)
          } catch (error) {
            console.error('Error fetching program list')
          }
      }

    } catch (error) {
      console.error(error)
    }
  }
  

  // Dummy data varmistettuna
  /*
  const workout = {
    name: "Maanantai",
    exercises: [
      { 
        id: 1, 
        name: "Penkkipunnerrus", 
        sets: Array.from({ length: 4 }, (_, i) => ({ 
          reps: 10 + i, 
          weight: 60 + i * 2.5 
        })) 
      },
      { 
        id: 2, 
        name: "Hauiskääntö", 
        sets: Array.from({ length: 3 }, (_, i) => ({ 
          reps: 12 + i, 
          weight: 20 + i * 2 
        })) 
      }
    ]
  };
/*
  // uudet template ja suorituksessa olevat oliot
  const workoutTemplate = {
    name: "Workout 1",
    exercises: [
        {
            name: "Penkki",
            exerciseId: 1,
            sets: [
                { reps: 8, value: 8 },
                { reps: 8, value: 8 },
                { reps: 8, value: 8 }
            ]
        },
        {
            name: "Kyykky",
            exerciseId: 2,
            sets: [
                { reps: 8, value: 8 },
                { reps: 8, value: 8 },
                { reps: 8, value: 8 }
            ]
        }
    ]
}*/

  if (selectedExercise) {
    return <ExerciseView exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />;
  }


  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gray-900 bg-opacity-20 text-white p-4">
      {workout === null ? (
        <div className="text-white">
          <p>You dont have program in progress</p>
          {programList && 
            <ProgramListView
            programs={programList}
            onProgramSelect={() => console.log('haetaan tän ohjelman tiedot mjoo')}
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
                className="p-4 bg-gray-800 rounded-lg cursor-pointer 
                        hover:bg-gray-700 transition-colors
                        border border-gray-700"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-100">{exercise.name}</span>
                  <span className="text-sm text-gray-400">
                    {exercise.sets.length} sarjaa
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
                              transition-colors">
                <Check className="w-6 h-6" />
                <span className="font-medium">Done</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default WorkoutView