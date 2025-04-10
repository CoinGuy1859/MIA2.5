import React from "react";

/**
 * CalculatorModeToggle component
 * Provides a toggle switch between Quick Quiz and Detailed Calculator modes
 * Updated with improved styling and accessibility
 */
const CalculatorModeToggle = ({ mode, onModeChange }) => {
  // If a mode is already selected, don't render the toggle
  if (mode && mode !== "initial") {
    return null;
  }

  return (
    <div className="calculator-mode-toggle max-w-2xl mx-auto px-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Choose Your Membership Finder
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6 max-w-md mx-auto">
        Select how you'd like to discover the perfect membership for your family
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="w-full max-w-md">
          <button
            className={`w-full flex items-center p-4 rounded-lg border-2 transition-all duration-300 group 
              ${
                mode === "quiz"
                  ? "bg-blue-50 border-blue-500 shadow-md"
                  : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              }`}
            onClick={() => onModeChange("quiz")}
            aria-pressed={mode === "quiz"}
          >
            <div
              className={`mr-4 p-3 rounded-full transition-colors 
              ${
                mode === "quiz"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-8 h-8"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
            <div className="text-left">
              <h3
                className={`font-semibold text-base transition-colors 
                ${
                  mode === "quiz"
                    ? "text-blue-800"
                    : "text-gray-800 group-hover:text-blue-800"
                }`}
              >
                Quick Membership Finder
              </h3>
              <p
                className={`text-sm transition-colors 
                ${
                  mode === "quiz"
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-blue-600"
                }`}
              >
                2-minute guided quiz
              </p>
            </div>
          </button>
        </div>

        <div className="w-full max-w-md">
          <button
            className={`w-full flex items-center p-4 rounded-lg border-2 transition-all duration-300 group 
              ${
                mode === "calculator"
                  ? "bg-blue-50 border-blue-500 shadow-md"
                  : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              }`}
            onClick={() => onModeChange("calculator")}
            aria-pressed={mode === "calculator"}
          >
            <div
              className={`mr-4 p-3 rounded-full transition-colors 
              ${
                mode === "calculator"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-8 h-8"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="9"></line>
                <line x1="9" y1="12" x2="15" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </div>
            <div className="text-left">
              <h3
                className={`font-semibold text-base transition-colors 
                ${
                  mode === "calculator"
                    ? "text-blue-800"
                    : "text-gray-800 group-hover:text-blue-800"
                }`}
              >
                Detailed Membership Calculator
              </h3>
              <p
                className={`text-sm transition-colors 
                ${
                  mode === "calculator"
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-blue-600"
                }`}
              >
                Customize all the details
              </p>
            </div>
          </button>
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          The finder helps you choose the best Discovery Place membership for
          your family's needs.
        </p>
      </div>
    </div>
  );
};

export default CalculatorModeToggle;
