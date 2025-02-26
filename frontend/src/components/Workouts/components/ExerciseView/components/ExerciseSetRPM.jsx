import React, { useState } from 'react'

const ExerciseSetRPM = ({ setNumber, targetReps, targetValue, onUpdate, set }) => {
  const [actualReps, setActualReps] = useState(set?.completedReps ?? '')
  const [rpe, setRpe] = useState(set?.completedValue ?? '')
  const [weight, setWeight] = useState(set?.weight ?? '')
  const [allDone, setAllDone] = useState(set?.isCompleted ?? false)

  const handleRepsChange = (value) => {
    setActualReps(value)
    updateSet(value, rpe, weight)
  }

  const handleRpeChange = (value) => {
    setRpe(value)
    updateSet(actualReps, value, weight)
  }

  const handleWeightChange = (value) => {
    setWeight(value)
    updateSet(actualReps, rpe, value)
  }

  // Erillinen funktio completed-datan päivittämiseen
  const updateSet = (newReps, newRpe, newWeight) => {
    const completed = Boolean(newReps && newRpe && newWeight)
    
    onUpdate(setNumber, {
      actualReps: newReps,
      rpe: newRpe,
      weight: newWeight,
      completedReps: completed ? newReps : null,
      completedValue: completed ? newRpe : null,
      completedWeight: completed ? newWeight : null,
      isCompleted: completed
    })

    setAllDone(completed)
  }

  return (
    <div
      className={`flex flex-col gap-2 p-4 rounded-lg border ${
        allDone ? 'border-green-600' : 'border-gray-600'
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="text-gray-300 font-semibold">
          {`${targetReps} reps @ ${targetValue} RPE`}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col">
          <label className="text-xs text-gray-400 mb-1">Reps</label>
          <input
            type="number"
            value={actualReps}
            placeholder={targetReps}
            onChange={(e) => handleRepsChange(e.target.value)}
            className="bg-slate-800 rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-700"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-400 mb-1">kg</label>
          <input
            type="number"
            step="0.5"
            value={weight}
            onChange={(e) => handleWeightChange(e.target.value)}
            className="bg-slate-800 rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-700"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-400 mb-1">RPE</label>
          <input
            type="number"
            step="0.5"
            placeholder={targetValue}
            value={rpe}
            onChange={(e) => handleRpeChange(e.target.value)}
            className="bg-slate-800 rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-700"
          />
        </div>
      </div>
    </div>
  )
}

export default ExerciseSetRPM
