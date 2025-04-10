import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Logos from "../components/Logos"; // Adjusted import path to match your structure

const PrintMembershipInfo = ({ recommendation, formatCurrency }) => {
  const printRef = useRef();

  // Configure the print handler
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Discovery Place Membership Recommendation",
  });

  if (!recommendation) return null;

  return (
    <div>
      {/* Button to trigger printing - styled to match the design system */}
      <button
        onClick={handlePrint}
        className="save-button"
        aria-label="Print membership recommendation"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f7fafc",
          color: "#4a5568",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "12px",
          width: "100%",
          fontSize: "16px",
          fontWeight: "500",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
      >
        <PrinterIcon className="h-5 w-5 text-gray-500 mr-2" />
        Print Recommendation
      </button>

      {/* Hidden content that will be printed - using stronger hiding techniques */}
      <div
        style={{
          display: "none",
          position: "absolute",
          visibility: "hidden",
          overflow: "hidden",
          height: "0",
          width: "0",
        }}
      >
        <div ref={printRef} className="p-8 max-w-4xl mx-auto">
          <PrintableContent
            recommendation={recommendation}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>
    </div>
  );
};

// Content shown when printing
const PrintableContent = ({ recommendation, formatCurrency }) => {
  // Destructure commonly used values
  const {
    bestMembershipLabel,
    bestMembershipType,
    bestMembershipPromoCost,
    bestMembershipExplanation,
    bestMembershipSavings,
    savingsPercentage,
    regularAdmissionCost,
    totalVisits,
    purchaseLink,
    iconType,
  } = recommendation;

  return (
    <div className="print-content" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Header with logo */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          paddingBottom: "24px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div>
          {/* Using the actual Logos component */}
          <MembershipLogo type={bestMembershipType} iconType={iconType} />
        </div>
        <div style={{ textAlign: "right" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#2d3748",
              margin: "0 0 8px 0",
            }}
          >
            Membership Recommendation
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#718096",
              margin: "0",
            }}
          >
            Generated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Main recommendation info */}
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#2d3748",
            margin: "0 0 12px 0",
          }}
        >
          {bestMembershipLabel}
        </h2>
        <p
          style={{
            color: "#4a5568",
            fontSize: "16px",
            lineHeight: "1.6",
            margin: "0 0 24px 0",
          }}
        >
          {bestMembershipExplanation}
        </p>

        <div
          style={{
            backgroundColor: "#ebf8ff",
            borderLeft: "4px solid #4299e1",
            padding: "20px",
            marginBottom: "24px",
            borderRadius: "4px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                fontWeight: "500",
                color: "#2c5282",
              }}
            >
              Annual Price:
            </span>
            <span
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#2d3748",
              }}
            >
              {formatCurrency(bestMembershipPromoCost)}
            </span>
          </div>
        </div>
      </div>

      {/* Savings comparison */}
      <div style={{ marginBottom: "32px" }}>
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#2d3748",
            margin: "0 0 16px 0",
            paddingBottom: "8px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          Value Comparison
        </h3>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "16px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: "12px 16px",
                  backgroundColor: "#f7fafc",
                  textAlign: "left",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#4a5568",
                  textTransform: "uppercase",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Option
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  backgroundColor: "#f7fafc",
                  textAlign: "left",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#4a5568",
                  textTransform: "uppercase",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Cost
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  backgroundColor: "#f7fafc",
                  textAlign: "left",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#4a5568",
                  textTransform: "uppercase",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Savings
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  padding: "16px",
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#2d3748",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Membership
              </td>
              <td
                style={{
                  padding: "16px",
                  fontSize: "16px",
                  color: "#4a5568",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {formatCurrency(bestMembershipPromoCost)}
              </td>
              <td
                style={{
                  padding: "16px",
                  fontSize: "16px",
                  color: "#38a169",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                —
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "16px",
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#2d3748",
                }}
              >
                Regular Admission ({totalVisits} visits)
              </td>
              <td
                style={{
                  padding: "16px",
                  fontSize: "16px",
                  color: "#4a5568",
                }}
              >
                {formatCurrency(regularAdmissionCost)}
              </td>
              <td
                style={{
                  padding: "16px",
                  fontSize: "16px",
                  color: "#38a169",
                  fontWeight: "500",
                }}
              >
                {formatCurrency(bestMembershipSavings)} ({savingsPercentage}%)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Membership benefits */}
      <div style={{ marginBottom: "32px" }}>
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#2d3748",
            margin: "0 0 16px 0",
            paddingBottom: "8px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          Membership Benefits
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          {getMembershipBenefits(bestMembershipType).map((benefit, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "12px",
              }}
            >
              <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span
                style={{
                  fontSize: "15px",
                  color: "#4a5568",
                  lineHeight: "1.4",
                }}
              >
                {benefit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* How to purchase */}
      <div style={{ marginBottom: "32px" }}>
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#2d3748",
            margin: "0 0 16px 0",
            paddingBottom: "8px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          How to Purchase
        </h3>

        <div
          style={{
            backgroundColor: "#f8fafc",
            padding: "24px",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: "17px",
                  fontWeight: "500",
                  color: "#2d3748",
                  margin: "0 0 8px 0",
                }}
              >
                Online
              </h4>
              <p
                style={{
                  fontSize: "15px",
                  color: "#4a5568",
                  margin: "0 0 4px 0",
                }}
              >
                Visit our website:
              </p>
              <a
                href={purchaseLink}
                style={{
                  fontSize: "15px",
                  color: "#4299e1",
                  wordBreak: "break-all",
                }}
              >
                {purchaseLink || "https://discoveryplace.org/memberships"}
              </a>
            </div>

            <div>
              <h4
                style={{
                  fontSize: "17px",
                  fontWeight: "500",
                  color: "#2d3748",
                  margin: "0 0 8px 0",
                }}
              >
                By Phone
              </h4>
              <p
                style={{
                  fontSize: "15px",
                  color: "#4a5568",
                  margin: "0 0 4px 0",
                }}
              >
                Call our membership team:
              </p>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: "500",
                  color: "#2d3748",
                  margin: "0 0 4px 0",
                }}
              >
                (704) 337-2661
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "#718096",
                  margin: "8px 0 0 0",
                }}
              >
                Monday-Friday, 9am-5pm
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with contact info */}
      <div
        style={{
          marginTop: "48px",
          paddingTop: "16px",
          borderTop: "1px solid #e2e8f0",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "#718096",
            margin: "0 0 8px 0",
          }}
        >
          Questions? Email{" "}
          <a
            href="mailto:members@discoveryplace.org"
            style={{ color: "#4299e1" }}
          >
            members@discoveryplace.org
          </a>{" "}
          or call{" "}
          <a href="tel:7043372661" style={{ color: "#4299e1" }}>
            (704) 337-2661
          </a>
        </p>
        <p
          style={{
            fontSize: "12px",
            color: "#a0aec0",
            margin: "8px 0 0 0",
          }}
        >
          Prices and details valid as of {new Date().toLocaleDateString()}.
          Subject to change without notice.
        </p>
      </div>
    </div>
  );
};

