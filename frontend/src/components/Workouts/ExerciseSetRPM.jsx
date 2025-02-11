import React, { useState } from 'react';

const ExerciseSetRPM = ({ setNumber, plannedReps, onUpdate }) => {
  const [actualReps, setActualReps] = useState('');
  const [rpe, setRpe] = useState('');
  const [weight, setWeight] = useState('');

  const handleChange = (field, value) => {
    let newActualReps = actualReps;
    let newRpe = rpe;
    let newWeight = weight;

    switch (field) {
      case 'reps':
        newActualReps = value;
        setActualReps(value);
        break;
      case 'rpe':
        newRpe = value;
        setRpe(value);
        break;
      case 'weight':
        newWeight = value;
        setWeight(value);
        break;
      default:
        break;
    }
    onUpdate(setNumber, { actualReps: newActualReps, rpe: newRpe, weight: newWeight });
  };

  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg border border-gray-600">
      <div className="flex justify-between items-center">
        <span className="text-gray-300 font-semibold">
          {`Set ${setNumber} ${plannedReps} reps @ 8 RPE`}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col">
          <label className="text-xs text-gray-400 mb-1">Reps</label>
          <input
            type="number"
            value={actualReps}
            onChange={(e) => handleChange('reps', e.target.value)}
            className="bg-slate-800 rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-700"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-400 mb-1">kg</label>
          <input
            type="number"
            step="0.5"
            value={weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            className="bg-slate-800 rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-700"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-400 mb-1">RPE</label>
          <input
            type="number"
            step="0.5"
            value={rpe}
            onChange={(e) => handleChange('rpe', e.target.value)}
            className="bg-slate-800 rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-700"
          />
        </div>
      </div>
    </div>
  );
};

export default ExerciseSetRPM;
