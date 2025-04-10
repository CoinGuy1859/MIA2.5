// components/VisitFrequencyForm.js
import React from "react";
import { PricingConfig } from "../pricing/pricing-module";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Logos from "../components/Logos";

/**
 * VisitFrequencyForm component
 * Collects information about visit frequency to different locations
 * Optimized for better readability and maintainability
 */
const VisitFrequencyForm = ({
  scienceVisits,
  dpkhVisits,
  dpkrVisits,
  includeParking,
  visitDistributionData = [], // Add default empty array to prevent undefined errors
  onScienceVisitsChange,
  onDpkhVisitsChange,
  onDpkrVisitsChange,
  onIncludeParkingChange,
  onNextStep,
  onPrevStep,
}) => {
  const MAX_VISITS_PER_LOCATION =
    PricingConfig.Constraints.MAX_VISITS_PER_LOCATION;
  const totalVisits = calculateTotalVisits(
    scienceVisits,
    dpkhVisits,
    dpkrVisits,
    MAX_VISITS_PER_LOCATION
  );

  // Creates tick marks for sliders
  const createTickMarks = (maxVisits) => {
    const ticks = [];
    // Create 5 evenly spaced tick marks
    const interval = maxVisits / 4;
    for (let i = 0; i <= 4; i++) {
      ticks.push(Math.round(i * interval));
    }
    return ticks;
  };

  return (
    <section
      className="step-container"
      role="form"
      aria-labelledby="visits-step-heading"
      style={{
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        border: "1px solid #e2e8f0",
      }}
    >
      <FormHeader />

      <div style={{ marginBottom: "30px" }}>
        <VisitSlider
          id="scienceVisits"
          label="Discovery Place Science Visits"
          value={scienceVisits}
          max={MAX_VISITS_PER_LOCATION}
          onChange={onScienceVisitsChange}
          description="Our science museum in Uptown Charlotte with exhibits for all ages"
          tickMarks={createTickMarks(MAX_VISITS_PER_LOCATION)}
        />

        <VisitSlider
          id="dpkhVisits"
          label="Discovery Place Kids-Huntersville Visits"
          value={dpkhVisits}
          max={MAX_VISITS_PER_LOCATION}
          onChange={onDpkhVisitsChange}
          description="Our children's museum in Huntersville designed for children ages 10 and under"
          tickMarks={createTickMarks(MAX_VISITS_PER_LOCATION)}
        />

        <VisitSlider
          id="dpkrVisits"
          label="Discovery Place Kids-Rockingham Visits"
          value={dpkrVisits}
          max={MAX_VISITS_PER_LOCATION}
          onChange={onDpkrVisitsChange}
          description="Our children's museum in Rockingham designed for children ages 10 and under"
          tickMarks={createTickMarks(MAX_VISITS_PER_LOCATION)}
        />
      </div>

      <ParkingOption
        includeParking={includeParking}
        onIncludeParkingChange={onIncludeParkingChange}
      />

      {visitDistributionData.length > 0 && (
        <VisitDistributionChart
          visitDistributionData={visitDistributionData}
          totalVisits={totalVisits}
        />
      )}

      <div
        className="total-visits"
        style={{
          backgroundColor: "#ebf8ff",
          borderRadius: "8px",
          padding: "16px",
          textAlign: "center",
          marginTop: "30px",
          marginBottom: "30px",
          fontWeight: "600",
          fontSize: "18px",
          color: "#2c5282",
          border: "1px solid #bee3f8",
        }}
      >
        <span>Total annual visits: {totalVisits}</span>
      </div>

      <NavigationButtons onPrevStep={onPrevStep} onNextStep={onNextStep} />
    </section>
  );
};

/**
 * Calculate the total number of visits across all locations
 */
const calculateTotalVisits = (
  scienceVisits,
  dpkhVisits,
  dpkrVisits,
  maxVisitsPerLocation
) => {
  return Math.min(
    PricingConfig.Constraints.MAX_TOTAL_VISITS,
    Math.min(scienceVisits, maxVisitsPerLocation) +
      Math.min(dpkhVisits, maxVisitsPerLocation) +
      Math.min(dpkrVisits, maxVisitsPerLocation)
  );
};

/**
 * Form Header Component
 */
const FormHeader = () => (
  <div style={{ marginBottom: "30px", textAlign: "center" }}>
    <div className="header-logo" style={{ marginBottom: "20px" }}>
      <Logos.MainHeader />
    </div>

    <h2
      id="visits-step-heading"
      tabIndex="-1"
      style={{
        fontSize: "24px",
        fontWeight: "600",
        color: "#1a202c",
        margin: "0 0 10px 0",
      }}
    >
      How Often Will You Visit?
    </h2>
    <p
      className="step-description"
      style={{
        color: "#4a5568",
        fontSize: "16px",
        marginTop: "0",
      }}
    >
      Estimate how many times per year your family will visit each Discovery
      Place location.
    </p>
  </div>
);

/**
 * Individual Visit Slider Component
 */
