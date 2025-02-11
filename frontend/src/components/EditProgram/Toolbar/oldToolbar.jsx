import React, { useState, useEffect } from "react"
import { Save, Trash2, Plus, CirclePlus, X } from 'lucide-react'
import SaveAsPopUp from "./SaveAsPopUp"
import EditableTitle from "./EditableTitle"
import DeletePopUp from "./DeletePopUp"
import AddMovementPopUp from "./AddMovementPopUp"
import NewProgramPopup from "./NewProgramPopup"
import { getUserExercises } from "../../../services/gymServices"
import { createProgram, getProgram, saveProgram } from '../../../services/programServices'
import deepEqual from 'fast-deep-equal'


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
  let title
  let selectedUnit
  if (program === null) {
    selectedUnit = 1
    title = 'No program open'
  } else {
    selectedUnit = program.unit
    title = program.name
  }
  
  const units = ["RPM", "%", "None"]
  const [SaveAsOpen, setSaveAsOpen] = useState(false)
  const [CreateNewOpen, setCreateNewOpen] = useState(false)
  const [DeletePopUpOpen, setDeletePopUpOpen] = useState(false)
  const [AddMovementOpen, setAddMovementOpen] = useState(false)

  const [exercises, setExercises] = useState([])

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getUserExercises()
        setExercises(data)
        setDropdownOptions(data.map(e => e.name))
      } catch (error) {
        console.error('Error loading exercises')
      }
    }

    fetchExercises()
  }, [])

  const handleAddMovement = (movement) => {
    console.log("Added movement:", movement)
    setAddMovementOpen(false)
  }

  const handleDelete = () => {
    console.log("Program deleted")
    setDeletePopUpOpen(false)
  }

  const handleSaveProgram = async () => {
    try {
      const savedProgram = await saveProgram(program.id, program)
      
      const data = await transformProgram(savedProgram)
      setProgram(data)
      setSavedProgram(JSON.parse(JSON.stringify(data)))
    } catch (error) {
      console.error('Ohjelman tallennus epäonnistui')
    }
  }

  const handleSaveAs =  async (filename) => {
    try {
      const newProgram = { ...program, name: filename}
      
      const createdProgram = await createProgram(newProgram)

      if (createdProgram?.id) {
        await fetchProgramDetails(createdProgram.id)
      }

      setSaveAsOpen(false)
    } catch (error) {
      console.error('SaveAs ei onnistunut')
    }
  }

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
    }
    const createdProgram =  await createProgram(template)

    if (createdProgram?.id) {
      await fetchProgramDetails(createdProgram.id)
    }

    setCreateNewOpen(false)
    } catch (error) {
      console.error('Ohjelma luominen epäonnistui')
    }
  }

  // Funktio, joka poistaa kaikki isOpen-kentät rekursiivisesti
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

// Funktio, joka tarkistaa, onko ohjelma muuttunut
const checkIfProgramChanged = () => {
  if (!program || !savedProgram) return false;
  console.log('katsotaan onko', program, savedProgram)
  console.log(!deepEqual(removeIsOpenFields(program), removeIsOpenFields(savedProgram)))
  return !deepEqual(removeIsOpenFields(program), removeIsOpenFields(savedProgram))
};

const handleClose = () => {
  setProgram(null)
  setSavedProgram(null)
}

// Päivitä "Save"-painikkeen tila, kun program muuttuu
useEffect(() => {
  console.log('moi')
  setNotSaved(checkIfProgramChanged());
}, [program]);


return (
  <div>
    <div className="-mx-4 -mt-4 px-6 py-3 bg-gradient-to-r bg-omaTummenpi border-b border-gray-700 shadow-lg">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between">
        {/* Vasemman reunan painikkeet */}
        <div className="flex gap-1">
          <button
            onClick={() => setCreateNewOpen(true)}
            className="flex items-center gap-1 bg-green-700 px-2 py-2 rounded hover:bg-green-900 text-white text-sm"
          >
            <CirclePlus className="w-4 h-4" />
            New
          </button>
          <button
            onClick={handleSaveProgram}
            className={`
              flex items-center gap-1 px-2 py-2 rounded text-white text-sm transition-all
              ${!notSaved ? "bg-gray-500 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-900 animate-spin"}
            `}
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            className={`
              flex items-center gap-1 px-2 py-2 rounded text-white text-sm
              ${!program ? "bg-gray-500 cursor-not-allowed" : "bg-green-900 hover:bg-green-950"}
            `}
            onClick={() => setSaveAsOpen(true)}
          >
            <Save className="w-4 h-4" />
            Save As
          </button>
          <button
            className={`
              flex items-center gap-1 px-2 py-2 rounded text-white text-sm
              ${!program ? "bg-gray-500 cursor-not-allowed" : "bg-red-700 hover:bg-red-900"}
            `}
            onClick={() => setDeletePopUpOpen(true)}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            className={`
              flex items-center gap-1 px-2 py-2 rounded text-white text-sm
              ${!program ? "bg-gray-500 cursor-not-allowed" : "bg-red-700 hover:bg-red-900"}
            `}
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>

        {/* Keskitetty otsikko */}
        <div className="flex-grow flex justify-center mx-4">
          <EditableTitle
            title={title}
            onTitleChange={onTitleChange}
            disabled={!program}
          />
        </div>

        {/* Toimintopainikkeet */}
        <div className="flex items-center gap-1">
          <button
            className="flex items-center gap-1 bg-purple-700 px-2 py-2 rounded hover:bg-purple-900 text-white text-sm whitespace-nowrap"
            onClick={() => setAddMovementOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Movement
          </button>
          <button
            onClick={addWeek}
            className={`
              flex items-center gap-1 px-2 py-2 rounded text-white text-sm whitespace-nowrap
              ${!program ? "bg-gray-500 cursor-not-allowed" : "bg-cyan-700 hover:bg-cyan-950"}
            `}
          >
            <Plus className="w-4 h-4" />
            Add Week
          </button>
        </div>

        {/* Monivalinta */}
        <div className="flex gap-1 ml-1">
          {units.map((unit) => (
            <button
              key={unit}
              className={`px-2 py-2 rounded text-sm transition-all duration-300
                ${
                  !program
                    ? "bg-gray-700 text-gray-300 opacity-70 cursor-not-allowed border-transparent"
                    : program.unit === unit
                    ? "bg-indigo-900 text-white shadow-lg border-indigo-400"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 border-transparent"
                }
              `}
              onClick={() => onUnitChange(unit)}
            >
              {unit}
            </button>
          ))}
        </div>
      </div>
    </div>

    <SaveAsPopUp
      isOpen={SaveAsOpen}
      onClose={() => setSaveAsOpen(false)}
      onSave={handleSaveAs}
    />
    <NewProgramPopup
      isOpen={CreateNewOpen}
      onClose={() => setCreateNewOpen(false)}
      onSave={handleCreateProgram}
    />
    <DeletePopUp 
      isOpen={DeletePopUpOpen}
      onClose={() => setDeletePopUpOpen(false)}
      onDelete={handleDelete}
    />
    <AddMovementPopUp
      isOpen={AddMovementOpen}
      onClose={() => setAddMovementOpen(false)}
      onAdd={handleAddMovement}
    />
  </div>
)
}

export default Toolbar