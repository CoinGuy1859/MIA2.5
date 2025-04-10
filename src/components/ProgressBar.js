// components/ProgressBar.js
import React from "react";

const ProgressBar = ({ currentStep }) => {
  return (
    <div
      className="progress-bar"
      role="navigation"
      aria-label="Step progress"
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "30px",
      }}
    >
      <ProgressStep
        number={1}
        text="Your Family"
        isActive={currentStep >= 1}
        isComplete={currentStep > 1}
      />
      <ProgressLine isActive={currentStep > 1} />

      <ProgressStep
        number={2}
        text="Your Visits"
        isActive={currentStep >= 2}
        isComplete={currentStep > 2}
      />
      <ProgressLine isActive={currentStep > 2} />

      <ProgressStep
        number={3}
        text="Your Recommendation"
        isActive={currentStep >= 3}
        isComplete={false} // Last step is never "complete"
      />
    </div>
  );
};

const ProgressStep = ({ number, text, isActive, isComplete }) => {
  return (
    <div
      className={`progress-step ${isActive ? "active" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "33.33%",
        position: "relative",
        zIndex: "1",
      }}
    >
      <div
        className="step-circle"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: isActive ? "#3182ce" : "#e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          marginBottom: "8px",
          transition: "all 0.3s",
          color: isActive ? "white" : "#718096",
          border: isActive ? "none" : "1px solid #cbd5e1",
        }}
      >
        {isComplete ? (
          // Checkmark for completed steps
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          number
        )}
      </div>
      <div
        className="step-text"
        style={{
          fontSize: "14px",
          color: isActive ? "#3182ce" : "#718096",
          fontWeight: isActive ? "600" : "normal",
          transition: "all 0.3s",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const ProgressLine = ({ isActive }) => {
  return (
    <div
      className="progress-line"
      style={{
        height: "3px",
        backgroundColor: isActive ? "#3182ce" : "#e2e8f0",
        flexGrow: "1",
        transition: "background-color 0.3s",
      }}
    ></div>
  );
};

export default ProgressBar;
