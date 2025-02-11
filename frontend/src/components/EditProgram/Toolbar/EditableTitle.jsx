import React, { useState, useEffect, useRef } from "react";

export const EditableTitle = ({ title, onTitleChange, disabled }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const inputRef = useRef(null);

  useEffect(() => {
    setTempTitle(title);
  }, [title]);

  const handleBlur = () => {
    if (tempTitle.trim() !== title.trim()) {
      onTitleChange(tempTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") inputRef.current.blur();
    if (e.key === "Escape") {
      setTempTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div className={`group relative inline-block ${disabled ? "cursor-not-allowed opacity-70" : ""}`}>
      <input
        ref={inputRef}
        disabled={disabled}
        type="text"
        value={tempTitle}
        onChange={(e) => setTempTitle(e.target.value)}
        onFocus={() => setIsEditing(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        className={`bg-transparent font-bold border-b-2 ${
          disabled 
            ? "border-transparent" 
            : isEditing 
              ? "border-indigo-700" 
              : "border-transparent hover:border-gray-400"
        } transition-colors duration-150 outline-none p-0 m-0 ${disabled ? "text-gray-400" : "text-white"}`}
      />
      {!disabled && (
        <svg
          className={`absolute -right-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-150 pointer-events-none
            ${
              isEditing 
                ? "opacity-80 text-indigo-700" 
                : "opacity-0 group-hover:opacity-80 text-gray-400"
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      )}
    </div>
  );
};
