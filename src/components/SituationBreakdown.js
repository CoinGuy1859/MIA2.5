// components/SituationBreakdown.js
import React from "react";
import Logos from "./Logos";
import CheckIcon from "./CheckIcon";

const SituationBreakdown = ({ primaryLocationIcon }) => {
  // Define the different situations
  const situations = [
    {
      title: "1-3 Visits Per Year",
      recommendation: "Pay Regular Admission",
      explanation:
        "For occasional visitors, paying regular admission is the most cost-effective option.",
      logo: "ticket",
    },
    {
      title: "4-6 Visits Per Year",
      recommendation: "Basic Membership + Guest Discounts",
      explanation:
        "For moderate visitors, having one adult as a member and using guest discounts for others can save money.",
      logo: "science-basic",
    },
    {
      title: "7-9 Visits Per Year",
      recommendation: "Discovery Place Membership",
      explanation:
        "For frequent visitors to one location, a membership where everyone is included provides the best value.",
      logo: primaryLocationIcon || "science",
    },
    {
      title: "10+ Visits Across Locations",
      recommendation: "Discovery Place Science + Kids Membership",
      explanation:
        "For families visiting multiple locations frequently, the Science + Kids membership provides the best value and most flexibility.",
      logo: "science-kids",
    },
  ];

  // Helper function to get the appropriate logo
  const getLogo = (logoType) => {
    switch (logoType) {
      case "ticket":
        return <Logos.Ticket width={36} height={36} color="#4299e1" />;
      case "welcome":
        return <Logos.WelcomeIcon />;
      case "science-basic":
        return <Logos.ScienceIcon />;
      case "science":
        return <Logos.ScienceIcon />;
      case "kids-huntersville":
        return <Logos.KidsIcon />;
      case "kids-rockingham":
        return <Logos.KidsIcon />;
      case "science-kids":
        return <Logos.MainIcon />;
      default:
        return <Logos.MainIcon />;
    }
  };

  return (
    <div
      className="situation-breakdown"
      role="region"
      aria-labelledby="situation-breakdown-title"
      style={{
        margin: "40px 0",
        padding: "30px",
        backgroundColor: "#f8fafc",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <h3
        id="situation-breakdown-title"
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#2d3748",
          marginTop: "0",
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        Membership Options Based on Visit Frequency
      </h3>
      <p
        style={{
          fontSize: "16px",
          color: "#4a5568",
          marginBottom: "30px",
          textAlign: "center",
          maxWidth: "700px",
          margin: "0 auto 30px",
        }}
      >
        Here's how we break down the potential situations for different visit
        patterns:
      </p>
      <div
        className="situations-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
          margin: "30px 0",
        }}
      >
        {situations.map((situation, index) => (
          <SituationBox key={index} situation={situation} getLogo={getLogo} />
        ))}
      </div>

      {/* Additional Information */}
      <div
        className="info-container"
        style={{
          marginTop: "40px",
          display: "flex",
          gap: "30px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "24px",
          border: "1px solid #e2e8f0",
        }}
      >
        <NeedHelpSection />
        <ImportantNotesSection />
      </div>
    </div>
  );
};

