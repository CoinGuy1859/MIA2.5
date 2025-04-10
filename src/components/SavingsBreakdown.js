import React, { useState } from "react";

/**
 * SavingsBreakdown component - Shows cost breakdown and savings
 * Refactored to remove duplication with DetailedAdmissionComparison component
 */
const SavingsBreakdown = ({
  breakdown = { items: [] }, // Add default empty object with items array
  formatCurrency,
  regularAdmissionCost = 0,
  totalMembershipCost = 0,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!breakdown || !breakdown.items || breakdown.items.length === 0) {
    return null;
  }

  // Calculate costs and savings
  const {
    membershipCosts,
    guestSavings,
    totalCost,
    totalSavings,
    savingsPercentage,
    guestSavingsItems,
  } = calculateCostsAndSavings(breakdown, regularAdmissionCost);

  return (
    <div className="savings-breakdown">
      {/* Membership Costs Table */}
      <CostBreakdownTable
        breakdown={breakdown}
        formatCurrency={formatCurrency}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        guestSavingsItems={guestSavingsItems}
        totalCost={totalCost}
        totalSavings={totalSavings}
        regularAdmissionCost={regularAdmissionCost}
        savingsPercentage={savingsPercentage}
      />
    </div>
  );
};

/**
 * Calculate costs, savings, and other financial values
 */
const calculateCostsAndSavings = (breakdown, regularAdmissionCost) => {
  // Check if breakdown and items exist and have the expected structure
  const items = breakdown?.items || [];

  // Calculate total cost from all items - only positive costs count toward membership cost
  const membershipCosts = items
    .filter((item) => item.cost > 0)
    .reduce((sum, item) => sum + item.cost, 0);

  // Guest savings are negative costs - convert to positive for display
  const guestSavings = items
    .filter((item) => item.cost < 0)
    .reduce((sum, item) => sum + Math.abs(item.cost), 0);

  // Calculate the total cost for display
  const totalCost = Math.max(0, membershipCosts - guestSavings);

  // Calculate the savings compared to regular admission
  const totalSavings = Math.max(0, regularAdmissionCost - totalCost);

  // Safeguard against impossible savings percentages
  const savingsPercentage =
    regularAdmissionCost > 0
      ? Math.min(90, Math.round((totalSavings / regularAdmissionCost) * 100))
      : 0;

  // Filter out which items are guest savings (have negative costs)
  const guestSavingsItems = items.filter((item) => item.cost < 0);
  const hasGuestSavings = guestSavingsItems.length > 0;

  return {
    membershipCosts,
    guestSavings,
    totalCost,
    totalSavings,
    savingsPercentage,
    guestSavingsItems,
    hasGuestSavings,
  };
};

/**
 * Cost Breakdown Table Component
 */
const CostBreakdownTable = ({
  breakdown,
  formatCurrency,
  showDetails,
  setShowDetails,
  guestSavingsItems,
  totalCost,
  totalSavings,
  regularAdmissionCost,
  savingsPercentage,
}) => {
  const hasGuestSavings = guestSavingsItems.length > 0;

  return (
    <table
      className="breakdown-table"
      style={{ width: "100%", borderCollapse: "collapse" }}
    >
      <caption className="sr-only">
        Detailed cost breakdown for selected membership option
      </caption>
      <tbody>
        {/* Membership costs first (positive values) */}
        {breakdown.items
          .filter((item) => item.cost >= 0)
          .map((item, index) => (
            <CostRow
              key={`cost-${index}`}
              item={item}
              formatCurrency={formatCurrency}
            />
          ))}

        {/* Guest savings next (negative values) */}
        {guestSavingsItems.map((item, index) => (
          <SavingsRow
            key={`saving-${index}`}
            item={item}
            formatCurrency={formatCurrency}
          />
        ))}

        {/* Toggle button for detailed guest savings */}
        {hasGuestSavings &&
          breakdown.guestSavingsDetails &&
          breakdown.guestSavingsDetails.length > 0 && (
            <tr>
              <td colSpan="2" style={{ padding: "5px 0" }}>
                <ToggleButton
                  isOpen={showDetails}
                  setIsOpen={setShowDetails}
                  text="detailed guest savings breakdown"
                />
              </td>
            </tr>
          )}

        {/* Detailed guest savings breakdown */}
        {showDetails &&
          breakdown.guestSavingsDetails &&
          breakdown.guestSavingsDetails.map((detail, idx) => (
            <DetailRow
              key={`detail-${idx}`}
              detail={detail}
              formatCurrency={formatCurrency}
            />
          ))}

        {/* Total Membership Cost Row */}
        <TotalCostRow totalCost={totalCost} formatCurrency={formatCurrency} />

        {/* Savings Row */}
        <SavingsTotalRow
          totalSavings={totalSavings}
          formatCurrency={formatCurrency}
        />

        {/* Comparison Row */}
        <ComparisonRow
          regularAdmissionCost={regularAdmissionCost}
          formatCurrency={formatCurrency}
        />
      </tbody>
    </table>
  );
};

/**
 * Standard Cost Row Component
 */
const CostRow = ({ item, formatCurrency }) => (
  <tr style={{ borderBottom: "1px solid #edf2f7" }}>
    <td
      style={{
        padding: "10px 0",
        color: "#4a5568",
        fontSize: "15px",
      }}
    >
      {item.label}
      {item.details && (
        <div
          style={{
            fontSize: "13px",
            color: "#718096",
            marginTop: "2px",
          }}
        >
          {item.details}
        </div>
      )}
    </td>
    <td
      style={{
        padding: "10px 0",
        textAlign: "right",
        fontFamily: "monospace",
        fontSize: "15px",
        fontWeight: "500",
        color: "#2d3748",
      }}
    >
      {formatCurrency(item.cost)}
    </td>
  </tr>
);

/**
 * Savings Row Component
 */
const SavingsRow = ({ item, formatCurrency }) => (
  <tr style={{ borderBottom: "1px solid #edf2f7" }}>
    <td
      style={{
        padding: "10px 0",
        color: "#4a5568",
        fontSize: "15px",
      }}
    >
      <span style={{ color: "#38a169", fontWeight: "500" }}>{item.label}</span>
      {item.details && (
        <div
          style={{
            fontSize: "13px",
            color: "#718096",
            marginTop: "2px",
          }}
        >
          {item.details}
        </div>
      )}
    </td>
    <td
      style={{
        padding: "10px 0",
        textAlign: "right",
        fontFamily: "monospace",
        fontSize: "15px",
        fontWeight: "500",
        color: "#38a169",
      }}
    >
      {/* Display negative costs as positive savings values with proper formatting */}
      {formatCurrency(Math.abs(item.cost))}
    </td>
  </tr>
);

/**
 * Detail Row Component for expanded sections
 */
const DetailRow = ({ detail, formatCurrency }) => (
  <tr style={{ backgroundColor: "#f7fafc" }}>
    <td
      style={{
        padding: "8px 0 8px 20px",
        color: "#718096",
        fontSize: "14px",
      }}
    >
      {detail.label}
    </td>
    <td
      style={{
        padding: "8px 0",
        textAlign: "right",
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#38a169",
      }}
    >
      {formatCurrency(detail.saving)}
    </td>
  </tr>
);

/**
 * Total Cost Row Component
 */
const TotalCostRow = ({ totalCost, formatCurrency }) => (
  <tr
    style={{
      borderBottom: "2px solid #e2e8f0",
      borderTop: "2px solid #e2e8f0",
      backgroundColor: "#f7fafc",
    }}
  >
    <td
      style={{
        padding: "12px 0",
        fontWeight: "600",
        color: "#2d3748",
        fontSize: "16px",
      }}
    >
      Total Membership Cost
    </td>
    <td
      style={{
        padding: "12px 0",
        textAlign: "right",
        fontFamily: "monospace",
        fontWeight: "700",
        fontSize: "16px",
        color: "#2d3748",
      }}
    >
      {formatCurrency(totalCost)}
    </td>
  </tr>
);

/**
 * Savings Total Row Component
 */
const SavingsTotalRow = ({ totalSavings, formatCurrency }) => (
  <tr style={{ backgroundColor: "#f0fff4", padding: "15px 0" }}>
    <td
      style={{
        padding: "15px 0",
        fontWeight: "600",
        color: "#38a169",
        fontSize: "16px",
      }}
    >
      You Save
    </td>
    <td
      style={{
        padding: "15px 0",
        textAlign: "right",
        fontFamily: "monospace",
        fontWeight: "700",
        fontSize: "18px",
        color: "#38a169",
      }}
    >
      {formatCurrency(totalSavings)}
    </td>
  </tr>
);

/**
 * Comparison Row Component
 */
const ComparisonRow = ({ regularAdmissionCost, formatCurrency }) => (
  <tr
    style={{
      backgroundColor: "#f0fff4",
      borderTop: "1px dashed #c6f6d5",
    }}
  >
    <td
      style={{
        padding: "5px 0 15px 0",
        color: "#2f855a",
        fontSize: "14px",
      }}
    >
      Compared to regular admission
    </td>
    <td
      style={{
        padding: "5px 0 15px 0",
        textAlign: "right",
        color: "#2f855a",
        fontSize: "14px",
      }}
    >
      ({formatCurrency(regularAdmissionCost)})
    </td>
  </tr>
);

/**
 * Toggle Button Component
 */
const ToggleButton = ({ isOpen, setIsOpen, text }) => (
  <button
    onClick={() => setIsOpen(!isOpen)}
    style={{
      background: "none",
      border: "none",
      color: "#4299e1",
      cursor: "pointer",
      fontSize: "14px",
      padding: "5px 0",
      textAlign: "left",
      width: "100%",
      display: "flex",
      alignItems: "center",
    }}
  >
    <span style={{ marginRight: "5px" }}>{isOpen ? "▼" : "►"}</span>
    {isOpen ? "Hide" : "Show"} {text}
  </button>
);

export default SavingsBreakdown;
