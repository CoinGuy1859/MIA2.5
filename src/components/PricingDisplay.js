// components/PricingDisplay.js
import React from "react";
import { PricingConfig } from "../pricing/pricing-module";

/**
 * PricingDisplay component - Shows pricing information for the recommended membership
 * Refactored to improve readability and maintainability
 */
const PricingDisplay = ({ recommendation, formatCurrency, getTotalPrice }) => {
  // Calculate total additional costs
  const totalAdditionalCosts = getTotalAdditionalCosts(recommendation);

  // Get discount percentage for display
  const discountPercentage = Math.round(
    PricingConfig.Discounts.membershipDiscount.currentRate * 100
  );

  return (
    <div className="recommendation-pricing">
      <div className="pricing-breakdown" style={{ textAlign: "center" }}>
        {/* Base Membership Pricing */}
        <BaseMembershipSection
          recommendation={recommendation}
          discountPercentage={discountPercentage}
          formatCurrency={formatCurrency}
        />

        {/* Additional Costs (like parking) */}
        {hasAdditionalCosts(recommendation) && (
          <AdditionalCostsSection
            recommendation={recommendation}
            totalAdditionalCosts={totalAdditionalCosts}
            formatCurrency={formatCurrency}
          />
        )}

        {/* General Admission Costs for other locations */}
        {hasGeneralAdmissionCosts(recommendation) && (
          <GeneralAdmissionSection
            recommendation={recommendation}
            formatCurrency={formatCurrency}
          />
        )}

        {/* Total Price Section */}
        <TotalPriceSection
          totalPrice={getTotalPrice()}
          bestMembershipType={recommendation.bestMembershipType}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
};

/**
 * Helper function to check if recommendation has additional costs
 */
const hasAdditionalCosts = (recommendation) => {
  return (
    recommendation.additionalCosts && recommendation.additionalCosts.length > 0
  );
};

/**
 * Helper function to check if recommendation has general admission costs
 */
const hasGeneralAdmissionCosts = (recommendation) => {
  return recommendation.generalAdmissionCosts > 0;
};

/**
 * Helper function to calculate total additional costs
 */
const getTotalAdditionalCosts = (recommendation) => {
  return hasAdditionalCosts(recommendation)
    ? recommendation.additionalCosts.reduce((sum, item) => sum + item.cost, 0)
    : 0;
};

/**
 * Base Membership Section Component
 */
const BaseMembershipSection = ({
  recommendation,
  discountPercentage,
  formatCurrency,
}) => {
  const membershipLabel = getMembershipLabel(recommendation);

  return (
    <div className="base-membership-section" style={{ marginBottom: "15px" }}>
      <div
        className="price-label"
        style={{
          fontSize: "15px",
          fontWeight: "500",
          color: "#4a5568",
          marginBottom: "5px",
        }}
      >
        {membershipLabel}
      </div>
      <div className="price-values">
        {/* Show original price with strikethrough if discount eligible */}
        {showOriginalPrice(recommendation) && (
          <OriginalPriceDisplay
            price={recommendation.baseMembershipPrice}
            formatCurrency={formatCurrency}
          />
        )}
        <DiscountedPriceDisplay
          price={recommendation.baseMembershipDiscount || 0}
          isDiscountEligible={recommendation.discountEligible}
          discountPercentage={discountPercentage}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
};

/**
 * Helper function to determine if original price should be shown
 */
const showOriginalPrice = (recommendation) => {
  return recommendation.discountEligible && recommendation.baseMembershipPrice;
};

/**
 * Helper function to get membership label
 */
const getMembershipLabel = (recommendation) => {
  if (recommendation.bestMembershipType.includes("Basic")) {
    return "Basic Membership:";
  } else if (recommendation.bestMembershipType === "Welcome") {
    return "Welcome Program:";
  } else if (recommendation.bestMembershipType === "PayAsYouGo") {
    return "Regular Admission:";
  } else {
    return "Membership:";
  }
};

/**
 * Original Price Display Component
 */
const OriginalPriceDisplay = ({ price, formatCurrency }) => (
  <div
    className="original-price"
    style={{
      fontSize: "16px",
      textDecoration: "line-through",
      color: "#a0aec0",
    }}
  >
    {formatCurrency(price)}
  </div>
);

/**
 * Discounted Price Display Component
 */
const DiscountedPriceDisplay = ({
  price,
  isDiscountEligible,
  discountPercentage,
  formatCurrency,
}) => (
  <div
    className="discounted-price"
    style={{
      fontSize: "20px",
      fontWeight: "600",
      color: "#2d3748",
    }}
  >
    {formatCurrency(price)}
    {isDiscountEligible && (
      <span
        style={{
          fontSize: "14px",
          fontWeight: "normal",
          color: "#48bb78",
          marginLeft: "8px",
        }}
      >
        ({discountPercentage}% off)
      </span>
    )}
  </div>
);

/**
 * Additional Costs Section Component
 */
const AdditionalCostsSection = ({
  recommendation,
  totalAdditionalCosts,
  formatCurrency,
}) => (
  <div
    className="additional-costs-section"
    style={{
      marginBottom: "15px",
      paddingTop: "10px",
      borderTop: "1px dashed #e2e8f0",
    }}
  >
    <div
      className="price-label"
      style={{
        fontSize: "15px",
        fontWeight: "500",
        color: "#4a5568",
        marginBottom: "5px",
      }}
    >
      Additional Costs:
    </div>
    <div>
      <span
        className="additional-cost-value"
        style={{
          fontSize: "20px",
          fontWeight: "600",
          color: "#2d3748",
        }}
      >
        + {formatCurrency(totalAdditionalCosts)}
      </span>
    </div>
    {/* Basic breakdown of additional costs */}
    <AdditionalCostsBreakdown
      additionalCosts={recommendation.additionalCosts}
      formatCurrency={formatCurrency}
    />
  </div>
);

/**
 * Additional Costs Breakdown Component
 */
const AdditionalCostsBreakdown = ({ additionalCosts, formatCurrency }) => (
  <div
    className="basic-cost-breakdown"
    style={{
      marginTop: "10px",
      textAlign: "left",
      backgroundColor: "#f7fafc",
      padding: "10px",
      borderRadius: "4px",
    }}
  >
    {additionalCosts.map((item, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px",
          marginBottom: index === additionalCosts.length - 1 ? 0 : "5px",
        }}
      >
        <span>{item.label}</span>
        <span style={{ fontWeight: "500" }}>{formatCurrency(item.cost)}</span>
      </div>
    ))}
  </div>
);

