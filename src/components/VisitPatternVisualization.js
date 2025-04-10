import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { PricingConfig } from "../pricing/pricing-module";
import Logos from "../components/Logos";

const VisitPatternVisualization = ({
  scienceVisits = 0,
  dpkhVisits = 0,
  dpkrVisits = 0,
  recommendation,
}) => {
  const [selectedView, setSelectedView] = useState("distribution");
  const totalVisits = scienceVisits + dpkhVisits + dpkrVisits;

  // Don't render if there are no visits
  if (totalVisits === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Visit Pattern Analysis
        </h3>
        <p>Add visits to see analysis and visualizations</p>
      </div>
    );
  }

  // Prepare data for visualizations
  const visitDistributionData = prepareVisitDistributionData(
    scienceVisits,
    dpkhVisits,
    dpkrVisits
  );
  const costComparisonData = prepareCostComparisonData(
    recommendation,
    totalVisits
  );
  const monthlyVisitData = prepareMonthlyVisitData(totalVisits);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Visit Pattern Analysis
        </h3>

        {/* View Switcher */}
        <div className="inline-flex rounded-md shadow-sm">
          <ViewSwitcherButton
            label="Distribution"
            isActive={selectedView === "distribution"}
            onClick={() => setSelectedView("distribution")}
            position="left"
          />
          <ViewSwitcherButton
            label="Cost Analysis"
            isActive={selectedView === "cost"}
            onClick={() => setSelectedView("cost")}
            position="middle"
          />
          <ViewSwitcherButton
            label="Monthly Pattern"
            isActive={selectedView === "monthly"}
            onClick={() => setSelectedView("monthly")}
            position="right"
          />
        </div>
      </div>

      <div className="p-6">
        {/* View content based on selection */}
        {selectedView === "distribution" && (
          <DistributionView
            visitDistributionData={visitDistributionData}
            totalVisits={totalVisits}
          />
        )}

        {selectedView === "cost" && (
          <CostAnalysisView
            costComparisonData={costComparisonData}
            recommendation={recommendation}
          />
        )}

        {selectedView === "monthly" && (
          <MonthlyPatternView
            monthlyVisitData={monthlyVisitData}
            totalVisits={totalVisits}
          />
        )}
      </div>
    </div>
  );
};

