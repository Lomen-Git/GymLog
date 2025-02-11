import React, { useState } from "react"
import { CreateExercise } from "../../../services/gymServices"
import { Dumbbell, Activity, Heart, Zap } from "lucide-react"


 export const AddMovementPopUp = ({ isOpen, onClose, onAdd }) => {
  const [movementName, setMovementName] = useState("")
  const [selectedIcon, setSelectedIcon] = useState(null)

  const icons = [
    { name: "Dumbbell", component: <Dumbbell className="w-6 h-6" /> },
    { name: "Activity", component: <Activity className="w-6 h-6" /> },
    { name: "Heart", component: <Heart className="w-6 h-6" /> },
    { name: "Zap", component: <Zap className="w-6 h-6" /> },
  ]

  if (!isOpen) return null

  const handleAdd = async () => {
    if (movementName && selectedIcon) {
      onAdd({ name: movementName, icon: selectedIcon })
      try {
        const res = await CreateExercise(movementName)
      } catch (error) {
        console.log('ups')
      }
      setMovementName("")
      setSelectedIcon(null)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add Movement</h2>
        <input
          type="text"
          value={movementName}
          onChange={(e) => setMovementName(e.target.value)}
          placeholder="Enter movement name"
          className="w-full p-2 border text-black rounded mb-4"
        />
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Select Icon:</p>
          <div className="flex gap-2">
            {icons.map((icon) => (
              <button
                key={icon.name}
                className={`p-2 border rounded ${
                  selectedIcon === icon.name
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedIcon(icon.name)}
              >
                {icon.component}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!movementName || !selectedIcon}
            className={`px-4 py-2 rounded ${
              movementName && selectedIcon
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

