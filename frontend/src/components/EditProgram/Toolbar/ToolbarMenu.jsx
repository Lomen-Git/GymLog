// ToolbarMenu.jsx
import React from 'react';
import { Plus, Save, CirclePlus, Trash2, X } from 'lucide-react';
import { UnitsSelector } from './UnitsSelector';

export const ToolbarMenu = ({
  isOpen,
  program,
  setCreateNewOpen,
  setSaveAsOpen,
  setDeletePopUpOpen,
  setAddMovementOpen,
  addWeek,
  handleClose,
  onUnitChange,
  units
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-1 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
      <div className="py-2 space-y-1">
        <button
          onClick={() => setCreateNewOpen(true)}
          className="w-full flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 gap-2"
        >
          <CirclePlus className="w-4 h-4" />
          New Program
        </button>
        
        <button
          onClick={() => setSaveAsOpen(true)}
          className="w-full flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 gap-2"
          disabled={!program}
        >
          <Save className="w-4 h-4" />
          Save As
        </button>
        <button
          onClick={() => setAddMovementOpen(true)}
          className="w-full flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Movement
        </button>
        <button
          onClick={addWeek}
          className="w-full flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 gap-2"
          disabled={!program}
        >
          <Plus className="w-4 h-4" />
          Add Week
        </button>
        <button
          onClick={() => setDeletePopUpOpen(true)}
          className="w-full flex items-center px-4 py-2 text-red-300 hover:bg-red-900/30 gap-2"
          disabled={!program}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
        <button
          onClick={handleClose}
          className="w-full flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 gap-2"
          disabled={!program}
        >
          <X className="w-4 h-4" />
          Close
        </button>
        
        <div className="border-t border-gray-700 pt-2">
          <div className="px-4 py-2 text-sm font-medium text-gray-400">
            Units
          </div>
          <UnitsSelector
            units={units}
            program={program}
            onUnitChange={onUnitChange}
            isMobile
          />
        </div>
      </div>
    </div>
  );
};