// Button for view switcher
const ViewSwitcherButton = ({ label, isActive, onClick, position }) => {
  // Determine border radius based on position
  let borderRadius = "";
  if (position === "left") borderRadius = "rounded-l-md";
  else if (position === "right") borderRadius = "rounded-r-md";

  return (
    <button
      type="button"
      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
        isActive
          ? "bg-blue-600 text-white border-blue-600 z-10"
          : "bg-white text-gray-700 hover:bg-gray-50"
      } ${borderRadius}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

// Distribution view with pie chart
const DistributionView = ({ visitDistributionData, totalVisits }) => {
  // Data processing for screen readers
  const accessibleData = visitDistributionData.map((item) => ({
    location: item.name,
    visits: item.value,
    percentage: Math.round((item.value / totalVisits) * 100),
  }));

  return (
    <div className="visit-distribution">
      <h4 className="text-base font-medium text-gray-700 mb-4">
        Your Visit Distribution
      </h4>

      {/* Screen reader accessible table */}
      <div className="sr-only">
        <h5>Visit Distribution Table</h5>
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
            {accessibleData.map((item, index) => (
              <tr key={index}>
                <th scope="row">{item.location}</th>
                <td>{item.visits} visits</td>
                <td>{item.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual pie chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={visitDistributionData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {visitDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} visits`, ""]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        {getDistributionInsight(visitDistributionData, totalVisits)}
      </div>
    </div>
  );
};

// Cost analysis view with bar chart
const CostAnalysisView = ({ costComparisonData, recommendation }) => {
  return (
    <div className="cost-analysis">
      <h4 className="text-base font-medium text-gray-700 mb-4">
        Cost Analysis
      </h4>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={costComparisonData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => {
                if (name === "cost") return [`$${value}`, "Cost"];
                if (name === "savings") return [`$${value}`, "Savings"];
                return [value, name];
              }}
            />
            <Legend />
            <Bar dataKey="cost" name="Annual Cost" fill="#8884d8" />
            <Bar
              dataKey="savings"
              name="Savings vs. Regular Admission"
              fill="#82ca9d"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        {getCostAnalysisInsight(recommendation)}
      </div>
    </div>
  );
};

// Monthly pattern view with simulated monthly visits
const MonthlyPatternView = ({ monthlyVisitData, totalVisits }) => {
  return (
    <div className="monthly-pattern">
      <h4 className="text-base font-medium text-gray-700 mb-4">
        Monthly Visit Pattern
      </h4>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyVisitData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="visits" name="Estimated Visits" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        {getMonthlyPatternInsight(totalVisits)}
      </div>
    </div>
  );
};

// Prepare visit distribution data
function prepareVisitDistributionData(scienceVisits, dpkhVisits, dpkrVisits) {
  const data = [];

  if (scienceVisits > 0) {
    data.push({
      name: "Discovery Place Science",
      value: scienceVisits,
      fill: "#3182CE", // Blue
    });
  }

  if (dpkhVisits > 0) {
    data.push({
      name: "Discovery Place Kids-Huntersville",
      value: dpkhVisits,
      fill: "#9F7AEA", // Purple
    });
  }

  if (dpkrVisits > 0) {
    data.push({
      name: "Discovery Place Kids-Rockingham",
      value: dpkrVisits,
      fill: "#ED8936", // Orange
    });
  }

  return data;
}

// Prepare cost comparison data
function prepareCostComparisonData(recommendation, totalVisits) {
  if (!recommendation) return [];

  // Extract membership types and costs from recommendation
  const regularAdmissionCost = recommendation.regularAdmissionCost || 0;
  const scienceCost =
    PricingConfig.MembershipPrices.Science[
      recommendation.totalFamilyMembers - 1
    ] || 0;
  const dpkhCost =
    recommendation.totalFamilyMembers >= 2
      ? PricingConfig.MembershipPrices.DPKH[
          recommendation.totalFamilyMembers - 1
        ]
      : 0;
  const dpkrCost =
    recommendation.totalFamilyMembers >= 2
      ? PricingConfig.MembershipPrices.DPKR[
          recommendation.totalFamilyMembers - 1
        ]
      : 0;
  const scienceKidsCost =
    recommendation.totalFamilyMembers >= 2
      ? PricingConfig.MembershipPrices.ScienceKids[
          recommendation.totalFamilyMembers - 1
        ]
      : 0;

  return [
    {
      name: "Regular Admission",
      cost: regularAdmissionCost,
      savings: 0,
    },
    {
      name: "Science Membership",
      cost: scienceCost,
      savings: Math.max(0, regularAdmissionCost - scienceCost),
    },
    {
      name: "Kids-Huntersville",
      cost: dpkhCost,
      savings: Math.max(0, regularAdmissionCost - dpkhCost),
    },
    {
      name: "Kids-Rockingham",
      cost: dpkrCost,
      savings: Math.max(0, regularAdmissionCost - dpkrCost),
    },
    {
      name: "Science + Kids",
      cost: scienceKidsCost,
      savings: Math.max(0, regularAdmissionCost - scienceKidsCost),
    },
  ];
}

// Prepare monthly visit data (simulate a realistic pattern)
function prepareMonthlyVisitData(totalVisits) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Create a realistic distribution pattern for visits
  // Higher in summer and holidays, lower in winter
  const distributionWeights = [
    0.06, 0.07, 0.08, 0.09, 0.08, 0.1, 0.12, 0.11, 0.08, 0.08, 0.07, 0.06,
  ];

  // Distribute total visits across months based on weights
  let remainingVisits = totalVisits;
  const monthlyVisits = distributionWeights.map((weight) => {
    const visits = Math.round(totalVisits * weight);
    remainingVisits -= visits;
    return visits;
  });

  // Adjust for rounding errors
  if (remainingVisits > 0) {
    // Add remaining visits to July (peak month)
    monthlyVisits[6] += remainingVisits;
  } else if (remainingVisits < 0) {
    // Remove excess visits from December (lowest month)
    monthlyVisits[11] = Math.max(0, monthlyVisits[11] + remainingVisits);
  }

  // Create data for the chart
  return months.map((month, index) => ({
    month,
    visits: monthlyVisits[index],
  }));
}

// Generate insight text based on visit distribution
function getDistributionInsight(visitDistributionData, totalVisits) {
  if (visitDistributionData.length === 1) {
    const location = visitDistributionData[0].name;
    return `You exclusively visit ${location}. A single-location membership would be most cost-effective for you.`;
  }

  if (visitDistributionData.length >= 2) {
    // Find most visited location
    const sortedData = [...visitDistributionData].sort(
      (a, b) => b.value - a.value
    );
    const primaryLocation = sortedData[0].name;
    const primaryPercentage = Math.round(
      (sortedData[0].value / totalVisits) * 100
    );

    if (primaryPercentage >= 75) {
      return `Your visits are primarily to ${primaryLocation} (${primaryPercentage}%). A ${getPrimaryLocationMembership(
        primaryLocation
      )} membership would be your best option.`;
    } else {
      return `You visit multiple locations regularly. Consider a Science + Kids membership for the most flexibility and value.`;
    }
  }

  return "Add more visit information to see personalized insights.";
}

// Generate insight text based on cost analysis
function getCostAnalysisInsight(recommendation) {
  if (!recommendation)
    return "Add more information to see personalized cost insights.";

  const savings = recommendation.bestMembershipSavings || 0;
  const savingsPercent = recommendation.savingsPercentage || 0;
  const membershipType = recommendation.bestMembershipType || "Science";

  if (savings <= 0) {
    return "Based on your visit pattern, paying regular admission may be more economical than purchasing a membership.";
  }

  if (savingsPercent >= 40) {
    return `A ${getMembershipName(
      membershipType
    )} membership offers excellent value with approximately ${savingsPercent}% savings compared to regular admission.`;
  } else if (savingsPercent >= 20) {
    return `A ${getMembershipName(
      membershipType
    )} membership offers good value with approximately ${savingsPercent}% savings compared to regular admission.`;
  } else {
    return `A ${getMembershipName(
      membershipType
    )} membership offers moderate savings of approximately ${savingsPercent}% compared to regular admission.`;
  }
}

// Generate insight text based on monthly pattern
function getMonthlyPatternInsight(totalVisits) {
  if (totalVisits <= 4) {
    return "With only a few visits per year, consider if a membership is worth it or if regular admission would be more economical.";
  } else if (totalVisits <= 8) {
    return "Your visit pattern suggests moderate usage. A basic membership would likely provide good value.";
  } else if (totalVisits <= 12) {
    return "Your visit frequency shows regular engagement. A full membership would offer excellent value.";
  } else {
    return "You're a frequent visitor! A comprehensive membership would provide substantial savings and added benefits.";
  }
}

// Helper function to get primary location membership name
function getPrimaryLocationMembership(locationName) {
  if (locationName.includes("Science")) return "Science";
  if (locationName.includes("Huntersville")) return "Kids-Huntersville";
  if (locationName.includes("Rockingham")) return "Kids-Rockingham";
  return "Discovery Place";
}

// Helper function to get membership name for display
function getMembershipName(membershipType) {
  switch (membershipType) {
    case "Science":
      return "Discovery Place Science";
    case "DPKH":
      return "Discovery Place Kids-Huntersville";
    case "DPKR":
      return "Discovery Place Kids-Rockingham";
    case "ScienceKids":
      return "Discovery Place Science + Kids";
    case "Welcome":
      return "Welcome Program";
    case "PayAsYouGo":
      return "Regular Admission";
    default:
      return membershipType;
  }
}

export default VisitPatternVisualization;
