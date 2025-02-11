import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, ChevronDown, RefreshCcw } from 'lucide-react';
import Toolbar from './Toolbar/Toolbar';
import { toggleExercise, toggleWeek, toggleWorkout } from './Toggles'
import { getUserExercises } from '../../services/gymServices';
import { getProgramList, getProgramDetails } from '../../services/programServices';
import ProgramListView from './ProgramListView';
import ReactDOM from 'react-dom';

import { AddExercisePopUp } from './PopUps/AddExercisePopup';
import { AddMovementPopUp } from './PopUps/AddMovementPopUp';

const WorkoutEditor = () => {
  const [userExercises, setUserExercises] = useState([])
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false)
  const [weekIndexForFunctions, setWeekIndexForFunctions] = useState(0)
  const [workoutIndexForFunctions, setWorkoutIndexForFunctions] = useState(0)
  const [program, setProgram] = useState(null);
  const [savedProgram, setSavedProgram] = useState(null);
  const [programList, setProgramList] = useState([])
  const [isMovementOpen, setIsMovementOpen] = useState(false)
  const [notSaved, setNotSaved] = useState(false)

  useEffect(() => {
    fetchProgramList()
  }, [])

  useEffect(() => {
    console.log(program)
    fetchExercises()
  }, [program])

  const fetchExercises = async () => {
    try {
      const data = await getUserExercises()
      setUserExercises(data)
    } catch (error) {
      console.error('Error loading exercises')
    }
  }

  const fetchProgramList = async () => {
    try {
      const data = await getProgramList()
      setProgramList(data)
    } catch (error) {
      console.error('Error fetching program list')
    }
  }

  const handleAddMovement = (movement) => {
    console.log("Added movement:", movement)
    setIsMovementOpen(false)
  }

  const transformProgram = async (programData) => {
    return {
      id: programData.id,
      name: programData.name,
      unit: programData.choice === 1 ? 'RPM' : 
             programData.choice === 2 ? '%' : 'None',
      isOpen: false,
      weeks: programData.Weeks.map(week => ({
        weekNumber: week.order,
        name: week.name,
        isOpen: false,
        workouts: week.Workouts.map(workout => ({
          name: workout.name,
          isOpen: false,
          exercises: workout.WorkoutExercises.map(workoutExercise => ({
            name: workoutExercise.Exercise ? workoutExercise.Exercise.name : '',
            exerciseId: workoutExercise.exerciseId,
            choice: workoutExercise.choice,
            isOpen: false,
            sets: workoutExercise.Sets.map(set => ({
              reps: set.reps,
              value: set.value
            }))
          }))
        }))
      }))
    }
  }

  const fetchProgramDetails = async (programId) => {
    try {
      const data = await getProgramDetails(programId)
      console.log('onko tässä exercise nimi', data)
      const programData = await transformProgram(data)
      setProgram(programData)
      console.log('miksi saved muuttuu??')
      setSavedProgram(JSON.parse(JSON.stringify(programData)))
    } catch (error) {
      console.error('Error fetching program details')
    }
  }

  const addWeek = () => {
    console.log('add week funktio kutsuttu')
    setProgram(prev => {
      const newProgram = { ...prev };
      const weekCount = newProgram.weeks.length;
      const newWeekNumber = weekCount + 1;
      
      newProgram.weeks.push({
        weekNumber: newWeekNumber,
        name: `Week ${newWeekNumber}`,
        isOpen: true,
        workouts: [
          {
            name: 'Workout 1',
            isOpen: true,
            exercises: []
          }
        ]
      });
      
      return newProgram;
    });
  };

  const addWorkout = (weekIndex) => {
    setProgram(prev => {
      const newProgram = { ...prev };
      const workoutCount = newProgram.weeks[weekIndex].workouts.length;
      newProgram.weeks[weekIndex].workouts.push({
        name: `Workout ${workoutCount + 1}`,
        isOpen: true,
        exercises: []
      });
      return newProgram;
    });
  };

  const handleAddExercise = (exercise, choice, weekIndex, workoutIndex) => {
    setProgram((prev) => {
      const newProgram = { ...prev };
      newProgram.weeks[weekIndex].workouts[workoutIndex].exercises.push({
        name:
          exercise.name ||
          `Exercise ${
            newProgram.weeks[weekIndex].workouts[workoutIndex].exercises.length +
            1
          }`,
        exerciseId: exercise.id,
        choice: choice,
        isOpen: true,
        sets: [{ reps: '8', value: '8.0' }],
      });
      return newProgram;
    });
    setIsAddExerciseOpen(false);
  };

  const deleteExercise = (weekIndex, workoutIndex, exerciseIndex) => {
    setProgram(prev => {
      const newProgram = { ...prev };
      newProgram.weeks[weekIndex].workouts[workoutIndex].exercises.splice(exerciseIndex, 1);
      return newProgram;
    });
  };

  const deleteWorkout = (weekIndex, workoutIndex) => {
    setProgram(prev => {
      const newProgram = { ...prev };
      newProgram.weeks[weekIndex].workouts.splice(workoutIndex, 1);
      return newProgram;
    });
  };

  const addSet = (weekIndex, workoutIndex, exerciseIndex) => {
    setProgram(prev => {
      const newProgram = { ...prev };
      newProgram.weeks[weekIndex].workouts[workoutIndex].exercises[exerciseIndex].sets.push({
        reps: '8',
        value: '8.0'
      });
      return newProgram;
    });
  };

  const deleteSet = (weekIndex, workoutIndex, exerciseIndex, setIndex) => {
    setProgram(prev => {
      const newProgram = { ...prev };
      newProgram.weeks[weekIndex].workouts[workoutIndex].exercises[exerciseIndex].sets.splice(setIndex, 1);
      return newProgram;
    });
  };

  const incrementValue = (weekIndex, workoutIndex, exerciseIndex, setIndex, field) => {
    console.log('increment called');
    console.log('current field:', field);
    setProgram(prev => {
      const newProgram = { ...prev };
      const currentValue = parseFloat(newProgram.weeks[weekIndex].workouts[workoutIndex].exercises[exerciseIndex].sets[setIndex][field]);
      const increment = field === 'reps' ? 1 : 0.5;
      const newValue = (currentValue + increment).toFixed(1);
      newProgram.weeks[weekIndex].workouts[workoutIndex].exercises[exerciseIndex].sets[setIndex][field] = newValue;
      return newProgram;
    });
};
  
  const decrementValue = (weekIndex, workoutIndex, exerciseIndex, setIndex, field) => {
    setProgram(prev => {
      const newProgram = { ...prev };
      const currentValue = parseFloat(newProgram.weeks[weekIndex].workouts[workoutIndex].exercises[exerciseIndex].sets[setIndex][field]);
      const decrement = field === 'reps' ? 1 : 0.5; // Pienennys/arvon vähennys sääntö
      const newValue = Math.max(0, currentValue - decrement).toFixed(1); // Varmistetaan, ettei mene alle 0
      newProgram.weeks[weekIndex].workouts[workoutIndex].exercises[exerciseIndex].sets[setIndex][field] = newValue;
      return newProgram;
    });
  };  

  const updateSet = (weekIndex, workoutIndex, exerciseIndex, setIndex, field, value) => {
    setProgram(prev => {
      const newProgram = { ...prev };
      newProgram.weeks[weekIndex].workouts[workoutIndex].exercises[exerciseIndex].sets[setIndex][field] = value;
      return newProgram;
    });
  };


  return (
    <div className="relative w-full min-h-screen p-0 sm:p-4">
      <div className='w-full'>
        <Toolbar
          program={program}
          setProgram={setProgram}
          savedProgram={savedProgram}
          setSavedProgram={setSavedProgram}
          onTitleChange={(newTitle) => setProgram(prev => ({ ...prev, name: newTitle }))}
          onUnitChange={(unit) => setProgram(prev => ({ ...prev, unit: unit }))}
          addWeek={addWeek}
          fetchProgramDetails={fetchProgramDetails}
          notSaved={notSaved}
          setNotSaved={setNotSaved}
          transformProgram={transformProgram}
        />
      </div>
        <div>
        {program === null ? (
          <div className="text-white">
          <p>Create new program or open existing one</p>
          <button 
            onClick={() => fetchProgramList()} 
            className="border border-white bg-transparent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out"
          >
            <RefreshCcw className="w-5 h-5" />
            Refresh
          </button>
          {programList && (
            <ProgramListView
            programs={programList}
            onProgramSelect={fetchProgramDetails}
            />
          )}
        </div>
      ) : (
        program.weeks.map((week, weekIndex) => (
            <div key={weekIndex}
              className={'mb-4 bg-gray-100 bg-opacity-10 rounded-md shadow-md text-white'}
            >
            <div 
             className="flex items-center p-4 cursor-pointer border border-transparent hover:border-white rounded-md transition-all duration-200"
            onClick={() => toggleWeek(weekIndex, setProgram)}
            >

            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${week.isOpen ? 'transform rotate-180' : ''}`}
            />

            <h2 className="text-xl font-semibold">{week.name}</h2>
            </div>
            
            {week.isOpen && (
              <div className="p-4 pt-0">
                <button
                  onClick={() => {
                    addWorkout(weekIndex)
                  }}
                  className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Workout
                </button>

                {week.workouts.map((workout, workoutIndex) => (
                  <div
                    key={workoutIndex}
                    className="mt-4 rounded p-4 bg-gray-500 bg-opacity-20 shadow-lg border border-black/10 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center p-2 cursor-pointer hover:bg-gray-500 rounded flex-grow"
                        onClick={() => toggleWorkout(weekIndex, workoutIndex, setProgram)}
                      >
                        {workout.isOpen ? 
                          <Minus className="w-4 h-4 mr-2" /> : 
                          <Plus className="w-4 h-4 mr-2" />
                        }
                        <h3 className="text-lg font-medium">{workout.name}</h3>
                      </div>
                      <button
                        onClick={() => deleteWorkout(weekIndex, workoutIndex)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {workout.isOpen && (
                      <div className="pl-4 mt-4">
                        <button
                          onClick={() => {
                            setIsAddExerciseOpen(true)
                            setWeekIndexForFunctions(weekIndex)
                            setWorkoutIndexForFunctions(workoutIndex)
                          }}
                          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Exercise
                        </button>

                        {workout.exercises.map((exercise, exerciseIndex) => (
                          <div key={exerciseIndex} className="mt-2 border rounded p-4">
                            <div className="flex items-center justify-between">
                              <div 
                                className="flex items-center p-2 cursor-pointer hover:bg-gray-500 rounded flex-grow"
                                onClick={() => toggleExercise(weekIndex, workoutIndex, exerciseIndex, setProgram)}
                              >
                                {exercise.isOpen ? 
                                  <Minus className="w-4 h-4 mr-2" /> : 
                                  <Plus className="w-4 h-4 mr-2" />
                                }
                                <h4 className="font-medium">{exercise.name}</h4>
                              </div>
                              
                              <button
                                onClick={() => console.log('jotain ehkä pitäis tapahtua')}
                                className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-900 text-indigo-400"
                                key={exercise.choice}
                              >{exercise.choice === 1 ? 'RPM' : exercise.choice === 2 ?  '%': 'None'}</button>

                              <button
                                onClick={() => deleteExercise(weekIndex, workoutIndex, exerciseIndex)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {exercise.isOpen && (
                              <div className="mt-2 overflow-x-auto">
                                <table className="w-full border-collapse">
                                  <thead>
                                    <tr className="bg-gray-500">
                                      <th className="px-4 py-2 text-left border-b">Set</th>
                                      <th className="px-4 py-2 text-left border-b">Reps</th>
                                      <th className="px-4 py-2 text-left border-b">{exercise.choice === 1 ? 'RPM' : exercise.choice === 2 ?  '%': 'None'}</th>
                                      <th className="px-4 py-2 text-left border-b">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {exercise.sets.map((set, setIndex) => (
                                      <tr key={setIndex} className="border-b last:border-b-0">
                                        <td className="px-4 py-2">{setIndex + 1}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center space-x-2">
                                              <button
                                                onClick={() => decrementValue(weekIndex, workoutIndex, exerciseIndex, setIndex, 'reps')}
                                                className="p-1 bg-cyan-950 hover:bg-gray-900 rounded"
                                                >
                                                <Minus className="w-3 h-3" />
                                              </button>
                                              <input
                                                type="text"
                                                value={set.reps}
                                                onChange={(e) => updateSet(weekIndex, workoutIndex, exerciseIndex, setIndex, 'reps', e.target.value)}
                                                className="w-16 px-2 py-1 bg-slate-950 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                              <button
                                                onClick={() => incrementValue(weekIndex, workoutIndex, exerciseIndex, setIndex, 'reps')}
                                                className="p-1 bg-cyan-950 hover:bg-black rounded"
                                                >
                                                <Plus className="w-3 h-3" />
                                              </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                          {exercise.choice != 3 &&
                                            <div className="flex items-center space-x-2">
                                              <button
                                                onClick={() => decrementValue(weekIndex, workoutIndex, exerciseIndex, setIndex, 'value')}
                                                className="p-1 bg-cyan-950 hover:bg-black rounded"
                                                >
                                                <Minus className="w-3 h-3" />
                                              </button>
                                              <input
                                                type="text"
                                                value={set.value}
                                                onChange={(e) => updateSet(weekIndex, workoutIndex, exerciseIndex, setIndex, 'value', e.target.value)}
                                                className="w-16 px-2 py-1 bg-slate-950 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                              <button
                                                onClick={() => incrementValue(weekIndex, workoutIndex, exerciseIndex, setIndex, 'value')}
                                                className="p-1 bg-cyan-950 hover:bg-black rounded"
                                                >
                                                <Plus className="w-3 h-3" />
                                              </button>
                                            </div>
                                            }
                                        </td>
                                        <td className="px-4 py-2">
                                          <button
                                            onClick={() => deleteSet(weekIndex, workoutIndex, exerciseIndex, setIndex)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                <button
                                  onClick={() => addSet(weekIndex, workoutIndex, exerciseIndex)}
                                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Set
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}  
      </div>
      {isAddExerciseOpen && ReactDOM.createPortal(
        <AddExercisePopUp
        isOpen={isAddExerciseOpen}
        onClose={() => setIsAddExerciseOpen(false)}
        onAdd={handleAddExercise}
        setIsAddMovementOpen={setIsMovementOpen}
        weekIndex={weekIndexForFunctions}
        workoutIndex={workoutIndexForFunctions}
        choice={program.choice}
        />,
        document.body
      )}
      {isMovementOpen && ReactDOM.createPortal(
        <AddMovementPopUp
        isOpen={isMovementOpen}
        onClose={() => setIsMovementOpen(false)}
        onAdd={handleAddMovement}
        />,
        document.body
      )}
    </div>
  )
}

export default WorkoutEditor;