// components/FamilyCompositionForm.js
import React from "react";
import { PricingConfig } from "../pricing/pricing-module";
import Logos from "../components/Logos";

/**
 * FamilyCompositionForm component
 * Collects information about family composition
 * Optimized for better readability and maintainability
 */
const FamilyCompositionForm = ({
  adultCount,
  childrenCount,
  childAges,
  isRichmondResident,
  needsFlexibility,
  isWelcomeEligible,
  errors,
  onAdultCountChange,
  onChildrenCountChange,
  onChildAgeChange,
  onRichmondResidentChange,
  onFlexibilityChange,
  onWelcomeEligibleChange,
  onNextStep,
}) => {
  const MAX_ADULTS = PricingConfig.Constraints.MAX_ADULTS;
  const MAX_CHILDREN = PricingConfig.Constraints.MAX_CHILDREN;

  return (
    <section
      className="step-container"
      role="form"
      aria-labelledby="family-step-heading"
      style={{
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        border: "1px solid #e2e8f0",
      }}
    >
      <FormHeader />

      <AdultCountSelector
        adultCount={adultCount}
        maxAdults={MAX_ADULTS}
        onAdultCountChange={onAdultCountChange}
      />

      <ChildrenCountSelector
        childrenCount={childrenCount}
        maxChildren={MAX_CHILDREN}
        onChildrenCountChange={onChildrenCountChange}
      />

      {childrenCount > 0 && (
        <ChildAgesInput
          childrenCount={childrenCount}
          childAges={childAges}
          errors={errors}
          onChildAgeChange={onChildAgeChange}
        />
      )}

      <SpecialOptions
        needsFlexibility={needsFlexibility}
        isRichmondResident={isRichmondResident}
        isWelcomeEligible={isWelcomeEligible}
        onFlexibilityChange={onFlexibilityChange}
        onRichmondResidentChange={onRichmondResidentChange}
        onWelcomeEligibleChange={onWelcomeEligibleChange}
      />

      <NavigationButtons onNextStep={onNextStep} />
    </section>
  );
};

/**
 * Form Header Component
 */
const FormHeader = () => (
  <div style={{ marginBottom: "30px", textAlign: "center" }}>
    <div className="header-logo" style={{ marginBottom: "20px" }}>
      <Logos.MainHeader />
    </div>

    <h2
      id="family-step-heading"
      tabIndex="-1"
      style={{
        fontSize: "24px",
        fontWeight: "600",
        color: "#1a202c",
        margin: "0 0 10px 0",
      }}
    >
      Tell Us About Your Family
    </h2>
    <p
      className="step-description"
      style={{
        color: "#4a5568",
        fontSize: "16px",
        marginTop: "0",
      }}
    >
      Help us understand your family's composition so we can find the right
      membership option for you.
    </p>
  </div>
);

/**
 * Adult Count Selector Component
 */
const AdultCountSelector = ({ adultCount, maxAdults, onAdultCountChange }) => (
  <div
    className="form-group"
    style={{
      marginBottom: "30px",
      backgroundColor: "#f8fafc",
      padding: "24px",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
    }}
  >
    <label
      htmlFor="adultCount"
      style={{
        display: "block",
        fontSize: "18px",
        fontWeight: "600",
        color: "#1a202c",
        marginBottom: "16px",
      }}
    >
      How many adults (14+) are in your family?
    </label>
    <div className="number-input">
      <button
        onClick={() => onAdultCountChange(adultCount - 1)}
        className="number-btn"
        aria-label="Decrease adult count"
        disabled={adultCount <= 1}
      >
        −
      </button>
      <span id="adultCount" aria-live="polite">
        {adultCount}
      </span>
      <button
        onClick={() => onAdultCountChange(adultCount + 1)}
        className="number-btn"
        aria-label="Increase adult count"
        disabled={adultCount >= maxAdults}
      >
        +
      </button>
    </div>
  </div>
);

/**
 * Children Count Selector Component
 */
const ChildrenCountSelector = ({
  childrenCount,
  maxChildren,
  onChildrenCountChange,
}) => (
  <div
    className="form-group"
    style={{
      marginBottom: "30px",
      backgroundColor: "#f8fafc",
      padding: "24px",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
    }}
  >
    <label
      htmlFor="childrenCount"
      style={{
        display: "block",
        fontSize: "18px",
        fontWeight: "600",
        color: "#1a202c",
        marginBottom: "16px",
      }}
    >
      How many children (0-13) are in your family?
    </label>
    <div className="number-input">
      <button
        onClick={() => onChildrenCountChange(childrenCount - 1)}
        className="number-btn"
        aria-label="Decrease children count"
        disabled={childrenCount <= 0}
      >
        −
      </button>
      <span id="childrenCount" aria-live="polite">
        {childrenCount}
      </span>
      <button
        onClick={() => onChildrenCountChange(childrenCount + 1)}
        className="number-btn"
        aria-label="Increase children count"
        disabled={childrenCount >= maxChildren}
      >
        +
      </button>
    </div>
  </div>
);

/**
 * Child Ages Input Component
 */
