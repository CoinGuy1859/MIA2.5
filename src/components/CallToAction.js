// components/CallToAction.js
import React from "react";

/**
 * CallToAction component
 * Displays purchase link and other call to action elements
 * Optimized for better readability, accessibility, and maintainability
 */
const CallToAction = ({ recommendation }) => {
  // Safety check - if no recommendation or purchase link, don't render
  if (!recommendation || !recommendation.purchaseLink) {
    return null;
  }

  // Determine the button label based on membership type
  const buttonLabel = getButtonLabel(recommendation.bestMembershipType);

  // Get the screen reader label for better accessibility
  const ariaLabel = getAriaLabel(recommendation.bestMembershipLabel);

  return (
    <ActionContainer>
      <PurchaseButton
        purchaseLink={recommendation.purchaseLink}
        buttonLabel={buttonLabel}
        ariaLabel={ariaLabel}
      />
    </ActionContainer>
  );
};

/**
 * Helper function to determine button label based on membership type
 */
const getButtonLabel = (membershipType) => {
  return membershipType === "PayAsYouGo"
    ? "Purchase This Admission"
    : "Purchase This Membership";
};

/**
 * Helper function to create accessible aria-label
 */
const getAriaLabel = (membershipLabel) => {
  return `Purchase ${membershipLabel}`;
};

/**
 * Container for the call to action button
 */
const ActionContainer = ({ children }) => (
  <div style={{ textAlign: "center" }}>{children}</div>
);

/**
 * Purchase Button Component
 */
const PurchaseButton = ({ purchaseLink, buttonLabel, ariaLabel }) => (
  <a
    href={purchaseLink}
    target="_blank"
    rel="noopener noreferrer"
    className="cta-button"
    style={{
      backgroundColor: "#38a169",
      color: "white",
      padding: "16px 24px",
      borderRadius: "8px",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      textAlign: "center",
      width: "100%",
      maxWidth: "400px",
      margin: "0 auto",
      fontSize: "18px",
      boxShadow: "0 4px 6px rgba(56, 161, 105, 0.3)",
      transition: "all 0.2s ease",
      border: "none",
      cursor: "pointer",
    }}
    aria-label={ariaLabel}
    role="button"
    onMouseOver={(e) => {
      e.currentTarget.style.backgroundColor = "#2f855a";
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 6px 8px rgba(56, 161, 105, 0.4)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.backgroundColor = "#38a169";
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 6px rgba(56, 161, 105, 0.3)";
    }}
  >
    {buttonLabel}
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
      style={{ marginLeft: "10px" }}
    >
      <path d="M7 17l9.2-9.2M17 17V7H7" />
    </svg>
    <span className="sr-only"> - Opens in a new window</span>
  </a>
);

export default CallToAction;
