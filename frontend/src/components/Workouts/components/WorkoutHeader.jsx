import { Info } from 'lucide-react'

export const WorkoutHeader = ({ workoutName }) => (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-100">{workoutName}</h1>
      <button className="text-gray-400 hover:text-white transition-colors">
        <Info className="w-6 h-6" />
      </button>
    </div>
  )