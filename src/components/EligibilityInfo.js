// components/EligibilityInfo.js
import React from "react";
import { PricingConfig } from "../pricing/pricing-module";
import CheckIcon from "./CheckIcon";

/**
 * EligibilityInfo component
 * Displays information about discount eligibility
 * Optimized for better readability and maintainability
 */
const EligibilityInfo = ({ recommendation }) => {
  // If no recommendation data, don't render
  if (!recommendation) return null;

  // Get eligibility status and message
  const { isEligible, message, alertType } = getEligibilityInfo(recommendation);

  return (
    <EligibilityContainer
      isEligible={isEligible}
      membershipType={recommendation.bestMembershipType}
    >
      <EligibilityHeader isEligible={isEligible} />
      <EligibilityMessage message={message} isEligible={isEligible} />
    </EligibilityContainer>
  );
};

/**
 * Determines eligibility info based on recommendation
 */
const getEligibilityInfo = (recommendation) => {
  // Check if eligible for welcome program or discount
  const isWelcomeProgram = recommendation.bestMembershipType === "Welcome";
  const isDiscountEligible = recommendation.discountEligible;
  const isEligible = isDiscountEligible || isWelcomeProgram;

  // Get the appropriate message based on status
  let message = getEligibilityMessage(recommendation);

  // Determine alert type (success or warning)
  const alertType = isEligible ? "success" : "warning";

  return { isEligible, message, alertType };
};

/**
 * Gets the appropriate eligibility message
 */
const getEligibilityMessage = (recommendation) => {
  const { discountEligible, bestMembershipType, totalFamilyMembers } =
    recommendation;

  const discountRate = Math.round(
    PricingConfig.Discounts.membershipDiscount.currentRate * 100
  );
  const minMembers = PricingConfig.Discounts.membershipDiscount.minimumMembers;

  if (discountEligible) {
    return `✓ Eligible for ${discountRate}% discount`;
  } else {
    if (bestMembershipType === "Welcome") {
      return "✓ Eligible for Welcome Program pricing";
    } else if (totalFamilyMembers < minMembers) {
      return `! Not eligible for discount: requires ${minMembers} or more people.`;
    } else if (bestMembershipType === "DPKR") {
      return "! Not eligible for discount: Rockingham memberships do not qualify for the promotional discount.";
    } else if (bestMembershipType === "PayAsYouGo") {
      return "Regular admission (no membership)";
    }
    return "! Not eligible for current discount.";
  }
};

/**
 * Eligibility Container Component
 */
const EligibilityContainer = ({ children, isEligible, membershipType }) => {
  // Welcome Program is always shown with success styling
  const isWelcomeProgram = membershipType === "Welcome";
  const showSuccessStyling = isEligible || isWelcomeProgram;

  return (
    <div
      className="eligibility-info"
      style={{
        padding: "15px",
        marginTop: "10px",
        marginBottom: "20px",
        backgroundColor: showSuccessStyling ? "#f0fff4" : "#fff5f5",
        borderRadius: "6px",
        borderLeft: `4px solid ${showSuccessStyling ? "#38a169" : "#e53e3e"}`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Eligibility Header Component
 */
const EligibilityHeader = ({ isEligible }) => (
  <h4
    style={{
      marginTop: 0,
      marginBottom: "10px",
      fontWeight: "600",
    }}
  >
    <span role="img" aria-hidden="true">
      {isEligible ? "✓ " : "! "}
    </span>
    Discount Eligibility
  </h4>
);

/**
 * Eligibility Message Component
 */
const EligibilityMessage = ({ message, isEligible }) => (
  <p
    style={{
      margin: 0,
      color: isEligible ? "#2f855a" : "#c53030",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
    }}
  >
    {isEligible && (
      <CheckIcon size={18} color="#2f855a" style={{ marginRight: "6px" }} />
    )}
    {message}
  </p>
);

export default EligibilityInfo;