// Logo component that uses the actual Logos component
const MembershipLogo = ({ type, iconType }) => {
  // Use iconType if available, otherwise determine from membership type
  const logoType = iconType || getMembershipLogoType(type);

  // Choose appropriate logo based on type
  switch (logoType) {
    case "science":
    case "Science":
      return <Logos.ScienceHeader />;
    case "DPKH":
    case "kids-huntersville":
      return <Logos.KidsHuntersvilleHeader />;
    case "DPKR":
    case "kids-rockingham":
      return <Logos.KidsRockinghamHeader />;
    case "ScienceKids":
    case "science-kids":
      return <Logos.MainHeader />;
    case "Welcome":
    case "welcome":
      return <Logos.WelcomeIcon />;
    default:
      return <Logos.MainHeader />;
  }
};

// Helper function to determine logo type from membership type
function getMembershipLogoType(type) {
  switch (type) {
    case "Science":
      return "science";
    case "DPKH":
      return "kids-huntersville";
    case "DPKR":
      return "kids-rockingham";
    case "ScienceKids":
      return "science-kids";
    case "Welcome":
      return "welcome";
    default:
      return "main";
  }
}

// Icon components
const PrinterIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginRight: "8px" }}
  >
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="#38a169"
    style={{ minWidth: "18px", marginRight: "8px", marginTop: "4px" }}
  >
    <path
      fillRule="evenodd"
      d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zm-2 0a8 8 0 11-16 0 8 8 0 0116 0zm-10.6 2.4l5.6-5.6 1.4 1.4-7 7-3.4-3.4 1.4-1.4 2 2z"
      clipRule="evenodd"
    />
  </svg>
);

// Helper function to get membership benefits based on type
function getMembershipBenefits(type) {
  // Core benefits that all memberships include
  const coreBenefits = [
    "Unlimited free admission for all named members",
    "Discounted parking at Discovery Place Science ($8 flat rate)",
    "10% discount at museum stores and cafes",
    "Member-only events and exhibit previews",
  ];

  // Type-specific benefits
  let typeSpecificBenefits = [];

  switch (type) {
    case "Science":
      typeSpecificBenefits = [
        "50% off guest admission at Discovery Place Science",
        "25% off admission at other Discovery Place locations",
        "Reciprocal admission at over 300 science centers worldwide through ASTC Travel Passport Program (90-mile radius exclusions apply)",
      ];
      break;
    case "DPKH":
      typeSpecificBenefits = [
        "50% off guest admission at Discovery Place Kids-Huntersville",
        "25% off admission at other Discovery Place locations",
        "Special member events and previews at Discovery Place Kids-Huntersville",
      ];
      break;
    case "DPKR":
      typeSpecificBenefits = [
        "50% off guest admission at Discovery Place Kids-Rockingham",
        "25% off admission at other Discovery Place locations",
        "Special member events and previews at Discovery Place Kids-Rockingham",
      ];
      break;
    case "ScienceKids":
      typeSpecificBenefits = [
        "Unlimited access to ALL Discovery Place locations",
        "50% off guest admission at all locations",
        "ASTC reciprocal benefits and special access to all Discovery Place locations",
        "Priority registration for camps and programs",
      ];
      break;
    case "Welcome":
      typeSpecificBenefits = [
        "$3 per person admission at other Discovery Place locations",
        "Reduced-price membership ($75/year for 2 adults and up to 6 children)",
        "50% off fee-based educational programs",
      ];
      break;
    default:
      typeSpecificBenefits = ["Varies based on membership type"];
  }

  return [...coreBenefits, ...typeSpecificBenefits];
}

export default PrintMembershipInfo;
