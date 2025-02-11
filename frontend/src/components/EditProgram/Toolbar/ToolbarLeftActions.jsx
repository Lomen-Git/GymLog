// ToolbarLeftActions.jsx
import React from 'react';
import { Save, Trash2, CirclePlus, X } from 'lucide-react';
import { ActionButton } from './ActionButton';

export const ToolbarLeftActions = ({
  setCreateNewOpen,
  handleSaveProgram,
  notSaved,
  program,
  setSaveAsOpen,
  setDeletePopUpOpen,
  handleClose,
}) => (
  <div className="flex items-center space-x-2">
    <ActionButton
      onClick={() => setCreateNewOpen(true)}
      icon={<CirclePlus className="h-5 w-5" />}
      label="New"
      color="bg-gray-800 hover:bg-gray-700"
    />
    <ActionButton
      onClick={handleSaveProgram}
      icon={<Save className="h-5 w-5" />}
      label="Save"
      color={!notSaved ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"}
      disabled={!notSaved}
    />
    <div className="hidden md:block">
      <ActionButton
        onClick={() => setSaveAsOpen(true)}
        icon={<Save className="h-5 w-5" />}
        label="Save As"
        color={!program ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"}
        disabled={!program}
      />
    </div>
    <ActionButton
      onClick={() => setDeletePopUpOpen(true)}
      icon={<Trash2 className="h-5 w-5" />}
      label="Delete"
      color={!program ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"}
      disabled={!program}
    />
    <ActionButton
      onClick={handleClose}
      icon={<X className="h-5 w-5" />}
      label="Close"
      color={!program ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"}
      disabled={!program}
    />
  </div>
);