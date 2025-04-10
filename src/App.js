import React, { useReducer, useCallback, useEffect, useRef } from "react";
import {
  PricingConfig,
  DiscountService,
  AdmissionCostCalculator,
  MembershipPriceCalculator,
} from "./pricing/pricing-module";

// Import MembershipTools and other components
import MembershipTools from "./components/MembershipTools";
import WelcomeNotification from "./components/WelcomeNotification";
import SituationBreakdown from "./components/SituationBreakdown";

/**
 * Initial state for the application
 */
const initialState = {
  // Navigation state
  currentStep: 1,

  // Family composition state
  adultCount: 2,
  childrenCount: 2,
  childAges: [5, 7],

  // Visit frequency state
  scienceVisits: 4,
  dpkhVisits: 2,
  dpkrVisits: 0,

  // Special considerations
  isRichmondResident: false,
  needsFlexibility: false,
  isWelcomeEligible: false,
  includeParking: true,

  // UI state
  errors: {
    childAges: ["", ""],
  },
  announcement: "",

  // Computed data
  membershipRecommendation: null,
  primaryLocationIcon: "science",
  visitDistributionData: [],

  // New flag to control recommendation calculation
  needsRecommendationUpdate: false,
};

/**
 * Reducer function to handle all state updates
 */
function appReducer(state, action) {
  switch (action.type) {
    case "SET_STEP": {
      // When moving to step 3, set the flag to trigger recommendation calculation
      const needsUpdate = action.payload === 3 && state.currentStep !== 3;
      return {
        ...state,
        currentStep: action.payload,
        needsRecommendationUpdate: needsUpdate
          ? true
          : state.needsRecommendationUpdate,
      };
    }

    case "SET_ADULT_COUNT":
      return { ...state, adultCount: action.payload };

    case "SET_CHILDREN_COUNT":
      return { ...state, childrenCount: action.payload };

    case "SET_CHILD_AGE": {
      const newChildAges = [...state.childAges];
      newChildAges[action.payload.index] = action.payload.age;
      return { ...state, childAges: newChildAges };
    }

    case "UPDATE_CHILD_AGES_ARRAY":
      return { ...state, childAges: action.payload };

    case "SET_SCIENCE_VISITS":
      return { ...state, scienceVisits: action.payload };

    case "SET_DPKH_VISITS":
      return { ...state, dpkhVisits: action.payload };

    case "SET_DPKR_VISITS":
      return { ...state, dpkrVisits: action.payload };

    case "SET_RICHMOND_RESIDENT":
      return { ...state, isRichmondResident: action.payload };

    case "SET_NEEDS_FLEXIBILITY":
      return { ...state, needsFlexibility: action.payload };

    case "SET_WELCOME_ELIGIBLE":
      return { ...state, isWelcomeEligible: action.payload };

    case "SET_INCLUDE_PARKING":
      return { ...state, includeParking: action.payload };

    case "SET_ERRORS":
      return { ...state, errors: action.payload };

    case "SET_ANNOUNCEMENT":
      return { ...state, announcement: action.payload };

    case "UPDATE_RECOMMENDATION":
      return {
        ...state,
        membershipRecommendation: action.payload.recommendation,
        primaryLocationIcon: action.payload.primaryLocationIcon,
        visitDistributionData: action.payload.visitDistributionData,
        needsRecommendationUpdate: false, // Clear the flag after update
      };

    case "REQUEST_RECOMMENDATION_UPDATE":
      return { ...state, needsRecommendationUpdate: true };

    case "RESET_CALCULATOR":
      return { ...initialState };

    default:
      return state;
  }
}

/**
 * Main Application Component
 */