/**
 * General Admission Section Component
 */
const GeneralAdmissionSection = ({ recommendation, formatCurrency }) => (
  <div
    className="general-admission-section"
    style={{
      marginBottom: "15px",
      paddingTop: "10px",
      borderTop: "1px dashed #e2e8f0",
      backgroundColor: "#f8fafc",
      padding: "10px",
      borderRadius: "4px",
    }}
  >
    <div
      className="price-label"
      style={{
        fontSize: "15px",
        fontWeight: "500",
        color: "#4a5568",
        marginBottom: "5px",
      }}
    >
      General Admission (Other Locations):
    </div>
    <div>
      <span
        className="general-admission-value"
        style={{
          fontSize: "20px",
          fontWeight: "600",
          color: "#2d3748",
        }}
      >
        + {formatCurrency(recommendation.generalAdmissionCosts)}
      </span>
      <div
        style={{
          fontSize: "13px",
          color: "#718096",
          marginTop: "5px",
        }}
      >
        {recommendation.generalAdmissionNote ||
          "Discounted admission to other Discovery Place locations"}
      </div>
    </div>
  </div>
);

/**
 * Total Price Section Component
 */
const TotalPriceSection = ({
  totalPrice,
  bestMembershipType,
  formatCurrency,
}) => (
  <div
    className="total-price-section"
    style={{
      marginTop: "20px",
      paddingTop: "15px",
      paddingBottom: "10px",
      borderTop: "2px solid #e2e8f0",
      borderBottom: "2px solid #e2e8f0",
      backgroundColor: "#f7fafc",
    }}
  >
    <div
      className="price-label"
      style={{
        fontSize: "16px",
        fontWeight: "600",
        marginBottom: "5px",
      }}
    >
      Total Price:
    </div>
    <div
      className="total-price-value"
      style={{
        fontSize: "32px",
        fontWeight: "700",
        color: "#2d3748",
      }}
    >
      {formatCurrency(totalPrice)}
    </div>
    <div
      className="price-period"
      style={{
        fontSize: "14px",
        color: "#718096",
        fontWeight: "500",
      }}
    >
      {bestMembershipType === "PayAsYouGo" ? "for all visits" : "per year"}
    </div>
  </div>
);

export default PricingDisplay;
