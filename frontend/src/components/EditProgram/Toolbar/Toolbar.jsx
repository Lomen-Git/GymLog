// Toolbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Wrench, Save } from 'lucide-react';
import { getUserExercises } from "../../../services/gymServices";
import { createProgram, saveProgram } from '../../../services/programServices';
import deepEqual from 'fast-deep-equal';
import { ToolbarLeftActions } from './ToolbarLeftActions';
import { ToolbarRightActions } from './ToolbarRightActions';
import { ActionButton } from './ActionButton';
import { ToolbarMenu } from './ToolbarMenu';
import { UnitsSelector } from './UnitsSelector';
import { EditableTitle} from './EditableTitle';
import { SaveAsPopUp } from '../PopUps/SaveAsPopUp'
import { NewProgramPopup } from "../PopUps/NewProgramPopup";
import { DeletePopUp } from "../PopUps/DeletePopUp";
import { AddMovementPopUp } from "../PopUps/AddMovementPopUp";

const Toolbar = ({
  program,
  setProgram,
  savedProgram,
  setSavedProgram,
  notSaved,
  setNotSaved,
  onTitleChange,
  onUnitChange,
  addWeek,
  fetchProgramDetails,
  transformProgram
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState({
    saveAs: false,
    createNew: false,
    delete: false,
    addMovement: false
  });
  const menuRef = useRef(null);

  const title = program?.name ?? 'No program open';
  const units = ["RPM", "%", "None"];

  const [exercises, setExercises] = useState([])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getUserExercises();
        setExercises(data);
      } catch (error) {
        console.error('Error loading exercises:', error);
      }
    };

    fetchExercises();
  }, []);

  const handleAddMovement = (movement) => {
    console.log("Added movement:", movement);
    setIsOpen(prev => ({ ...prev, addMovement: false }));
  };

  const handleDelete = () => {
    console.log("Program deleted");
    setIsOpen(prev => ({ ...prev, delete: false }));
  };

  const handleSaveProgram = async () => {
    try {
      const savedProgram = await saveProgram(program.id, program);
      const data = await transformProgram(savedProgram);
      setProgram(data);
      setSavedProgram(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      console.error('Failed to save program:', error);
    }
  };

  const handleSaveAs = async (filename) => {
    try {
      const newProgram = { ...program, name: filename };
      const createdProgram = await createProgram(newProgram);

      if (createdProgram?.id) {
        await fetchProgramDetails(createdProgram.id);
      }

      setIsOpen(prev => ({ ...prev, saveAs: false }));
    } catch (error) {
      console.error('SaveAs failed:', error);
    }
  };

  const handleCreateProgram = async (filename) => {
    try {
      const template = {
        name: filename,
        unit: 'RPE',
        isOpen: true,
        weeks: [{
          weekNumber: 1,
          name: 'Week 1',
          isOpen: true,
          workouts: []
        }]
      };
      
      const createdProgram = await createProgram(template);

      if (createdProgram?.id) {
        await fetchProgramDetails(createdProgram.id);
      }

      setIsOpen(prev => ({ ...prev, createNew: false }));
    } catch (error) {
      console.error('Failed to create program:', error);
    }
  };

  const removeIsOpenFields = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(removeIsOpenFields);
    } else if (typeof obj === "object" && obj !== null) {
      return Object.keys(obj).reduce((acc, key) => {
        if (key !== "isOpen") {
          acc[key] = removeIsOpenFields(obj[key]);
        }
        return acc;
      }, {});
    }
    return obj;
  };

  const checkIfProgramChanged = () => {
    if (!program || !savedProgram) return false;
    return !deepEqual(removeIsOpenFields(program), removeIsOpenFields(savedProgram));
  };

  const handleClose = () => {
    setProgram(null);
    setSavedProgram(null);
  };

  useEffect(() => {
    setNotSaved(checkIfProgramChanged());
  }, [program, savedProgram, setNotSaved]);


  return (
    <nav className="bg-gray-900 border-b border-gray-700 shadow-lg">
      <div className="w-full sm:max-w-7xl sm:mx-auto">
        <div className="py-3">
          {/* Mobile Layout */}
          <div className="md:hidden space-y-2">
            <div className="flex justify-between items-center">
              <ActionButton
                onClick={handleSaveProgram}
                icon={<Save className="w-5 h-5" />}
                label="Save"
                color={!notSaved ? "bg-gray-700" : "bg-blue-800 hover:bg-blue-700"}
                disabled={!notSaved}
              />
              
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-gray-300 hover:text-indigo-400 hover:bg-gray-800 rounded-md"
                >
                  <Wrench className="w-8 h-8" />
                </button>

                <ToolbarMenu
                  isOpen={isMenuOpen}
                  program={program}
                  setCreateNewOpen={(value) => setIsOpen(prev => ({ ...prev, createNew: value }))}
                  setSaveAsOpen={(value) => setIsOpen(prev => ({ ...prev, saveAs: value }))}
                  setDeletePopUpOpen={(value) => setIsOpen(prev => ({ ...prev, delete: value }))}
                  setAddMovementOpen={(value) => setIsOpen(prev => ({ ...prev, addMovement: value }))}
                  addWeek={addWeek}
                  handleClose={handleClose}
                  onUnitChange={onUnitChange}
                  units={units}
                />
              </div>
            </div>
            
            <div className="mx-4">
              <EditableTitle
                title={title}
                onTitleChange={onTitleChange}
                disabled={!program}
              />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center">
            <div className="flex items-center gap-4">
              <ToolbarLeftActions
                setCreateNewOpen={(value) => setIsOpen(prev => ({ ...prev, createNew: value }))}
                handleSaveProgram={handleSaveProgram}
                notSaved={notSaved}
                program={program}
                setSaveAsOpen={(value) => setIsOpen(prev => ({ ...prev, saveAs: value }))}
                setDeletePopUpOpen={(value) => setIsOpen(prev => ({ ...prev, delete: value }))}
                handleClose={handleClose}
              />
            </div>

            <div className="flex-1 mx-8">
              <EditableTitle
                title={title}
                onTitleChange={onTitleChange}
                disabled={!program}
              />
            </div>

            <div className="flex items-center gap-4">
              <ToolbarRightActions
                program={program}
                setAddMovementOpen={(value) => setIsOpen(prev => ({ ...prev, addMovement: value }))}
                addWeek={addWeek}
              />
              <UnitsSelector
                units={units}
                program={program}
                onUnitChange={onUnitChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* PopUps */}
      <SaveAsPopUp
        isOpen={isOpen.saveAs}
        onClose={() => setIsOpen(prev => ({ ...prev, saveAs: false }))}
        onSave={handleSaveAs}
      />
      <NewProgramPopup
        isOpen={isOpen.createNew}
        onClose={() => setIsOpen(prev => ({ ...prev, createNew: false }))}
        onSave={handleCreateProgram}
      />
      <DeletePopUp
        isOpen={isOpen.delete}
        onClose={() => setIsOpen(prev => ({ ...prev, delete: false }))}
        onDelete={handleDelete}
      />
      <AddMovementPopUp
        isOpen={isOpen.addMovement}
        onClose={() => setIsOpen(prev => ({ ...prev, addMovement: false }))}
        onAdd={handleAddMovement}
      />
    </nav>
  );
};

export default Toolbar;