const DiscoveryPlaceMembershipCalculator = () => {
  // Use reducer for state management
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Track if initial render has completed
  const initialRenderRef = useRef(true);

  const {
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
    announcement,
    membershipRecommendation,
    primaryLocationIcon,
    visitDistributionData,
    needsRecommendationUpdate,
  } = state;

  /**
   * Format currency helper function
   */
  const formatCurrency = useCallback((amount) => {
    // Ensure amount is a reasonable number
    const validAmount = Math.min(
      Math.max(0, isNaN(amount) ? 0 : amount),
      100000 // Set a reasonable maximum display value
    );

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(validAmount);
  }, []);

  /**
   * Handle initial render effects
   */
  useEffect(() => {
    // Skip effects on initial render
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }
  }, []);

  /**
   * Update child ages array when child count changes
   */
  useEffect(() => {
    // Skip initial render
    if (initialRenderRef.current) {
      return;
    }

    if (childrenCount > childAges.length) {
      // Add new children with default age 5
      const newChildAges = [...childAges];
      for (let i = childAges.length; i < childrenCount; i++) {
        newChildAges.push(5);
      }
      // Execute in the next tick to avoid batched updates
      setTimeout(() => {
        dispatch({ type: "UPDATE_CHILD_AGES_ARRAY", payload: newChildAges });
      }, 0);
    } else if (childrenCount < childAges.length) {
      // Remove extra children
      setTimeout(() => {
        dispatch({
          type: "UPDATE_CHILD_AGES_ARRAY",
          payload: childAges.slice(0, childrenCount),
        });
      }, 0);
    }
  }, [childrenCount]);

  /**
   * Update validation errors array size when child count changes
   */
  useEffect(() => {
    // Skip initial render
    if (initialRenderRef.current) {
      return;
    }

    // Only update errors if lengths don't match
    if (errors.childAges.length !== childrenCount) {
      setTimeout(() => {
        dispatch({
          type: "SET_ERRORS",
          payload: {
            ...errors,
            childAges: Array(childrenCount).fill(""),
          },
        });
      }, 0);
    }
  }, [childrenCount, errors]);

  /**
   * Calculate membership recommendation when the flag is set
   */
  useEffect(() => {
    // Skip if not on step 3 or no update needed
    if (currentStep !== 3 || !needsRecommendationUpdate) {
      return;
    }

    try {
      // Calculate recommendation
      const newRecommendation =
        MembershipPriceCalculator.calculateMembershipCosts({
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
        });

      // Determine primary location icon based on visit frequency
      const primaryLocation = AdmissionCostCalculator.determinePrimaryLocation(
        scienceVisits,
        dpkhVisits,
        dpkrVisits
      );
      let newPrimaryLocationIcon = "science";
      switch (primaryLocation) {
        case "Science":
          newPrimaryLocationIcon = "science";
          break;
        case "DPKH":
          newPrimaryLocationIcon = "kids-huntersville";
          break;
        case "DPKR":
          newPrimaryLocationIcon = "kids-rockingham";
          break;
      }

      // Generate visit distribution data for charts
      const totalVisits = scienceVisits + dpkhVisits + dpkrVisits;
      const newVisitDistributionData =
        totalVisits === 0
          ? []
          : [
              {
                name: "Discovery Place Science",
                shortName: "Science",
                value: scienceVisits,
                fill: "#3182CE", // Blue
              },
              {
                name: "Discovery Place Kids-Huntersville",
                shortName: "Kids-H",
                value: dpkhVisits,
                fill: "#9F7AEA", // Purple
              },
              {
                name: "Discovery Place Kids-Rockingham",
                shortName: "Kids-R",
                value: dpkrVisits,
                fill: "#ED8936", // Orange
              },
            ].filter((item) => item.value > 0);

      // Update the recommendation in the next tick to avoid batched updates
      setTimeout(() => {
        dispatch({
          type: "UPDATE_RECOMMENDATION",
          payload: {
            recommendation: newRecommendation,
            primaryLocationIcon: newPrimaryLocationIcon,
            visitDistributionData: newVisitDistributionData,
          },
        });
      }, 0);
    } catch (error) {
      console.error("Error calculating recommendation:", error);
    }
  }, [needsRecommendationUpdate, currentStep]);

  /**
   * Navigation functions
   */
  const nextStep = useCallback(() => {
    if (currentStep === 1) {
      // Validate family composition
      if (!validateChildAges()) {
        announceToScreenReader(
          "Please fix the errors before continuing.",
          "assertive"
        );
        return;
      }
    } else if (currentStep === 2) {
      // Validate visits
      if (!validateVisits()) {
        return;
      }
    }

    // Proceed to next step
    const newStep = currentStep + 1;
    dispatch({ type: "SET_STEP", payload: newStep });

    // Announce step change for screen readers
    let stepName = "";
    if (newStep === 2) stepName = "Your Visits";
    if (newStep === 3) stepName = "Your Recommendation";

    announceToScreenReader(
      `Moving to step ${newStep} of 3: ${stepName}.`,
      "assertive"
    );
  }, [currentStep]);

  const prevStep = useCallback(() => {
    const newStep = currentStep - 1;
    dispatch({ type: "SET_STEP", payload: newStep });

    // Announce step change for screen readers
    let stepName = "";
    if (newStep === 1) stepName = "Your Family";
    if (newStep === 2) stepName = "Your Visits";

    announceToScreenReader(
      `Moving back to step ${newStep} of 3: ${stepName}.`,
      "assertive"
    );
  }, [currentStep]);

  /**
   * Form validation functions
   */
  const validateChildAges = useCallback(() => {
    const newErrors = {
      childAges: Array(childrenCount).fill(""),
    };
    let isValid = true;

    // Validate each child's age
    childAges.slice(0, childrenCount).forEach((age, index) => {
      if (age === "" || age < 0 || age > 17 || isNaN(age)) {
        newErrors.childAges[
          index
        ] = `Please enter a valid age between 0 and 17`;
        isValid = false;
      }
    });

    dispatch({ type: "SET_ERRORS", payload: newErrors });
    return isValid;
  }, [childAges, childrenCount]);

  const validateVisits = useCallback(() => {
    const totalVisits = scienceVisits + dpkhVisits + dpkrVisits;

    if (totalVisits === 0) {
      announceToScreenReader(
        "Please select at least one visit to generate a recommendation.",
        "assertive"
      );
      return false;
    }
    return true;
  }, [scienceVisits, dpkhVisits, dpkrVisits]);

  /**
   * Accessibility announcement function
   */
  const announceToScreenReader = useCallback(
    (message, importance = "polite") => {
      // Set the announcement message in state
      dispatch({ type: "SET_ANNOUNCEMENT", payload: message });

      // For critical announcements, try to use the assertive region
      if (importance === "assertive") {
        try {
          const assertiveRegion = document.getElementById(
            "assertive-announcements"
          );
          if (assertiveRegion) {
            assertiveRegion.textContent = message;
          }
        } catch (error) {
          console.error("Error updating assertive announcement region:", error);
        }
      }
    },
    []
  );

  /**
   * Event handlers for family form
   */
  const handleAdultCountChange = useCallback((count) => {
    dispatch({
      type: "SET_ADULT_COUNT",
      payload: Math.min(
        Math.max(1, count),
        PricingConfig.Constraints.MAX_ADULTS
      ),
    });
  }, []);

  const handleChildrenCountChange = useCallback((count) => {
    dispatch({
      type: "SET_CHILDREN_COUNT",
      payload: Math.min(
        Math.max(0, count),
        PricingConfig.Constraints.MAX_CHILDREN
      ),
    });
  }, []);

  const handleChildAgeChange = useCallback(
    (index, age) => {
      // Handle empty string case by not validating immediately
      if (age === "") {
        dispatch({ type: "SET_CHILD_AGE", payload: { index, age: "" } });
        return;
      }

      // Parse to number and validate
      const numAge = Number(age);
      dispatch({ type: "SET_CHILD_AGE", payload: { index, age: numAge } });

      // Validate on change
      const newErrors = { ...errors };
      if (isNaN(numAge) || numAge < 0 || numAge > 17) {
        newErrors.childAges[
          index
        ] = `Please enter a valid age between 0 and 17`;
      } else {
        newErrors.childAges[index] = "";
      }
      dispatch({ type: "SET_ERRORS", payload: newErrors });
    },
    [errors]
  );

  /**
   * Reset calculator
   */
  const resetCalculator = useCallback(() => {
    dispatch({ type: "RESET_CALCULATOR" });

    // Reset the initialRender ref so the next render is treated as initial
    initialRenderRef.current = true;

    // Announce for screen readers
    announceToScreenReader(
      "Calculator has been reset to defaults.",
      "assertive"
    );
  }, []);

  return (
    <div className="calculator-container bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Skip navigation for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>
      <div
        id="assertive-announcements"
        className="sr-only"
        aria-live="assertive"
      ></div>

      <main id="main-content">
        {/* Use MembershipTools component instead of directly rendering calculator components */}
        <MembershipTools
          currentStep={currentStep}
          adultCount={adultCount}
          childrenCount={childrenCount}
          childAges={childAges}
          scienceVisits={scienceVisits}
          dpkhVisits={dpkhVisits}
          dpkrVisits={dpkrVisits}
          isRichmondResident={isRichmondResident}
          needsFlexibility={needsFlexibility}
          isWelcomeEligible={isWelcomeEligible}
          includeParking={includeParking}
          errors={errors}
          membershipRecommendation={membershipRecommendation}
          formatCurrency={formatCurrency}
          onNextStep={nextStep}
          onPrevStep={prevStep}
          onAdultCountChange={handleAdultCountChange}
          onChildrenCountChange={handleChildrenCountChange}
          onChildAgeChange={handleChildAgeChange}
          onRichmondResidentChange={(value) =>
            dispatch({ type: "SET_RICHMOND_RESIDENT", payload: value })
          }
          onFlexibilityChange={(value) =>
            dispatch({ type: "SET_NEEDS_FLEXIBILITY", payload: value })
          }
          onWelcomeEligibleChange={(value) =>
            dispatch({ type: "SET_WELCOME_ELIGIBLE", payload: value })
          }
          onScienceVisitsChange={(value) =>
            dispatch({ type: "SET_SCIENCE_VISITS", payload: value })
          }
          onDpkhVisitsChange={(value) =>
            dispatch({ type: "SET_DPKH_VISITS", payload: value })
          }
          onDpkrVisitsChange={(value) =>
            dispatch({ type: "SET_DPKR_VISITS", payload: value })
          }
          onIncludeParkingChange={(value) =>
            dispatch({ type: "SET_INCLUDE_PARKING", payload: value })
          }
        />

        {/* This section appears below both calculators */}
        {currentStep === 3 && (
          <div>
            {/* Welcome Program Notification (only show if relevant) */}
            {isWelcomeEligible &&
              membershipRecommendation?.bestMembershipType !== "Welcome" &&
              membershipRecommendation?.welcomeProgramOption && (
                <WelcomeNotification
                  welcomeOption={membershipRecommendation.welcomeProgramOption}
                  formatCurrency={formatCurrency}
                />
              )}

            {/* Situation Breakdown */}
            <SituationBreakdown primaryLocationIcon={primaryLocationIcon} />

            {/* Navigation Buttons */}
            <div className="button-group">
              <button
                onClick={prevStep}
                className="secondary-button"
                aria-label="Go back to adjust your visit plans"
              >
                Adjust My Visit Plans
              </button>
              <button
                onClick={resetCalculator}
                className="secondary-button"
                aria-label="Start over from the beginning"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DiscoveryPlaceMembershipCalculator;
