// ToolbarRightActions.jsx
import React from 'react';
import { Plus } from 'lucide-react';
import { ActionButton } from './ActionButton';

export const ToolbarRightActions = ({ program, setAddMovementOpen, addWeek }) => (
  <div className="flex items-center space-x-2">
    <ActionButton
      onClick={() => setAddMovementOpen(true)}
      icon={<Plus className="h-5 w-5" />}
      label="Add Movement"
      color="bg-gray-800 hover:bg-gray-700"
    />
    <ActionButton
      onClick={addWeek}
      icon={<Plus className="h-5 w-5" />}
      label="Add Week"
      color={!program ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"}
      disabled={!program}
    />
  </div>
);