const ChildAgesInput = ({
  childrenCount,
  childAges,
  errors,
  onChildAgeChange,
}) => (
  <div
    className="form-group"
    style={{
      marginBottom: "30px",
      backgroundColor: "#f8fafc",
      padding: "24px",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
    }}
  >
    <fieldset style={{ border: "none", margin: "0", padding: "0" }}>
      <legend
        style={{
          fontSize: "18px",
          fontWeight: "600",
          color: "#1a202c",
          marginBottom: "16px",
          padding: "0",
        }}
      >
        How old are your children?
      </legend>
      {childAges.slice(0, childrenCount).map((age, index) => (
        <ChildAgeInput
          key={index}
          index={index}
          age={age}
          error={errors.childAges[index]}
          onChildAgeChange={onChildAgeChange}
        />
      ))}
    </fieldset>
  </div>
);

/**
 * Individual Child Age Input Component
 */
const ChildAgeInput = ({ index, age, error, onChildAgeChange }) => (
  <div
    className="child-age"
    style={{
      display: "flex",
      alignItems: "center",
      marginBottom: "16px",
      flexWrap: "wrap",
    }}
  >
    <label
      htmlFor={`child-age-${index}`}
      style={{
        fontWeight: "500",
        color: "#2d3748",
        marginRight: "12px",
        width: "80px",
      }}
    >
      Child {index + 1}:
    </label>
    <input
      id={`child-age-${index}`}
      type="number"
      min="0"
      max="17"
      value={age}
      onChange={(e) => {
        const newValue = e.target.value === "" ? "" : Number(e.target.value);
        onChildAgeChange(index, newValue);
      }}
      aria-label={`Age of child ${index + 1}`}
      aria-invalid={error ? "true" : "false"}
      className={error ? "error-input" : ""}
      style={{
        width: "70px",
        padding: "10px",
        fontSize: "16px",
        borderRadius: "6px",
        border: error ? "2px solid #e53e3e" : "1px solid #cbd5e1",
        backgroundColor: error ? "#fff5f5" : "#fff",
        textAlign: "center",
      }}
    />
    <span
      className="age-note"
      style={{
        fontSize: "14px",
        color: "#718096",
        marginLeft: "12px",
        fontStyle: "italic",
        flexGrow: "1",
        marginTop: window.innerWidth <= 640 ? "8px" : "0",
      }}
    >
      {age < 1
        ? "Free at all locations"
        : age < 2
        ? "Free at Discovery Place Science"
        : "Needs membership at all locations"}
    </span>
    {error && (
      <div
        className="error-message"
        style={{
          color: "#e53e3e",
          fontSize: "14px",
          fontWeight: "500",
          marginTop: "4px",
          marginLeft: "92px",
          width: "100%",
        }}
      >
        {error}
      </div>
    )}
  </div>
);

/**
 * Special Options Component
 */
const SpecialOptions = ({
  needsFlexibility,
  isRichmondResident,
  isWelcomeEligible,
  onFlexibilityChange,
  onRichmondResidentChange,
  onWelcomeEligibleChange,
}) => (
  <div
    style={{
      marginBottom: "30px",
      backgroundColor: "#f8fafc",
      padding: "24px",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
    }}
  >
    <div
      style={{
        fontSize: "18px",
        fontWeight: "600",
        color: "#1a202c",
        marginBottom: "16px",
      }}
    >
      Special Options & Eligibility
    </div>

    <CheckboxOption
      id="needsFlexibility"
      label="Different adults will take children on different days"
      checked={needsFlexibility}
      onChange={onFlexibilityChange}
      helpText="Check this if you need the flexibility for different adults to visit with children on different days."
    />

    <CheckboxOption
      id="isRichmondResident"
      label="Richmond County resident"
      checked={isRichmondResident}
      onChange={onRichmondResidentChange}
      helpText="Check this if you are a Richmond County resident for special pricing at Kids-Rockingham."
    />

    <CheckboxOption
      id="isWelcomeEligible"
      label="NC/SC EBT or WIC cardholder (Welcome Program)"
      checked={isWelcomeEligible}
      onChange={onWelcomeEligibleChange}
      helpText="Check this if you are a North Carolina or South Carolina EBT/WIC recipient to see Welcome Program options."
    />
  </div>
);

/**
 * Reusable Checkbox Option Component
 */
const CheckboxOption = ({ id, label, checked, onChange, helpText }) => (
  <div className="form-group checkbox" style={{ marginBottom: "16px" }}>
    <label
      htmlFor={id}
      style={{
        display: "flex",
        alignItems: "flex-start",
        cursor: "pointer",
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: "22px",
          height: "22px",
          marginRight: "12px",
          marginTop: "2px",
          accentColor: "#3182ce",
          cursor: "pointer",
        }}
      />
      <span style={{ fontSize: "16px", color: "#2d3748" }}>{label}</span>
    </label>
    <div className="checkbox-help" id={`${id}-help`}>
      {helpText}
    </div>
  </div>
);

/**
 * Navigation Buttons Component
 */
const NavigationButtons = ({ onNextStep }) => (
  <div className="button-group">
    <button
      onClick={onNextStep}
      className="primary-button"
      aria-label="Continue to step 2: Your Visits"
      style={{
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Continue to Your Visits
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginLeft: "8px" }}
      >
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </button>
  </div>
);

export default FamilyCompositionForm;
