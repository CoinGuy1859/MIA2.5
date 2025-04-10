// components/SavingsHighlight.js
import React from "react";
import { PricingConfig } from "../pricing/pricing-module";
import CheckIcon from "./CheckIcon";

/**
 * SavingsHighlight component
 * Displays savings information compared to regular admission
 * Optimized for better readability and maintainability
 */
const SavingsHighlight = ({ recommendation, formatCurrency }) => {
  // If no savings to show, don't render anything
  if (!hasSavings(recommendation)) {
    return null;
  }

  // Calculate savings percentage with safety check
  const savingsPercentage = getSavingsPercentage(recommendation);

  return (
    <HighlightContainer>
      <PrimarySavingsDisplay
        savings={recommendation.bestMembershipSavings}
        formatCurrency={formatCurrency}
      />

      <SavingsPercentage percentage={savingsPercentage} />

      {/* Show discount information if eligible */}
      {recommendation.discountEligible && (
        <DiscountInfo discountPercentage={getMembershipDiscountRate()} />
      )}
    </HighlightContainer>
  );
};

/**
 * Check if the recommendation has savings to display
 */
const hasSavings = (recommendation) => {
  return recommendation && recommendation.bestMembershipSavings > 0;
};

/**
 * Calculate savings percentage with proper ceiling
 */
const getSavingsPercentage = (recommendation) => {
  const regularCost = recommendation.regularAdmissionCost || 0;
  if (regularCost <= 0) return 0;

  const savingsAmount = recommendation.bestMembershipSavings || 0;
  const percentage = Math.round((savingsAmount / regularCost) * 100);

  // Cap at a reasonable maximum to prevent unrealistic percentages
  return Math.min(percentage, 90);
};

/**
 * Get the current membership discount rate
 */
const getMembershipDiscountRate = () => {
  return Math.round(
    PricingConfig.Discounts.membershipDiscount.currentRate * 100
  );
};

/**
 * Container component for the savings highlight
 */
const HighlightContainer = ({ children }) => (
  <div
    className="savings-highlight"
    style={{
      backgroundColor: "#f0fff4",
      padding: "15px 20px",
      borderRadius: "8px",
      marginTop: "20px",
      textAlign: "center",
    }}
  >
    {children}
  </div>
);

/**
 * Primary Savings Display Component
 */
const PrimarySavingsDisplay = ({ savings, formatCurrency }) => (
  <div
    className="savings-amount"
    style={{
      fontSize: "22px",
      fontWeight: "700",
      color: "#38a169",
      marginBottom: "5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CheckIcon size={20} color="#38a169" style={{ marginRight: "8px" }} />
    You Save: {formatCurrency(savings)}
  </div>
);

/**
 * Savings Percentage Component
 */
const SavingsPercentage = ({ percentage }) => (
  <div
    className="savings-percentage"
    style={{
      fontSize: "16px",
      color: "#2f855a",
      fontWeight: "500",
    }}
  >
    That's{" "}
    <span style={{ fontSize: "18px", fontWeight: "700" }}>{percentage}%</span>{" "}
    off regular admission!
  </div>
);

/**
 * Discount Information Component
 */
const DiscountInfo = ({ discountPercentage }) => (
  <div
    className="discount-info"
    style={{
      marginTop: "10px",
      borderTop: "1px dashed #c6f6d5",
      paddingTop: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CheckIcon size={16} color="#38a169" style={{ marginRight: "6px" }} />
    Includes {discountPercentage}% membership discount
  </div>
);

export default SavingsHighlight;
