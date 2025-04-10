// src/components/Logos.js
import React from "react";

// Import all logo assets
import dpHeader from "../assets/DP_Header.png";
import dpMarkFullColor from "../assets/DP_Icon.png";
import dpWelcomeIcon from "../assets/DP_Welcome_Icon.png";
import dpkIcon from "../assets/DPK_Icon.png";
import dpkhHeader from "../assets/DPKH_Header.png";
import dpkrHeader from "../assets/DPKR_Header.png";
import dpsHeader from "../assets/DPS_Header.png";
import dpsIcon from "../assets/DPS_Icon.png";

// Individual logo components with consistent styling and size constraints

const ScienceIcon = ({ className = "" }) => (
  <img
    src={dpsIcon}
    alt="Discovery Place Science Icon"
    className={`logo-icon ${className}`}
    style={{ maxWidth: "40px", maxHeight: "40px" }}
    width="40"
    height="40"
  />
);

const ScienceHeader = ({ className = "" }) => (
  <img
    src={dpsHeader}
    alt="Discovery Place Science Logo"
    className={`logo-header science-header ${className}`}
    style={{ maxWidth: "200px", height: "auto" }}
    width="200"
    height="auto"
  />
);

const KidsIcon = ({ className = "" }) => (
  <img
    src={dpkIcon}
    alt="Discovery Place Kids Icon"
    className={`logo-icon ${className}`}
    style={{ maxWidth: "40px", maxHeight: "40px" }}
    width="40"
    height="40"
  />
);

const KidsHuntersvilleHeader = ({ className = "" }) => (
  <img
    src={dpkhHeader}
    alt="Discovery Place Kids-Huntersville Logo"
    className={`logo-header kids-header ${className}`}
    style={{ maxWidth: "200px", height: "auto" }}
    width="200"
    height="auto"
  />
);

const KidsRockinghamHeader = ({ className = "" }) => (
  <img
    src={dpkrHeader}
    alt="Discovery Place Kids-Rockingham Logo"
    className={`logo-header kids-header ${className}`}
    style={{ maxWidth: "200px", height: "auto" }}
    width="200"
    height="auto"
  />
);

const MainIcon = ({ className = "" }) => (
  <img
    src={dpMarkFullColor}
    alt="Discovery Place Icon"
    className={`logo-icon ${className}`}
    style={{ maxWidth: "40px", maxHeight: "40px" }}
    width="40"
    height="40"
  />
);

const MainHeader = ({ className = "" }) => (
  <img
    src={dpHeader}
    alt="Discovery Place"
    className={`logo-header main-header ${className}`}
    style={{ maxWidth: "200px", height: "auto" }}
    width="200"
    height="auto"
  />
);

const WelcomeIcon = ({ className = "" }) => (
  <img
    src={dpWelcomeIcon}
    alt="Discovery Place Welcome Program"
    className={`logo-icon ${className}`}
    style={{ maxWidth: "40px", maxHeight: "40px" }}
    width="40"
    height="40"
  />
);

// SVG-based ticket icon with size constraints
const Ticket = ({ className = "", color = "#4299e1" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`ticket-icon ${className}`}
    aria-hidden="true"
    style={{ maxWidth: "24px", maxHeight: "24px" }}
  >
    {/* Ticket body */}
    <path d="M4 16v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
    <path d="M4 8v-4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
    <line x1="12" y1="2" x2="12" y2="22" strokeDasharray="3 3" />
    <circle cx="4" cy="12" r="0.5" fill={color} />
    <circle cx="4" cy="12" r="1" stroke={color} strokeWidth="1" fill="none" />
    <circle cx="20" cy="12" r="0.5" fill={color} />
    <circle cx="20" cy="12" r="1" stroke={color} strokeWidth="1" fill="none" />
  </svg>
);

// Export all logo components
const Logos = {
  ScienceIcon,
  ScienceHeader,
  KidsIcon,
  KidsHuntersvilleHeader,
  KidsRockinghamHeader,
  MainIcon,
  MainHeader,
  WelcomeIcon,
  Ticket,
};

export default Logos;
