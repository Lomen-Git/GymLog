import React, { useState } from "react";

export const StartProgramPopup = ({ isOpen, onClose, onConfirm, programName }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(programName); // Kutsu onConfirm-funktiota ohjelman ID:llä
    } catch (error) {
      console.error("Virhe ohjelman avaamisessa:", error);
    } finally {
      setIsLoading(false);
      onClose(); // Sulje popup
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Avaa ohjelma</h2>
        <p className="mb-4 text-gray-600">
          Haluatko aloittaa ohjelma <strong>{programName}</strong>?
        </p>

        {/* Painikkeet */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Peruuta
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded ${
              isLoading
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isLoading ? "Avataan..." : "Avaa"}
          </button>
        </div>
      </div>
    </div>
  );
};