
import React, { useState, useEffect } from "react";
import { getUserExercises } from "../../../services/gymServices";

export const AddExercisePopUp = ({ isOpen, onClose, onAdd, setIsAddMovementOpen, weekIndex, workoutIndex, choice }) => {
  const [filter, setFilter] = useState(""); 
  const [selectedExercise, setSelectedExercise] = useState(null); 
  const [exerciseChoice, setExerciseChoice] = useState(choice || 3);

  if (!isOpen) return null;

  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getUserExercises();
        setExercises(data);
      } catch (error) {
        console.error('Error loading exercises');
      }
    };

    fetchExercises();
  }, [isOpen]);

  const handleAddExerciseToList = () => {
    setIsAddMovementOpen(true);
  };

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(filter.toLowerCase())
  );

  const choiceOptions = [
    { value: 1, label: 'RPM' },
    { value: 2, label: '%' },
    { value: 3, label: 'None' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add Exercise</h2>
        
        {/* Choice Buttons */}
        <div className="flex space-x-1 mb-4 justify-center">
          {choiceOptions.map((option) => (
            <button
              key={option.value}
              className={`
                px-3 py-2 rounded-md text-sm font-medium
                transition-colors duration-200
                ${exerciseChoice === option.value
                  ? "bg-indigo-900 text-indigo-400"
                  : "bg-gray-800 text-gray-300 hover:text-indigo-400 hover:bg-gray-700"
                }
              `}
              onClick={() => setExerciseChoice(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Filter Input */}
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search exercises"
          className="w-full p-2 border text-black rounded mb-4"
        />

        {/* Scrollable List */}
        <div className="max-h-48 overflow-y-auto border rounded mb-4">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise)}
              className={`p-2 cursor-pointer ${
                selectedExercise === exercise
                  ? "bg-blue-100 text-blue-800"
                  : "hover:bg-gray-100"
              }`}
            >
              {exercise.name}
            </div>
          ))}
          {filteredExercises.length === 0 && (
            <p className="p-2 text-gray-500">No exercises found</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleAddExerciseToList}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            New..
          </button>
          <div className="flex-grow" />
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedExercise) {
                onAdd(selectedExercise, exerciseChoice, weekIndex, workoutIndex);
                setFilter("");
                setSelectedExercise(null);
              }
            }}
            disabled={!selectedExercise}
            className={`px-4 py-2 rounded ${
              selectedExercise
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};