// Situation Box Component
const SituationBox = ({ situation, getLogo }) => (
  <div
    className="situation-box"
    style={{
      borderRadius: "10px",
      overflow: "hidden",
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div
      className="situation-header"
      style={{
        backgroundColor: "#ebf8ff",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #bee3f8",
      }}
    >
      <h4
        style={{
          margin: "0",
          color: "#2c5282",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        {situation.title}
      </h4>
      <div
        style={{
          width: "50px",
          height: "50px",
          backgroundColor: "white",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        {getLogo(situation.logo)}
      </div>
    </div>
    <div
      className="situation-content"
      style={{
        padding: "20px",
        flex: "1",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="situation-recommendation"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <CheckIcon
          size={20}
          color="#4299e1"
          style={{ marginTop: "4px", flexShrink: "0" }}
        />
        <span
          style={{
            fontSize: "17px",
            fontWeight: "600",
            color: "#3182ce",
            lineHeight: "1.4",
          }}
        >
          {situation.recommendation}
        </span>
      </div>
      <p
        style={{
          fontSize: "15px",
          color: "#4a5568",
          margin: "0",
          lineHeight: "1.5",
        }}
      >
        {situation.explanation}
      </p>
    </div>
  </div>
);

// Need Help Section Component
const NeedHelpSection = () => (
  <div
    className="info-col"
    role="complementary"
    aria-label="Need help section"
    style={{ flex: "1" }}
  >
    <h3
      style={{
        fontSize: "20px",
        fontWeight: "600",
        color: "#2d3748",
        marginTop: "0",
        marginBottom: "16px",
      }}
    >
      Need Help?
    </h3>
    <p
      style={{
        fontSize: "15px",
        color: "#4a5568",
        marginBottom: "16px",
      }}
    >
      Our membership specialists are happy to answer any questions you may have
      and help you select the best option for your family.
    </p>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <ContactItem
        type="phone"
        label="Call us:"
        value="(704) 337-2661"
        href="tel:7043372661"
      />
      <ContactItem
        type="email"
        label="Email:"
        value="members@discoveryplace.org"
        href="mailto:members@discoveryplace.org"
      />
      <ContactItem
        type="calendar"
        label="Schedule a call:"
        value="www.dpmembers.org"
        href="http://www.dpmembers.org"
      />
    </div>
  </div>
);

// Contact Item Component
const ContactItem = ({ type, label, value, href }) => {
  const getIcon = () => {
    switch (type) {
      case "phone":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4299e1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        );
      case "email":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4299e1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        );
      case "calendar":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4299e1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div
        style={{
          width: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {getIcon()}
      </div>
      <div>
        <strong style={{ fontSize: "15px", color: "#2d3748" }}>{label}</strong>{" "}
        <a
          href={href}
          target={type === "calendar" ? "_blank" : undefined}
          rel={type === "calendar" ? "noopener noreferrer" : undefined}
          style={{
            color: "#3182ce",
            textDecoration: "none",
            fontWeight: "500",
            fontSize: "15px",
          }}
        >
          {value}
        </a>
      </div>
    </div>
  );
};

// Important Notes Section Component
const ImportantNotesSection = () => (
  <div
    className="info-col"
    role="complementary"
    aria-labelledby="important-notes-title"
    style={{ flex: "1" }}
  >
    <h3
      id="important-notes-title"
      style={{
        fontSize: "20px",
        fontWeight: "600",
        color: "#2d3748",
        marginTop: "0",
        marginBottom: "16px",
      }}
    >
      Important Notes
    </h3>
    <ul
      className="important-notes-list"
      style={{
        paddingLeft: "10px",
        margin: "0",
        listStyle: "none",
      }}
    >
      <ImportantNoteItem text="Children under 1: Free at all locations" />
      <ImportantNoteItem text="Children 1-2: Free at Science, need spot at Kids locations" />
      <ImportantNoteItem text="Science + Kids membership includes all Discovery Place locations" />
      <ImportantNoteItem text="DPS members and Welcome Program participants get $8 flat-rate parking; others pay hourly rates" />
      <ImportantNoteItem text="Reciprocal benefits allow you to visit other science centers nationwide as part of ASTC Travel Passport Program" />
      <ImportantNoteItem text="All memberships are valid for a full year from date of purchase" />
    </ul>
  </div>
);

// Important Note Item Component
const ImportantNoteItem = ({ text }) => (
  <li
    style={{
      marginBottom: "12px",
      position: "relative",
      paddingLeft: "30px",
      fontSize: "15px",
      color: "#4a5568",
      lineHeight: "1.5",
    }}
  >
    <span
      style={{
        position: "absolute",
        left: "0",
        top: "2px",
        width: "22px",
        height: "22px",
        borderRadius: "50%",
        backgroundColor: "#ebf8ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4299e1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </span>
    {text}
  </li>
);

export default SituationBreakdown;
