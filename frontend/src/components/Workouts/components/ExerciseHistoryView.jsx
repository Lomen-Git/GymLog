// Create a new component: components/Workouts/components/ExerciseHistoryView.jsx

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

// Service to fetch exercise history
import { getExerciseHistory } from '../../../services/programServices';

const ExerciseHistoryView = ({ exerciseId, exerciseName, onBack }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const data = await getExerciseHistory(exerciseId);
        setHistory(data.history || []);
      } catch (error) {
        console.error('Error fetching exercise history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [exerciseId]);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto h-screen flex flex-col text-white p-4">
        <div className="flex items-center mb-4">
          <button 
            onClick={onBack}
            className="mr-3 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold">{exerciseName} - History</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Loading history...</p>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="max-w-md mx-auto h-screen flex flex-col text-white p-4">
        <div className="flex items-center mb-4">
          <button 
            onClick={onBack}
            className="mr-3 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold">{exerciseName} - History</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">No workout history found for this exercise.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col text-white p-4">
      <div className="flex items-center mb-4">
        <button 
          onClick={onBack}
          className="mr-3 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold">{exerciseName} - History</h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {history.map((record, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center text-sm text-gray-400">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{format(parseISO(record.date), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                <span>{format(parseISO(record.date), 'h:mm a')}</span>
              </div>
            </div>

            <div className="mt-3">
              <h4 className="text-gray-300 text-sm mb-2">Sets:</h4>
              <div className="space-y-2">
                {record.sets.map((set, setIndex) => (
                  <div key={setIndex} className="bg-gray-900 p-3 rounded flex justify-between">
                    <div>
                      <span className="text-gray-400 text-sm">Set {setIndex + 1}:</span>
                      <span className="ml-2 text-white">{set.completedReps || '-'} reps</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Weight:</span>
                      <span className="ml-2 text-white">{set.weight || '-'} kg</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">RPE:</span>
                      <span className="ml-2 text-white">{set.completedValue || '-'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseHistoryView;