// components/DetailedAdmissionComparison.js
import React, { useState } from "react";
import CheckIcon from "./CheckIcon";

/**
 * DetailedAdmissionComparison component - Shows detailed comparison between admission and membership
 * Refactored to remove duplication, improve readability, and enhance maintainability
 */
const DetailedAdmissionComparison = ({
  recommendation,
  scienceVisits,
  dpkhVisits,
  dpkrVisits,
  adultCount,
  childAges,
  isRichmondResident,
  includeParking,
  formatCurrency,
}) => {
  const [showAdmissionDetails, setShowAdmissionDetails] = useState(false);

  // Extract values from recommendation
  const totalCost = recommendation.bestMembershipPromoCost || 0;
  const regularAdmissionCost = recommendation.regularAdmissionCost || 0;

  // Calculate savings
  const totalSavings = Math.max(0, regularAdmissionCost - totalCost);

  // Safeguard against impossible savings percentages
  const savingsPercentage =
    regularAdmissionCost > 0
      ? Math.min(90, Math.round((totalSavings / regularAdmissionCost) * 100))
      : 0;

  // Get the admission breakdown
  const admissionBreakdown = getAdmissionBreakdown({
    scienceVisits,
    dpkhVisits,
    dpkrVisits,
    adultCount,
    childAges,
    isRichmondResident,
    includeParking,
  });

  if (!admissionBreakdown) return null;

  return (
    <div
      className="admission-comparison-section"
      style={{
        marginTop: "30px",
        padding: "20px 15px",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
      }}
    >
      <SectionHeader />

      <ComparisonCards
        regularAdmissionCost={regularAdmissionCost}
        totalCost={totalCost}
        totalSavings={totalSavings}
        savingsPercentage={savingsPercentage}
        totalVisits={scienceVisits + dpkhVisits + dpkrVisits}
        formatCurrency={formatCurrency}
      />

      <ToggleButton
        showDetails={showAdmissionDetails}
        setShowDetails={setShowAdmissionDetails}
      />

      {showAdmissionDetails && (
        <DetailedBreakdown
          admissionBreakdown={admissionBreakdown}
          totalCost={totalCost}
          totalSavings={totalSavings}
          savingsPercentage={savingsPercentage}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
};

/**
 * Section Header Component
 */
const SectionHeader = () => (
  <h4
    style={{
      margin: "0 0 15px 0",
      padding: "0 0 10px 0",
      borderBottom: "1px solid #e2e8f0",
      fontSize: "18px",
      fontWeight: "600",
      color: "#2d3748",
    }}
  >
    Detailed Admission vs. Membership Comparison
  </h4>
);

/**
 * Comparison Cards Component
 */
const ComparisonCards = ({
  regularAdmissionCost,
  totalCost,
  totalSavings,
  savingsPercentage,
  totalVisits,
  formatCurrency,
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "20px",
      paddingBottom: "10px",
      borderBottom: "1px solid #e2e8f0",
    }}
  >
    <PayPerVisitCard
      regularAdmissionCost={regularAdmissionCost}
      totalVisits={totalVisits}
      formatCurrency={formatCurrency}
    />

    <MembershipCard
      totalCost={totalCost}
      totalSavings={totalSavings}
      savingsPercentage={savingsPercentage}
      formatCurrency={formatCurrency}
    />
  </div>
);

/**
 * Pay Per Visit Card Component
 */
const PayPerVisitCard = ({
  regularAdmissionCost,
  totalVisits,
  formatCurrency,
}) => (
  <div
    style={{
      flex: 1,
      padding: "10px",
      backgroundColor: "#f7fafc",
      borderRadius: "6px",
      marginRight: "10px",
    }}
  >
    <h5
      style={{
        margin: "0 0 10px 0",
        fontSize: "16px",
        fontWeight: "600",
        color: "#2d3748",
        textAlign: "center",
      }}
    >
      Pay Per Visit
    </h5>
    <div
      style={{
        fontSize: "24px",
        fontWeight: "700",
        color: "#e53e3e",
        textAlign: "center",
        marginBottom: "5px",
      }}
    >
      {formatCurrency(regularAdmissionCost)}
    </div>
    <div
      style={{
        fontSize: "14px",
        color: "#718096",
        textAlign: "center",
      }}
    >
      Total for {totalVisits} visits
    </div>
  </div>
);

/**
 * Membership Card Component
 */
const MembershipCard = ({
  totalCost,
  totalSavings,
  savingsPercentage,
  formatCurrency,
}) => (
  <div
    style={{
      flex: 1,
      padding: "10px",
      backgroundColor: "#f0fff4",
      borderRadius: "6px",
      marginLeft: "10px",
    }}
  >
    <h5
      style={{
        margin: "0 0 10px 0",
        fontSize: "16px",
        fontWeight: "600",
        color: "#2d3748",
        textAlign: "center",
      }}
    >
      With Membership
    </h5>
    <div
      style={{
        fontSize: "24px",
        fontWeight: "700",
        color: "#38a169",
        textAlign: "center",
        marginBottom: "5px",
      }}
    >
      {formatCurrency(totalCost)}
    </div>
    <div
      style={{
        fontSize: "14px",
        color: "#2f855a",
        textAlign: "center",
        fontWeight: "500",
      }}
    >
      Save {formatCurrency(totalSavings)} ({savingsPercentage}%)
    </div>
  </div>
);

/**
 * Toggle Button Component
 */
const ToggleButton = ({ showDetails, setShowDetails }) => (
  <button
    onClick={() => setShowDetails(!showDetails)}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      background: "none",
      border: "none",
      color: "#4299e1",
      cursor: "pointer",
      fontSize: "15px",
      padding: "10px 0",
      textAlign: "left",
      width: "100%",
      fontWeight: "500",
    }}
  >
    <span style={{ marginRight: "5px" }}>{showDetails ? "▼" : "►"}</span>
    {showDetails ? "Hide" : "Show"} detailed admission breakdown
  </button>
);

/**
 * Detailed Breakdown Component
 */
const DetailedBreakdown = ({
  admissionBreakdown,
  totalCost,
  totalSavings,
  savingsPercentage,
  formatCurrency,
}) => (
  <div
    className="detailed-admission-breakdown"
    style={{
      marginTop: "15px",
      padding: "15px",
      backgroundColor: "#fff",
      borderRadius: "6px",
      border: "1px solid #e2e8f0",
    }}
  >
    {admissionBreakdown.breakdown.map((location, locationIndex) => (
      <LocationBreakdown
        key={`location-${locationIndex}`}
        location={location}
        isLastLocation={
          locationIndex === admissionBreakdown.breakdown.length - 1
        }
        formatCurrency={formatCurrency}
      />
    ))}

    <AdmissionTotal
      grandTotal={admissionBreakdown.grandTotal}
      formatCurrency={formatCurrency}
    />

    <MembershipComparison
      totalCost={totalCost}
      formatCurrency={formatCurrency}
    />

    <SavingsCallout
      totalSavings={totalSavings}
      savingsPercentage={savingsPercentage}
      formatCurrency={formatCurrency}
    />
  </div>
);

/**
 * Location Breakdown Component
 */
const LocationBreakdown = ({ location, isLastLocation, formatCurrency }) => (
  <div
    key={location.location}
    style={{
      marginBottom: isLastLocation ? "0" : "20px",
      paddingBottom: isLastLocation ? "0" : "15px",
      borderBottom: isLastLocation ? "none" : "1px dashed #e2e8f0",
    }}
  >
    <h5
      style={{
        margin: "0 0 10px 0",
        fontSize: "16px",
        fontWeight: "600",
        color: "#2d3748",
      }}
    >
      {location.location} ({location.visits} visits)
    </h5>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "10px",
      }}
    >
      <tbody>
        {location.details.map((detail, detailIndex) => (
          <tr
            key={detail.description}
            style={{
              borderBottom:
                detailIndex < location.details.length - 1
                  ? "1px solid #f7fafc"
                  : "none",
            }}
          >
            <td
              style={{
                padding: "8px 0",
                fontSize: "14px",
                color: "#4a5568",
              }}
            >
              {detail.description}
            </td>
            <td
              style={{
                padding: "8px 0",
                textAlign: "right",
                fontFamily: "monospace",
                fontSize: "14px",
                fontWeight: "500",
                color: "#4a5568",
              }}
            >
              {formatCurrency(detail.cost)}
            </td>
          </tr>
        ))}
        <tr
          style={{
            backgroundColor: "#f7fafc",
          }}
        >
          <td
            style={{
              padding: "10px 0",
              fontSize: "15px",
              fontWeight: "600",
              color: "#2d3748",
            }}
          >
            Subtotal for {location.location}
          </td>
          <td
            style={{
              padding: "10px 0",
              textAlign: "right",
              fontFamily: "monospace",
              fontSize: "15px",
              fontWeight: "600",
              color: "#2d3748",
            }}
          >
            {formatCurrency(location.subtotal)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

/**
 * Admission Total Component
 */
const AdmissionTotal = ({ grandTotal, formatCurrency }) => (
  <div
    className="admission-total"
    style={{
      marginTop: "15px",
      paddingTop: "15px",
      borderTop: "2px solid #e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <div
      style={{
        fontSize: "16px",
        fontWeight: "700",
        color: "#2d3748",
      }}
    >
      Total Admission Cost
    </div>
    <div
      style={{
        fontFamily: "monospace",
        fontSize: "18px",
        fontWeight: "700",
        color: "#e53e3e",
      }}
    >
      {formatCurrency(grandTotal)}
    </div>
  </div>
);

/**
 * Membership Comparison Component
 */
const MembershipComparison = ({ totalCost, formatCurrency }) => (
  <div
    className="membership-comparison"
    style={{
      marginTop: "15px",
      paddingTop: "15px",
      borderTop: "1px dashed #e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#f0fff4",
      padding: "15px",
      borderRadius: "6px",
    }}
  >
    <div
      style={{
        fontSize: "16px",
        fontWeight: "700",
        color: "#2f855a",
      }}
    >
      With Membership
    </div>
    <div
      style={{
        fontFamily: "monospace",
        fontSize: "18px",
        fontWeight: "700",
        color: "#38a169",
      }}
    >
      {formatCurrency(totalCost)}
    </div>
  </div>
);

/**
 * Savings Callout Component
 */
const SavingsCallout = ({
  totalSavings,
  savingsPercentage,
  formatCurrency,
}) => (
  <div
    className="savings-callout"
    style={{
      marginTop: "15px",
      textAlign: "center",
      backgroundColor: "#ebf8ff",
      padding: "15px",
      borderRadius: "6px",
      border: "1px solid #bee3f8",
    }}
  >
    <div
      style={{
        fontSize: "16px",
        fontWeight: "600",
        color: "#2b6cb0",
        marginBottom: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CheckIcon color="#2b6cb0" size={20} style={{ marginRight: "6px" }} />
      Your Total Savings with Membership
    </div>
    <div
      style={{
        fontSize: "24px",
        fontWeight: "700",
        color: "#2c5282",
      }}
    >
      {formatCurrency(totalSavings)}
    </div>
    <div
      style={{
        fontSize: "16px",
        color: "#4299e1",
        marginTop: "5px",
      }}
    >
      That's {savingsPercentage}% off regular admission prices!
    </div>
  </div>
);

/**
 * Helper function to generate detailed admission breakdown
 */
const getAdmissionBreakdown = ({
  scienceVisits,
  dpkhVisits,
  dpkrVisits,
  adultCount,
  childAges,
  isRichmondResident,
  includeParking,
}) => {
  // Make sure we have the needed props
  if (
    typeof scienceVisits === "undefined" ||
    typeof dpkhVisits === "undefined" ||
    typeof dpkrVisits === "undefined" ||
    typeof adultCount === "undefined" ||
    !Array.isArray(childAges)
  ) {
    return null;
  }

  // Count eligible children by age
  const eligibleChildrenForScience = childAges.filter((age) => age >= 2).length;
  const eligibleChildrenForDPKH = childAges.filter((age) => age >= 1).length;
  const eligibleChildrenForDPKR = childAges.filter((age) => age >= 1).length;

  // Define admission prices
  const admissionPrices = {
    Science: { adult: 24, child: 18 },
    DPKH: { adult: 15, child: 12 },
    DPKR: {
      adult: isRichmondResident ? 6 : 8,
      child: isRichmondResident ? 6 : 8,
    },
  };

  // Calculate parking costs per visit
  const parkingCostPerVisit = includeParking ? 18 : 0; // $18 for regular visitors

  // Initialize arrays for breakdown
  const breakdown = [];

  // Add Science visits
  if (scienceVisits > 0) {
    const adultTotal =
      scienceVisits * adultCount * admissionPrices.Science.adult;
    const childTotal =
      scienceVisits *
      eligibleChildrenForScience *
      admissionPrices.Science.child;
    const parkingTotal = scienceVisits * parkingCostPerVisit;

    breakdown.push({
      location: "Discovery Place Science",
      visits: scienceVisits,
      details: [
        {
          description: `Adult admission (${adultCount} adults × ${scienceVisits} visits)`,
          cost: adultTotal,
        },
        {
          description: `Child admission (${eligibleChildrenForScience} children × ${scienceVisits} visits)`,
          cost: childTotal,
        },
        ...(includeParking
          ? [
              {
                description: `Parking (${scienceVisits} visits)`,
                cost: parkingTotal,
              },
            ]
          : []),
      ],
      subtotal: adultTotal + childTotal + parkingTotal,
    });
  }

  // Add DPKH visits
  if (dpkhVisits > 0) {
    const adultTotal = dpkhVisits * adultCount * admissionPrices.DPKH.adult;
    const childTotal =
      dpkhVisits * eligibleChildrenForDPKH * admissionPrices.DPKH.child;

    breakdown.push({
      location: "Discovery Place Kids-Huntersville",
      visits: dpkhVisits,
      details: [
        {
          description: `Adult admission (${adultCount} adults × ${dpkhVisits} visits)`,
          cost: adultTotal,
        },
        {
          description: `Child admission (${eligibleChildrenForDPKH} children × ${dpkhVisits} visits)`,
          cost: childTotal,
        },
      ],
      subtotal: adultTotal + childTotal,
    });
  }

  // Add DPKR visits
  if (dpkrVisits > 0) {
    const adultTotal = dpkrVisits * adultCount * admissionPrices.DPKR.adult;
    const childTotal =
      dpkrVisits * eligibleChildrenForDPKR * admissionPrices.DPKR.child;

    breakdown.push({
      location: "Discovery Place Kids-Rockingham",
      visits: dpkrVisits,
      details: [
        {
          description: `Adult admission (${adultCount} adults × ${dpkrVisits} visits)`,
          cost: adultTotal,
        },
        {
          description: `Child admission (${eligibleChildrenForDPKR} children × ${dpkrVisits} visits)`,
          cost: childTotal,
        },
      ],
      subtotal: adultTotal + childTotal,
    });
  }

  // Calculate grand total
  const grandTotal = breakdown.reduce(
    (sum, location) => sum + location.subtotal,
    0
  );

  return {
    breakdown,
    grandTotal,
  };
};

export default DetailedAdmissionComparison;
