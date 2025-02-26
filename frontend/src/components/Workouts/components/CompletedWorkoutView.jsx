import React from 'react';
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

// Component to display a completed workout's details
const CompletedWorkoutView = ({ 
  workout, 
  onBack,
}) => {
  const [expandedExercises, setExpandedExercises] = React.useState([]);

  // Toggle expansion of an exercise's details
  const toggleExercise = (exerciseId) => {
    setExpandedExercises(prev => {
      if (prev.includes(exerciseId)) {
        return prev.filter(id => id !== exerciseId);
      } else {
        return [...prev, exerciseId];
      }
    });
  };

  if (!workout || !workout.completedData) {
    return (
      <div className="p-4">
        <div className="flex items-center mb-4">
          <button 
            onClick={onBack}
            className="mr-3 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">Workout History</h2>
        </div>
        <p className="text-center text-gray-400 my-8">No data available for this workout</p>
      </div>
    );
  }

  const { completedData } = workout;
  const completedDate = completedData.createdAt 
    ? format(parseISO(completedData.createdAt), 'MMMM d, yyyy')
    : 'Unknown date';

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-3 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white">{workout.name}</h2>
          <div className="flex items-center text-sm text-gray-400 mt-1">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{completedDate}</span>
          </div>
        </div>
      </div>

      {/* List of exercises */}
      <div className="space-y-4">
        {completedData.CompletedExercises?.map((exercise) => (
          <div 
            key={exercise.id} 
            className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
          >
            {/* Exercise header */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleExercise(exercise.id)}
            >
              <span className="font-medium text-white">{exercise.name}</span>
              {expandedExercises.includes(exercise.id) ? 
                <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                <ChevronDown className="w-5 h-5 text-gray-400" />
              }
            </div>

            {/* Exercise details (sets) */}
            {expandedExercises.includes(exercise.id) && (
              <div className="bg-gray-900 border-t border-gray-700 p-4">
                <table className="w-full text-gray-300">
                  <thead className="text-gray-400 text-sm">
                    <tr>
                      <th className="text-left py-2">Set</th>
                      <th className="text-center py-2">Weight</th>
                      <th className="text-center py-2">Reps</th>
                      <th className="text-center py-2">RPE/Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.CompletedSets?.map((set, index) => (
                      <tr key={set.id} className="border-t border-gray-800">
                        <td className="py-3 pl-2">{index + 1}</td>
                        <td className="py-3 text-center">{set.weight || '-'}</td>
                        <td className="py-3 text-center">
                          <span className="text-gray-400">{set.targetReps}</span>
                          {' → '}
                          <span className="text-white font-medium">{set.completedReps || '-'}</span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="text-gray-400">{set.targetValue}</span>
                          {' → '}
                          <span className="text-white font-medium">{set.completedValue || '-'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Notes section if available */}
                {exercise.notes && (
                  <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-700">
                    <p className="text-sm text-gray-400 mb-1">Notes:</p>
                    <p className="text-white">{exercise.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Workout summary or notes if available */}
      {completedData.notes && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-lg font-medium text-white mb-2">Workout Notes</h3>
          <p className="text-gray-300">{completedData.notes}</p>
        </div>
      )}

      {/* Timestamp footer */}
      <div className="mt-8 text-center text-sm text-gray-500 flex items-center justify-center">
        <Clock className="w-4 h-4 mr-1" />
        <span>
          Completed at {completedData.createdAt 
            ? format(parseISO(completedData.createdAt), 'h:mm a')
            : 'unknown time'}
        </span>
      </div>
    </div>
  );
};

export default CompletedWorkoutView;
