// components/WelcomeNotification.js
import React from "react";
import Logos from "../components/Logos";

const WelcomeNotification = ({ welcomeOption, formatCurrency }) => {
  if (!welcomeOption) {
    return null;
  }

  return (
    <div
      className="welcome-notification"
      role="complementary"
      aria-label="Welcome Program information"
    >
      <div className="welcome-notification-header">
        <Logos.WelcomeIcon />
        <h3>Welcome Program Alternative Available</h3>
      </div>

      <p>
        As an EBT/WIC recipient, you qualify for our Welcome Program, which may
        provide an affordable alternative:
      </p>

      <div className="welcome-option-details">
        <h4>{welcomeOption.bestMembershipLabel}</h4>
        <div className="welcome-pricing">
          <div className="welcome-price">
            <strong>{formatCurrency(welcomeOption.totalPrice)}</strong> per year
          </div>
          {welcomeOption.regularAdmissionCost > 0 && (
            <div className="welcome-savings">
              Save {formatCurrency(welcomeOption.bestMembershipSavings)}(
              {welcomeOption.savingsPercentage}% off regular admission)
            </div>
          )}
        </div>

        <p>{welcomeOption.explanation}</p>

        <div className="welcome-breakdown">
          <h5>Includes:</h5>
          <ul>
            <li>
              <strong>Membership:</strong>{" "}
              {formatCurrency(welcomeOption.basePrice)} for up to 8 people (2
              adults, 6 children)
            </li>
            {welcomeOption.parkingCost > 0 && (
              <li>
                <strong>Parking at Science:</strong>{" "}
                {formatCurrency(welcomeOption.parkingCost)}(
                {
                  welcomeOption.costBreakdown.items.find((item) =>
                    item.label.includes("Parking")
                  )?.details
                }
                )
              </li>
            )}
            {welcomeOption.crossLocationCost > 0 && (
              <li>
                <strong>Cross-location visits:</strong>{" "}
                {formatCurrency(welcomeOption.crossLocationCost)}
                ($3 per person at other locations)
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="welcome-notification-buttons">
        <a
          href={welcomeOption.infoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="welcome-learn-more"
        >
          Learn More
        </a>
        <a
          href={welcomeOption.purchaseLink}
          target="_blank"
          rel="noopener noreferrer"
          className="welcome-purchase"
          style={{
            backgroundColor: "#38a169",
            color: "white",
            textDecoration: "none",
            padding: "8px 15px",
            borderRadius: "4px",
            marginLeft: "10px",
            fontWeight: "500",
          }}
        >
          Purchase Welcome Membership
        </a>
      </div>
    </div>
  );
};

export default WelcomeNotification;
