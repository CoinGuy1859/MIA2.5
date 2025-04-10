// components/MembershipTools.js
import React, { useState, useEffect } from "react";
import MembershipDecisionTree from "./MembershipDecisionTree";
// The actual calculator components from your project
import FamilyCompositionForm from "./FamilyCompositionForm";
import VisitFrequencyForm from "./VisitFrequencyForm";
import MembershipRecommendation from "./MembershipRecommendation";
import ProgressBar from "./ProgressBar";

const MembershipTools = ({
  currentStep,
  adultCount,
  childrenCount,
  childAges,
  scienceVisits,
  dpkhVisits,
  dpkrVisits,
  isRichmondResident,
  needsFlexibility,
  isWelcomeEligible,
  includeParking,
  errors,
  membershipRecommendation,
  onNextStep,
  onPrevStep,
  onAdultCountChange,
  onChildrenCountChange,
  onChildAgeChange,
  onRichmondResidentChange,
  onFlexibilityChange,
  onWelcomeEligibleChange,
  onScienceVisitsChange,
  onDpkhVisitsChange,
  onDpkrVisitsChange,
  onIncludeParkingChange,
  formatCurrency,
}) => {
  // State to track which tool is active
  const [activeCalculator, setActiveCalculator] = useState("quick"); // Options: "quick" or "detailed"

  // When a calculator is selected, scroll to top of container for better UX
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCalculator]);

  return (
    <div className="membership-tools">
      {/* Toggle between calculators - Enhanced styling */}
      <div className="calculator-mode-toggle">
        <div className="calculator-modes">
          <button
            className={`calculator-mode-button ${
              activeCalculator === "quick" ? "active" : ""
            }`}
            onClick={() => setActiveCalculator("quick")}
            aria-pressed={activeCalculator === "quick"}
          >
            <div className="icon-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div className="button-content">
              <span className="button-title">Quick Membership Finder</span>
              <span className="button-description">
                Simple 2-minute quiz to find your ideal membership option
              </span>
            </div>
          </button>

          <button
            className={`calculator-mode-button ${
              activeCalculator === "detailed" ? "active" : ""
            }`}
            onClick={() => setActiveCalculator("detailed")}
            aria-pressed={activeCalculator === "detailed"}
          >
            <div className="icon-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="9"></line>
                <line x1="9" y1="12" x2="15" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </div>
            <div className="button-content">
              <span className="button-title">Detailed Calculator</span>
              <span className="button-description">
                Customize all details for the most accurate recommendation
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Help text */}
      <div className="help-text">
        {activeCalculator === "quick"
          ? "Answer a few simple questions to get a membership recommendation based on your family's needs."
          : "Enter your family details and planned visit patterns for a personalized recommendation."}
      </div>

      {/* Render the active calculator with improved styling */}
      {activeCalculator === "quick" ? (
        <div className="calculator-panel">
          <MembershipDecisionTree
            formatCurrency={formatCurrency}
            recommendation={membershipRecommendation}
          />
        </div>
      ) : (
        <div className="calculator-panel">
          {/* Progress Bar */}
          <ProgressBar currentStep={currentStep} />

          {/* Step 1: Family Composition */}
          {currentStep === 1 && (
            <FamilyCompositionForm
              adultCount={adultCount}
              childrenCount={childrenCount}
              childAges={childAges}
              isRichmondResident={isRichmondResident}
              needsFlexibility={needsFlexibility}
              isWelcomeEligible={isWelcomeEligible}
              errors={errors}
              onAdultCountChange={onAdultCountChange}
              onChildrenCountChange={onChildrenCountChange}
              onChildAgeChange={onChildAgeChange}
              onRichmondResidentChange={onRichmondResidentChange}
              onFlexibilityChange={onFlexibilityChange}
              onWelcomeEligibleChange={onWelcomeEligibleChange}
              onNextStep={onNextStep}
            />
          )}

          {/* Step 2: Visit Frequency */}
          {currentStep === 2 && (
            <VisitFrequencyForm
              scienceVisits={scienceVisits}
              dpkhVisits={dpkhVisits}
              dpkrVisits={dpkrVisits}
              includeParking={includeParking}
              onScienceVisitsChange={onScienceVisitsChange}
              onDpkhVisitsChange={onDpkhVisitsChange}
              onDpkrVisitsChange={onDpkrVisitsChange}
              onIncludeParkingChange={onIncludeParkingChange}
              onNextStep={onNextStep}
              onPrevStep={onPrevStep}
            />
          )}

          {/* Step 3: Recommendation */}
          {currentStep === 3 && (
            <MembershipRecommendation
              recommendation={membershipRecommendation}
              formatCurrency={formatCurrency}
              scienceVisits={scienceVisits}
              dpkhVisits={dpkhVisits}
              dpkrVisits={dpkrVisits}
              adultCount={adultCount}
              childAges={childAges}
              isRichmondResident={isRichmondResident}
              includeParking={includeParking}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MembershipTools;
