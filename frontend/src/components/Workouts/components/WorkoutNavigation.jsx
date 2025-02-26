import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  CheckCircle, 
  ArrowRight,
  Clock,
  RefreshCcw
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const WorkoutNavigation = ({ 
  programData, 
  onSelectWorkout,
  onRefresh
}) => {
  const [expandedWeeks, setExpandedWeeks] = useState([]);

  // Automatically expand the current week when data changes
  useEffect(() => {
    if (programData && typeof programData.currentWeekIndex === 'number') {
      setExpandedWeeks(prev => {
        if (!prev.includes(programData.currentWeekIndex)) {
          return [...prev, programData.currentWeekIndex];
        }
        return prev;
      });
    }
  }, [programData]);

  // Toggle week expansion
  const toggleWeek = (weekIndex) => {
    setExpandedWeeks(prev => {
      if (prev.includes(weekIndex)) {
        return prev.filter(index => index !== weekIndex);
      } else {
        return [...prev, weekIndex];
      }
    });
  };

  if (!programData || !programData.weeks || programData.weeks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-64">
        <p className="text-gray-400 mb-6">No active program found</p>
        <button 
          onClick={onRefresh} 
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-white"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center text-white">{programData.programName}</h1>
        <p className="text-center text-gray-400 mt-1">
          Current: Week {programData.currentWeekIndex + 1}, Workout {programData.currentWorkoutIndex + 1}
        </p>
      </div>

      <div className="space-y-4 mb-20">
        {programData.weeks.map((week, weekIndex) => (
          <div 
            key={`week-${weekIndex}`} 
            className={`rounded-lg overflow-hidden bg-gray-800 
              ${week.isCurrentWeek ? 'ring-2 ring-indigo-500' : 'border border-gray-700'}`}
          >
            {/* Week header */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleWeek(weekIndex)}
            >
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-indigo-400 mr-3" />
                <span className="font-medium text-white">{week.name}</span>
              </div>
              
              <div className="flex items-center">
                {/* Completion status */}
                <div className="mr-4 text-sm text-gray-400">
                  {week.workouts.filter(w => w.isCompleted).length}/{week.workouts.length}
                </div>
                
                {/* Expand/collapse icon */}
                {expandedWeeks.includes(weekIndex) ? 
                  <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                }
              </div>
            </div>

            {/* Workouts list */}
            {expandedWeeks.includes(weekIndex) && (
              <div className="bg-gray-900 py-1 border-t border-gray-700">
                {week.workouts.map((workout, workoutIndex) => (
                  <div 
                    key={`workout-${weekIndex}-${workoutIndex}`}
                    onClick={() => onSelectWorkout(weekIndex, workoutIndex)}
                    className={`
                      px-4 py-3 border-b border-gray-800 last:border-b-0
                      ${workout.isCurrentWorkout ? 'bg-indigo-900/30' : ''}
                      ${workout.isCompleted ? 'hover:bg-green-900/20' : 'hover:bg-gray-800/80'}
                      cursor-pointer transition-colors duration-150
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {/* Completion indicator */}
                        {workout.isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-600 mr-3 flex-shrink-0" />
                        )}
                        
                        {/* Workout name */}
                        <div>
                          <span className={`
                            ${workout.isCompleted ? 'text-gray-300' : 'text-gray-400'}
                            ${workout.isCurrentWorkout ? 'font-medium' : ''}
                          `}>
                            {workout.name}
                          </span>
                          
                          {/* Show completion date if available */}
                          {workout.isCompleted && workout.completedData && (
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>
                                {format(parseISO(workout.completedData.createdAt), 'MMM d, yyyy')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutNavigation;