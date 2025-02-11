// UnitsSelector.jsx
import React from 'react';

export const UnitsSelector = ({ units, program, onUnitChange, isMobile }) => {
  if (isMobile) {
    return (
      <div className="flex flex-col space-y-2 px-2">
        {units.map((unit) => (
          <button
            key={unit}
            className={`
              px-3 py-2 rounded-md text-sm font-medium
              transition-colors duration-200
              ${!program
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : program.unit === unit
                ? "bg-indigo-900 text-indigo-400"
                : "bg-gray-800 text-gray-300 hover:text-indigo-400 hover:bg-gray-700"
              }
            `}
            onClick={() => onUnitChange(unit)}
            disabled={!program}
          >
            {unit}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="hidden md:flex space-x-1">
      {units.map((unit) => (
        <button
          key={unit}
          className={`
            px-3 py-2 rounded-md text-sm font-medium
            transition-colors duration-200
            ${!program
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : program.unit === unit
              ? "bg-indigo-900 text-indigo-400"
              : "bg-gray-800 text-gray-300 hover:text-indigo-400 hover:bg-gray-700"
            }
          `}
          onClick={() => onUnitChange(unit)}
          disabled={!program}
        >
          {unit}
        </button>
      ))}
    </div>
  );
};