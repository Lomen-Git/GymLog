// ActionButton.jsx
import React from 'react';

export const ActionButton = ({
  onClick,
  icon,
  label,
  color,
  disabled = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center gap-2 
      px-3 py-2 rounded-md
      text-gray-200 text-sm font-medium
      transition-colors duration-200 whitespace-nowrap
      ${disabled 
        ? "bg-gray-700 opacity-50 cursor-not-allowed" 
        : `${color}`
      }
    `}
  >
    {icon}
    <span>{label}</span>
  </button>
);