const VisitSlider = ({
  id,
  label,
  value,
  max,
  onChange,
  description,
  tickMarks,
}) => (
  <div
    className="form-group"
    style={{
      marginBottom: "30px",
      backgroundColor: "#f8fafc",
      padding: "24px",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
    }}
  >
    <div className="slider-label">
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: "18px",
          fontWeight: "600",
          color: "#1a202c",
          marginBottom: "4px",
        }}
      >
        {label}
      </label>
      <span
        style={{
          fontSize: "16px",
          fontWeight: "600",
          color: "white",
          backgroundColor: "#3182ce",
          borderRadius: "20px",
          padding: "4px 12px",
        }}
      >
        {value} visits per year
      </span>
    </div>

    <div style={{ marginTop: "20px", marginBottom: "0", position: "relative" }}>
      <input
        id={id}
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="slider"
        aria-valuemin="0"
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value} visits per year`}
        aria-label={`${label} per year`}
      />

      {/* Tick marks */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "8px",
          padding: "0 10px",
        }}
      >
        {tickMarks.map((tick, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              position: "relative",
              width: "25px",
            }}
          >
            <div
              style={{
                height: "10px",
                width: "2px",
                backgroundColor: "#a0aec0",
                margin: "0 auto 4px",
              }}
            ></div>
            <span
              style={{
                fontSize: "12px",
                color: "#718096",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              {tick}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div
      className="slider-description"
      style={{
        fontSize: "14px",
        color: "#718096",
        marginTop: "24px",
      }}
    >
      {description}
    </div>
  </div>
);

/**
 * Parking Option Component
 */
const ParkingOption = ({ includeParking, onIncludeParkingChange }) => (
  <div
    className="form-group checkbox"
    style={{
      marginBottom: "30px",
      backgroundColor: "#f8fafc",
      padding: "24px",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
    }}
  >
    <label
      htmlFor="includeParking"
      style={{
        display: "flex",
        alignItems: "flex-start",
        cursor: "pointer",
        fontWeight: "600",
        color: "#1a202c",
        fontSize: "18px",
      }}
    >
      <input
        id="includeParking"
        type="checkbox"
        checked={includeParking}
        onChange={(e) => onIncludeParkingChange(e.target.checked)}
        style={{
          width: "22px",
          height: "22px",
          marginRight: "12px",
          marginTop: "2px",
          accentColor: "#3182ce",
          cursor: "pointer",
        }}
      />
      Include parking costs for Science visits
    </label>
    <div className="checkbox-help" id="parking-help">
      Check this if you typically drive and park at Discovery Place Science.
      Members and Welcome Program visitors pay $8 per visit, while others pay
      hourly rates (typically $18+ per visit).
    </div>
  </div>
);

/**
 * Visit Distribution Chart Component
 */
const VisitDistributionChart = ({ visitDistributionData, totalVisits }) => (
  <div
    className="visit-distribution"
    style={{
      marginTop: "40px",
      marginBottom: "40px",
      padding: "24px",
      backgroundColor: "#f8fafc",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
    }}
  >
    <h3
      style={{
        fontSize: "18px",
        fontWeight: "600",
        color: "#1a202c",
        margin: "0 0 20px 0",
        textAlign: "center",
      }}
    >
      Your Visit Distribution
    </h3>
    <div
      className="chart-container"
      style={{
        height: "350px",
        margin: "30px 0 30px 0",
        position: "relative",
        overflow: "visible",
      }}
      role="img"
      aria-label="Pie chart showing your visit distribution across Discovery Place locations"
    >
      {/* Accessible table representation of chart data for screen readers */}
      <AccessibleChartTable
        visitDistributionData={visitDistributionData}
        totalVisits={totalVisits}
      />

      <ResponsiveContainer width="100%" height={350}>
        <PieChart margin={{ top: 20, right: 30, bottom: 50, left: 30 }}>
          <Pie
            data={visitDistributionData}
            cx="50%"
            cy="45%"
            labelLine={{
              stroke: "#666",
              strokeWidth: 1,
              strokeDasharray: "2 2",
            }}
            outerRadius={100}
            innerRadius={40}
            paddingAngle={4}
            label={({ name, percent, shortName }) => {
              // Use shortName for mobile displays
              const isMobile = window.innerWidth < 768;
              const displayName = isMobile ? shortName : name.split(" ")[0];
              return `${displayName}: ${(percent * 100).toFixed(0)}%`;
            }}
            labelStyle={{ fontSize: 12 }}
            dataKey="value"
            animationBegin={0}
            animationDuration={1200}
            animationEasing="ease-out"
          >
            {visitDistributionData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill}
                stroke="#ffffff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} visits`, ""]}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              padding: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              border: "none",
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              paddingTop: "30px",
              paddingBottom: "10px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

/**
 * Accessible Table for Chart Data
 */
const AccessibleChartTable = ({ visitDistributionData, totalVisits }) => (
  <div className="sr-only">
    <h4>Visit Distribution Table</h4>
    <table>
      <caption>Your planned visits to Discovery Place locations</caption>
      <thead>
        <tr>
          <th scope="col">Location</th>
          <th scope="col">Number of Visits</th>
          <th scope="col">Percentage</th>
        </tr>
      </thead>
      <tbody>
        {visitDistributionData.map((item, index) => (
          <tr key={index}>
            <th scope="row">{item.name}</th>
            <td>{item.value} visits</td>
            <td>{Math.round((item.value / totalVisits) * 100)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * Navigation Buttons Component
 */
const NavigationButtons = ({ onPrevStep, onNextStep }) => (
  <div className="button-group" style={{ display: "flex", gap: "16px" }}>
    <button
      onClick={onPrevStep}
      className="secondary-button"
      aria-label="Go back to step 1: Your Family"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "1",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginRight: "8px" }}
      >
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      Back
    </button>
    <button
      onClick={onNextStep}
      className="primary-button"
      aria-label="Continue to step 3: See Your Recommendation"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "2",
      }}
    >
      See Your Recommendation
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginLeft: "8px" }}
      >
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </button>
  </div>
);

export default VisitFrequencyForm;
