// components/MembershipRecommendation.js
import React, { useState } from "react";
import { PricingConfig } from "../pricing/pricing-module";
import Logos from "../components/Logos";
import SavingsBreakdown from "./SavingsBreakdown";
import CopyToClipboard from "./CopyToClipboard";
import DetailedAdmissionComparison from "./DetailedAdmissionComparison";
import PromotionBanner from "./PromotionBanner";
import EligibilityInfo from "./EligibilityInfo";
import PricingDisplay from "./PricingDisplay";
import SavingsHighlight from "./SavingsHighlight";
import CallToAction from "./CallToAction";
import MembershipComparator from "./MembershipComparator";
import VisitPatternVisualization from "./VisitPatternVisualization";
import MembershipFAQ from "./MembershipFAQ";
import PrintMembershipInfo from "./PrintMembershipInfo";

/**
 * MembershipRecommendation component
 * Displays the recommended membership option and related details
 * Optimized for better organization, readability, and maintainability
 */
const MembershipRecommendation = ({
  recommendation,
  formatCurrency,
  scienceVisits = 0,
  dpkhVisits = 0,
  dpkrVisits = 0,
  adultCount = 0,
  childAges = [],
  isRichmondResident = false,
  includeParking = true,
}) => {
  // Local state for showing/hiding additional sections
  const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState(false);
  const [showMembershipComparison, setShowMembershipComparison] =
    useState(false);

  // Helper function to get total price
  const getTotalPrice = () => {
    if (!recommendation) return 0;

    const membershipCost = recommendation?.baseMembershipDiscount || 0;
    const additionalCost =
      recommendation?.additionalCosts &&
      recommendation.additionalCosts.length > 0
        ? recommendation.additionalCosts.reduce(
            (sum, item) => sum + item.cost,
            0
          )
        : 0;
    const generalAdmissionCost = recommendation?.generalAdmissionCosts || 0;

    return membershipCost + additionalCost + generalAdmissionCost;
  };

  // For no visits scenario
  if (!recommendation || (recommendation.totalVisits || 0) === 0) {
    return <NoVisitsMessage />;
  }

  // Calculate total visits
  const totalVisits = scienceVisits + dpkhVisits + dpkrVisits;

  return (
    <section className="recommendation-container">
      <div
        className="header-logo"
        style={{ textAlign: "center", marginBottom: "24px" }}
      >
        <Logos.MainHeader />
      </div>

      <h2
        id="recommendation-step-heading"
        tabIndex="-1"
        style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#2d3748",
          textAlign: "center",
          margin: "0 0 16px 0",
        }}
      >
        Your Personalized Recommendation
      </h2>

      {/* Promotion Banner - Only show if there's a current promotion */}
      {PricingConfig.Discounts.membershipDiscount.currentRate > 0 && (
        <PromotionBanner />
      )}

      {/* Eligibility Information */}
      <EligibilityInfo recommendation={recommendation} />

      {/* Main Recommendation Card */}
      <RecommendationCard
        recommendation={recommendation}
        formatCurrency={formatCurrency}
        getTotalPrice={getTotalPrice}
        scienceVisits={scienceVisits}
        dpkhVisits={dpkhVisits}
        dpkrVisits={dpkrVisits}
        adultCount={adultCount}
        childAges={childAges}
        isRichmondResident={isRichmondResident}
        includeParking={includeParking}
      />

      {/* Toggle buttons for additional analysis */}
      <ToggleButtonsContainer
        showAdvancedAnalysis={showAdvancedAnalysis}
        setShowAdvancedAnalysis={setShowAdvancedAnalysis}
        showMembershipComparison={showMembershipComparison}
        setShowMembershipComparison={setShowMembershipComparison}
      />

      {/* Additional Analysis Sections */}
      {showAdvancedAnalysis && (
        <VisitPatternVisualization
          scienceVisits={scienceVisits}
          dpkhVisits={dpkhVisits}
          dpkrVisits={dpkrVisits}
          recommendation={recommendation}
        />
      )}

      {showMembershipComparison && (
        <MembershipComparator
          recommendation={recommendation}
          formatCurrency={formatCurrency}
          totalVisits={totalVisits}
        />
      )}

      {/* Add FAQ Section */}
      <div style={{ marginTop: "30px" }}>
        <MembershipFAQ recommendation={recommendation} />
      </div>
    </section>
  );
};

/**
 * No Visits Message Component
 */
