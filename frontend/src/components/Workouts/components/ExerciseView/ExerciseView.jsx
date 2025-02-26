import React, { useState, useEffect } from 'react'
import { Info, MessageSquare, Check, Plus } from 'lucide-react'
import ExerciseSetRPM from './components/ExerciseSetRPM'
import Timer from './components/Timer'


const ExerciseView = ({ exercise = {}, onClose }) => {
  const [setsData, setSetsData] = useState(exercise.sets || [])

  useEffect(() => {
    if (exercise && exercise.sets) {
      setSetsData(exercise.sets)
    }
  }, [exercise])
 

  const handleSetUpdate = (setIndex, newData) => {
    const updatedSets = [...setsData]
    updatedSets[setIndex] = { ...updatedSets[setIndex], ...newData }
    setSetsData(updatedSets)
  }

  const addSet = () => {
    const len = exercise.sets.length + 1
    const newSet = {
      setId: len,
      targetReps: -1,
      targetValue: -1,
      completedReps: null,
      completedValue: null,
      isCompleted: false,
      weight: ''
    }
    setSetsData([...setsData, newSet])
  }

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col text-white p-4">
      {/* Otsikkorivi */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{exercise.name || 'Nimetön harjoitus'}</h3>
        <div className="flex gap-2">
          <button className="text-gray-400 hover:text-white">
            <Info className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-white">
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Timer */}
      <Timer />

      {/* Sarjojen lista */}
      <div className="flex-grow flex flex-col gap-3 mb-4 overflow-y-auto">
        {setsData.map((set, index) => (
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

      {/* Alarivi: vasemmalla Add set, oikealla Done */}
      <div className="flex justify-between items-center pt-4 border-t border-indigo-700">
        <button
          onClick={addSet}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <Plus className="w-5 h-5" /> Add set
        </button>
        <button
          onClick={() => onClose(setsData)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <Check className="w-5 h-5" /> Done
        </button>
      </div>
    </div>
  )
}

ExerciseView.defaultProps = {
  exercise: {
    name: 'Nimetön harjoitus',
    sets: []
  }
}

export default ExerciseView
