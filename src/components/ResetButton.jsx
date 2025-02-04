// src/components/ResetButton.js
import React from "react";

const ResetButton = ({ onReset }) => {
  return (
    <button
      onClick={onReset}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Reset Chat
    </button>
  );
};

export default ResetButton;