const NoVisitsMessage = () => (
  <div
    className="no-visits-message"
    style={{
      textAlign: "center",
      padding: "30px 20px",
      backgroundColor: "#ebf8ff",
      borderRadius: "12px",
      margin: "40px 0",
      border: "1px solid #90cdf4",
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#3182ce"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ margin: "0 auto 20px" }}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    <h3
      style={{
        fontSize: "20px",
        fontWeight: "600",
        color: "#2c5282",
        marginBottom: "16px",
      }}
    >
      No Visits Selected
    </h3>
    <p style={{ fontSize: "16px", color: "#4a5568", marginBottom: "24px" }}>
      You haven't selected any visits to our locations. Please go back and let
      us know how often you plan to visit so we can recommend the best
      membership option for you.
    </p>
    <button
      onClick={() => window.location.reload()}
      className="primary-button"
      aria-label="Update visit plans"
      style={{ margin: "0 auto", minWidth: "200px" }}
    >
      Update Visit Plans
    </button>
  </div>
);

/**
 * Toggle buttons container - Collapses to a small control panel when an option is active
 */
const ToggleButtonsContainer = ({
  showAdvancedAnalysis,
  setShowAdvancedAnalysis,
  showMembershipComparison,
  setShowMembershipComparison,
}) => {
  // Check if any tool is currently active
  const isAnyToolActive = showAdvancedAnalysis || showMembershipComparison;

  // Use state to allow toggling the visibility of the full controls when collapsed
  const [showExpandedControls, setShowExpandedControls] = React.useState(false);

  // If any tool is active and expanded controls aren't shown, display compact version
  if (isAnyToolActive && !showExpandedControls) {
    return (
      <div
        className="toggle-button-mini-container"
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "24px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "center",
            padding: "12px 16px",
            backgroundColor: "#ebf8ff",
            borderRadius: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #bee3f8",
          }}
        >
          {/* Active tool indicators */}
          {showAdvancedAnalysis && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                color: "#3182ce",
              }}
            >
              <button
                onClick={() => setShowAdvancedAnalysis(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#3182ce",
                  padding: "2px",
                  display: "flex",
                  alignItems: "center",
                }}
                aria-label="Close Advanced Analysis"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="12" width="4" height="8" rx="1"></rect>
                  <rect x="10" y="8" width="4" height="12" rx="1"></rect>
                  <rect x="17" y="4" width="4" height="16" rx="1"></rect>
                </svg>
                <span style={{ marginLeft: "4px" }}>Analysis Active</span>
                <CloseIcon style={{ marginLeft: "4px" }} />
              </button>
            </div>
          )}

          {showMembershipComparison && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                color: "#3182ce",
              }}
            >
              <button
                onClick={() => setShowMembershipComparison(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#3182ce",
                  padding: "2px",
                  display: "flex",
                  alignItems: "center",
                }}
                aria-label="Close Membership Comparison"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                <span style={{ marginLeft: "4px" }}>Comparison Active</span>
                <CloseIcon style={{ marginLeft: "4px" }} />
              </button>
            </div>
          )}

          {/* Show more tools button */}
          <button
            onClick={() => setShowExpandedControls(true)}
            style={{
              marginLeft: "4px",
              backgroundColor: "#dbeafe",
              border: "1px solid #90cdf4",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "14px",
              cursor: "pointer",
              color: "#2c5282",
              fontWeight: "500",
            }}
          >
            More Tools...
          </button>
        </div>
      </div>
    );
  }

  // Otherwise show the full controls (and allow them to be hidden again)
  return (
    <div
      className="toggle-buttons-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)", // Two equal columns
        gap: "20px",
        margin: "40px 0",
      }}
    >
      {/* Advanced Analysis Button */}
      <button
        onClick={() => {
          setShowAdvancedAnalysis(!showAdvancedAnalysis);
          if (!showAdvancedAnalysis && !showMembershipComparison) {
            setShowExpandedControls(false);
          }
        }}
        className={`toggle-button ${showAdvancedAnalysis ? "active" : ""}`}
        aria-expanded={showAdvancedAnalysis}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          backgroundColor: showAdvancedAnalysis ? "#ebf8ff" : "#f7fafc",
          border: `2px solid ${showAdvancedAnalysis ? "#90cdf4" : "#e2e8f0"}`,
          borderRadius: "12px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          height: "100%",
          width: "100%",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke={showAdvancedAnalysis ? "#3182ce" : "currentColor"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            width: "60px",
            height: "60px",
            marginBottom: "16px",
            color: showAdvancedAnalysis ? "#3182ce" : "#4a5568",
          }}
        >
          <rect x="3" y="12" width="4" height="8" rx="1"></rect>
          <rect x="10" y="8" width="4" height="12" rx="1"></rect>
          <rect x="17" y="4" width="4" height="16" rx="1"></rect>
        </svg>
        <span
          className="toggle-button-text"
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: showAdvancedAnalysis ? "#3182ce" : "#2d3748",
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          {showAdvancedAnalysis
            ? "Hide Advanced Visit Analysis"
            : "Show Advanced Visit Analysis"}
        </span>
        <span
          style={{
            fontSize: "14px",
            color: "#718096",
            textAlign: "center",
          }}
        >
          Visualize your visit patterns and compare costs
        </span>
      </button>

      {/* Membership Comparison Button */}
      <button
        onClick={() => {
          setShowMembershipComparison(!showMembershipComparison);
          if (!showAdvancedAnalysis && !showMembershipComparison) {
            setShowExpandedControls(false);
          }
        }}
        className={`toggle-button ${showMembershipComparison ? "active" : ""}`}
        aria-expanded={showMembershipComparison}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          backgroundColor: showMembershipComparison ? "#ebf8ff" : "#f7fafc",
          border: `2px solid ${
            showMembershipComparison ? "#90cdf4" : "#e2e8f0"
          }`,
          borderRadius: "12px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          height: "100%",
          width: "100%",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke={showMembershipComparison ? "#3182ce" : "currentColor"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            width: "60px",
            height: "60px",
            marginBottom: "16px",
            color: showMembershipComparison ? "#3182ce" : "#4a5568",
          }}
        >
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
        <span
          className="toggle-button-text"
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: showMembershipComparison ? "#3182ce" : "#2d3748",
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          {showMembershipComparison
            ? "Hide Compare Membership Options"
            : "Show Compare Membership Options"}
        </span>
        <span
          style={{
            fontSize: "14px",
            color: "#718096",
            textAlign: "center",
          }}
        >
          Side-by-side comparison of all membership types
        </span>
      </button>

      {/* Collapse button when expanded controls are shown with active tools */}
      {isAnyToolActive && showExpandedControls && (
        <div
          style={{
            gridColumn: "1 / span 2",
            textAlign: "center",
            marginTop: "-10px",
          }}
        >
          <button
            onClick={() => setShowExpandedControls(false)}
            style={{
              background: "none",
              border: "none",
              color: "#718096",
              fontSize: "14px",
              padding: "8px 16px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "500",
            }}
          >
            <span>Collapse Tools</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ marginLeft: "4px" }}
            >
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

