// components/CopyToClipboard.js
import React, { useState, useCallback } from "react";

/**
 * CopyToClipboard Component - Formats and copies recommendation data to clipboard
 * Optimized with better organization and component separation
 */
const CopyToClipboard = ({ results, formatCurrency }) => {
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Format the recommendation text - extracted to improve readability
  const formatRecommendationText = useCallback(() => {
    if (!results) return "";

    const sections = [
      generateHeaderSection(results),
      generateMainSection(results, formatCurrency),
      generateComparisonSection(results, formatCurrency),
      generateBenefitsSection(results),
      generateContactSection(results),
    ];

    return sections.join("");
  }, [results, formatCurrency]);

  // Handle the clipboard copy operation
  const copyToClipboard = useCallback(() => {
    const text = formatRecommendationText();

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setErrorMessage("");
        // Reset copied state after 3 seconds
        setTimeout(() => setCopied(false), 3000);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        setErrorMessage("Error copying to clipboard. Please try again.");
      });
  }, [formatRecommendationText]);

  return (
    <div className="copy-recommendation">
      {/* Accessible announcement region */}
      <div id="clipboard-announce" className="sr-only" aria-live="polite">
        {copied ? "Recommendation copied to clipboard!" : errorMessage}
      </div>

      <CopyButton onClick={copyToClipboard} copied={copied} />

      {/* Success message */}
      {copied && <CopySuccessMessage />}

      {/* Error message */}
      {errorMessage && (
        <div className="save-error">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Copy Button Component with icon and label - Updated with improved styling
 */
const CopyButton = ({ onClick, copied }) => (
  <button
    onClick={onClick}
    className="save-button"
    aria-label="Copy membership recommendation to clipboard"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center", // Center the content
      backgroundColor: "#f7fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "6px",
      padding: "12px 16px",
      width: "100%",
      cursor: "pointer",
      color: "#4a5568",
      fontWeight: "500",
      fontSize: "14px",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      transition: "all 0.2s ease",
    }}
  >
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
      role="img"
      aria-hidden="true"
      style={{ marginRight: "8px", flexShrink: 0 }}
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    </svg>
    {copied ? "Copied!" : "Copy Recommendation"}
  </button>
);

/**
 * Clipboard Icon Component
 */
const ClipboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-hidden="true"
  >
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
  </svg>
);

/**
 * Success Message Component
 */
const CopySuccessMessage = () => (
  <div className="save-success">
    <p>Recommendation copied to clipboard!</p>
  </div>
);

/**
 * Generate Header Section for recommendation text
 */
const generateHeaderSection = () => {
  return [
    "Discovery Place Membership Recommendation\n",
    "========================================\n\n",
  ].join("");
};

/**
 * Generate Main recommendation section
 */
const generateMainSection = (results, formatCurrency) => {
  const membershipType =
    results.bestMembershipLabel || "Discovery Place Membership";
  const totalPrice = formatCurrency(results.bestMembershipPromoCost || 0);
  const visitsText = results.totalVisits === 1 ? "visit" : "visits";

  return [
    `Recommended membership: ${membershipType}\n`,
    `Total price: ${totalPrice} per year\n`,
    `Based on ${results.totalVisits} planned ${visitsText}\n\n`,
  ].join("");
};

/**
 * Generate Cost Comparison section
 */
const generateComparisonSection = (results, formatCurrency) => {
  const totalPrice = formatCurrency(results.bestMembershipPromoCost || 0);
  const savings = formatCurrency(results.bestMembershipSavings || 0);
  const admissionCost = formatCurrency(results.regularAdmissionCost || 0);

  // Safely calculate percentage
  const savingsPercent = calculateSavingsPercentage(
    results.bestMembershipSavings,
    results.regularAdmissionCost
  );

  return [
    "COST COMPARISON:\n",
    `Pay-per-visit cost: ${admissionCost}\n`,
    `Membership cost: ${totalPrice}\n\n`,
    "SAVINGS DETAILS:\n",
    `You save: ${savings} compared to regular admission (${admissionCost})\n`,
    `This is approximately ${savingsPercent}% off regular admission\n\n`,
  ].join("");
};

/**
 * Calculate savings percentage with safe handling of edge cases
 */
const calculateSavingsPercentage = (savings, regularCost) => {
  if (!regularCost || regularCost <= 0 || !savings) return 0;

  return Math.min(90, Math.round((savings / regularCost) * 100));
};

/**
 * Generate Benefits section
 */
const generateBenefitsSection = (results) => {
  const isBasicMembership =
    results.bestMembershipType && results.bestMembershipType.includes("Basic");

  const lines = ["BENEFITS:\n"];

  // Add discount eligibility
  if (results.discountEligible) {
    lines.push("• Includes 20% membership discount\n");
  }

  // Add membership type info
  if (isBasicMembership) {
    const hasChild = results.bestMembershipType.includes("DPK");
    lines.push(
      `• Basic membership for one adult${hasChild ? " and one child" : ""}\n`
    );
    lines.push("• Includes 50% off guest admission for other family members\n");
  } else {
    lines.push(
      `• Full membership for all family members (${results.totalFamilyMembers} people)\n`
    );
  }

  // Add cross-location benefits
  if (results.bestMembershipType === "ScienceKids") {
    lines.push("• Includes access to all Discovery Place locations\n");
  } else {
    const discountPercent =
      results.bestMembershipType !== "DPKR" ? "25%" : "no";
    lines.push(
      `• Includes ${discountPercent}% off admission at other Discovery Place locations\n`
    );
  }

  // Add parking benefit
  lines.push("• $8 flat-rate parking at Discovery Place Science\n\n");

  return lines.join("");
};

/**
 * Generate Contact section
 */
const generateContactSection = (results) => {
  return [
    "HOW TO PURCHASE:\n",
    `• Online: ${results.purchaseLink || "https://discoveryplace.org"}\n`,
    "• Call: (704) 337-2661\n",
    "• Email: members@discoveryplace.org\n",
  ].join("");
};

export default CopyToClipboard;
