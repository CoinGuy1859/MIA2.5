import React from "react";
// Import the logo image
import headerLogo from "./assets/DP_Header.png";

const CenteredHeader = () => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "20px",
        paddingTop: "20px",
      }}
    >
      {/* Logo with forced centering */}
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <img
          src={headerLogo}
          alt="Discovery Place"
          style={{ maxWidth: "250px", margin: "0 auto", display: "block" }}
        />
      </div>

      {/* Tagline with forced centering */}
      <p
        style={{
          textAlign: "center",
          width: "100%",
          margin: "0 auto",
          fontSize: "16px",
          color: "#4b5563",
        }}
      >
        Find the best membership option for your family
      </p>
    </div>
  );
};

export default CenteredHeader;