// Small icon component for close buttons
const CloseIcon = ({ style }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    style={style}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

/**
 * Main Recommendation Card Component
 */
const RecommendationCard = ({
  recommendation,
  formatCurrency,
  getTotalPrice,
  scienceVisits,
  dpkhVisits,
  dpkrVisits,
  adultCount,
  childAges,
  isRichmondResident,
  includeParking,
}) => {
  return (
    <div
      className="recommendation-card"
      role="region"
      aria-labelledby="recommendation-title"
      aria-describedby="recommendation-explanation"
      style={{
        border: "2px solid #4299e1",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      }}
    >
      <RecommendationHeader recommendation={recommendation} />

      <div
        className="recommendation-description"
        style={{
          padding: "24px",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#f7fafc",
        }}
      >
        <p
          id="recommendation-explanation"
          style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}
        >
          {recommendation.bestMembershipExplanation ||
            "Based on your visit patterns, we've created a personalized membership recommendation."}
        </p>
      </div>

      {/* Price Display */}
      <PricingDisplay
        recommendation={recommendation}
        formatCurrency={formatCurrency}
        getTotalPrice={getTotalPrice}
      />

      {/* Savings Highlight */}
      <SavingsHighlight
        recommendation={recommendation}
        formatCurrency={formatCurrency}
      />

      {/* Cost Breakdown */}
      <CostBreakdownSection
        recommendation={recommendation}
        formatCurrency={formatCurrency}
        getTotalPrice={getTotalPrice}
        scienceVisits={scienceVisits}
        dpkhVisits={dpkhVisits}
        dpkrVisits={dpkrVisits}
        adultCount={adultCount}
        childAges={childAges}
        isRichmondResident={isRichmondResident}
        includeParking={includeParking}
      />

      {/* Call to Action */}
      <ActionSection
        recommendation={recommendation}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

/**
 * Recommendation Header Component
 */
const RecommendationHeader = ({ recommendation }) => {
  return (
    <div
      className="recommendation-type"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "24px",
        backgroundColor: "#ebf8ff",
        borderBottom: "1px solid #bee3f8",
      }}
    >
      <div
        className="recommendation-icon"
        aria-hidden="true"
        style={{
          marginRight: "20px",
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {getRecommendationIcon(recommendation?.iconType || "science")}
      </div>
      <div className="recommendation-title">
        <span
          className="recommendation-label"
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "700",
            color: "#4299e1",
            marginBottom: "6px",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          WE RECOMMEND
        </span>
        <h3
          id="recommendation-title"
          style={{
            margin: "0",
            fontSize: "24px",
            fontWeight: "700",
            color: "#2d3748",
          }}
        >
          {recommendation?.bestMembershipLabel || "Discovery Place Membership"}
        </h3>
      </div>
    </div>
  );
};

/**
 * Cost Breakdown Section Component
 */
const CostBreakdownSection = ({
  recommendation,
  formatCurrency,
  getTotalPrice,
  scienceVisits,
  dpkhVisits,
  dpkrVisits,
  adultCount,
  childAges,
  isRichmondResident,
  includeParking,
}) => {
  return (
    <div
      className="breakdown-section"
      style={{
        padding: "24px",
        borderTop: "1px solid #e2e8f0",
      }}
    >
      <h4
        style={{
          fontSize: "18px",
          fontWeight: "600",
          color: "#2d3748",
          marginTop: "0",
          marginBottom: "16px",
        }}
      >
        Cost Breakdown
      </h4>
      <SavingsBreakdown
        breakdown={recommendation?.costBreakdown || { items: [] }}
        formatCurrency={formatCurrency}
        regularAdmissionCost={recommendation?.regularAdmissionCost || 0}
        totalMembershipCost={getTotalPrice()}
      />

      {/* Detailed Admission Comparison - Now the only place for comparison data */}
      <DetailedAdmissionComparison
        recommendation={recommendation}
        scienceVisits={scienceVisits}
        dpkhVisits={dpkhVisits}
        dpkrVisits={dpkrVisits}
        adultCount={adultCount}
        childAges={childAges}
        isRichmondResident={isRichmondResident}
        includeParking={includeParking}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

/**
 * Action Section Component - Improved with consistent styling
 */
const ActionSection = ({ recommendation, formatCurrency }) => {
  return (
    <div
      className="recommendation-action"
      style={{
        padding: "24px",
        borderTop: "1px solid #e2e8f0",
        backgroundColor: "#f7fafc",
      }}
    >
      {/* Primary Purchase Button */}
      <CallToAction recommendation={recommendation} />

      {/* Utility buttons container - horizontal layout */}
      <div
        style={{
          marginTop: "24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        {/* Print Button - now side by side with copy button */}
        <div>
          <PrintMembershipInfo
            recommendation={recommendation}
            formatCurrency={formatCurrency}
          />
        </div>

        {/* Copy to Clipboard */}
        <div>
          <CopyToClipboard
            results={recommendation}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Helper function to get the appropriate logo based on membership type
 * @param {string} iconType - Type code for the membership icon
 * @returns {React.ReactNode} The appropriate logo component
 */
const getRecommendationIcon = (iconType) => {
  switch (iconType) {
    case "science":
      return (
        <div className="recommendation-logo" aria-hidden="true">
          <Logos.ScienceHeader />
        </div>
      );
    case "science-basic":
      return (
        <div className="recommendation-logo" aria-hidden="true">
          <Logos.ScienceIcon />
        </div>
      );
    case "kids-huntersville":
      return (
        <div className="recommendation-logo" aria-hidden="true">
          <Logos.KidsHuntersvilleHeader />
        </div>
      );
    case "kids-huntersville-basic":
      return (
        <div className="recommendation-logo" aria-hidden="true">
          <Logos.KidsIcon />
        </div>
      );
    case "kids-rockingham":
      return (
        <div className="recommendation-logo" aria-hidden="true">
          <Logos.KidsRockinghamHeader />
        </div>
      );
    case "kids-rockingham-basic":
      return (
        <div className="recommendation-logo" aria-hidden="true">
          <Logos.KidsIcon />
        </div>
      );
    case "science-kids":
      return (
        <div className="recommendation-logo" aria-hidden="true">
          <Logos.MainHeader />
        </div>
      );
    case "welcome":
      return (
        <div className="recommendation-logo" aria-hidden="true">
          <Logos.WelcomeIcon />
        </div>
      );
    case "ticket":
      return (
        <div className="recommendation-logo" aria-hidden="true">
          <Logos.Ticket />
        </div>
      );
    default:
      return (
        <div className="recommendation-logo" aria-hidden="true">
          <Logos.MainIcon />
        </div>
      );
  }
};

export default MembershipRecommendation;
