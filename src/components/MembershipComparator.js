import React, { useState, useEffect } from "react";
import { PricingConfig } from "../pricing/pricing-module";
import Logos from "../components/Logos";

const MembershipComparator = ({
  recommendation,
  formatCurrency,
  totalVisits,
}) => {
  // Get the best membership type from recommendation
  const bestMembershipType = recommendation?.bestMembershipType || "Science";

  // Initialize with best membership and alternative options
  const [selectedMemberships, setSelectedMemberships] = useState(() => {
    // Get default memberships to compare
    const defaults = getDefaultComparisonMemberships(bestMembershipType);
    return defaults;
  });

  // Calculate total people for pricing
  const totalPeople = recommendation?.totalFamilyMembers || 3;

  // Get membership data for all types
  const membershipData = buildMembershipData(totalPeople);

  // Handle toggling a membership selection
  const toggleMembership = (membershipType) => {
    setSelectedMemberships((prev) => {
      // If already selected, remove it
      if (prev.includes(membershipType)) {
        return prev.filter((type) => type !== membershipType);
      }

      // If we already have 3 selections, replace the first non-recommended one
      if (prev.length >= 3) {
        const nonRecommended = prev.find((type) => type !== bestMembershipType);
        if (nonRecommended) {
          return [
            ...prev.filter((type) => type !== nonRecommended),
            membershipType,
          ];
        }
        return prev;
      }

      // Otherwise, add it
      return [...prev, membershipType];
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800">
          Compare Membership Options
        </h2>
        <p className="text-gray-600 mt-1">
          Select up to 3 membership types to compare side by side
        </p>
      </div>

      {/* Membership selection tiles */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="membership-tiles-container">
          {["Science", "DPKH", "DPKR", "ScienceKids"].map((type) => {
            // Get display name for each membership type
            const displayName = getLocationName(type);

            return (
              <button
                key={type}
                className={`membership-tile ${
                  selectedMemberships.includes(type) ? "selected" : ""
                } ${type === bestMembershipType ? "recommended" : ""}`}
                onClick={() => toggleMembership(type)}
                aria-pressed={selectedMemberships.includes(type)}
              >
                <div className="logo-container">{getMembershipLogo(type)}</div>
                <span className="membership-tile-name">{displayName}</span>
                {type === bestMembershipType && (
                  <span className="sr-only">Recommended</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison table */}
      <div className="px-6 py-4 overflow-x-auto">
        <div className="min-w-full">
          <ComparisonTable
            selectedMemberships={selectedMemberships}
            memberships={membershipData}
            bestMembershipType={bestMembershipType}
            totalPeople={totalPeople}
            totalVisits={totalVisits}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>
    </div>
  );
};

// Main comparison table
const ComparisonTable = ({
  selectedMemberships,
  memberships,
  bestMembershipType,
  totalPeople,
  totalVisits,
  formatCurrency,
}) => {
  // Features to compare
  const features = [
    {
      id: "price",
      name: "Annual Price",
      formatter: (membership) => formatCurrency(membership.price),
    },
    {
      id: "people",
      name: "People Included",
      formatter: () => `Up to ${totalPeople} people`,
    },
    {
      id: "locations",
      name: "Locations Included",
      formatter: (membership) => membership.locations.join(", "),
    },
    {
      id: "savings",
      name: `Savings (${totalVisits} visits)`,
      formatter: (membership) => {
        if (membership.savings <= 0) return "No savings";
        return `${formatCurrency(membership.savings)} (${
          membership.savingsPercent
        }%)`;
      },
    },
    {
      id: "parking",
      name: "Parking",
      formatter: () => "$8 flat rate at Science",
    },
    {
      id: "guest",
      name: "Guest Admission",
      formatter: (membership) => membership.guestDiscount,
    },
  ];

  // Filter memberships to only show selected ones
  const filteredMemberships = memberships.filter((m) =>
    selectedMemberships.includes(m.type)
  );

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="px-4 py-3 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-1/4">
            Feature
          </th>
          {filteredMemberships.map((membership) => (
            <th
              key={membership.type}
              className={`px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider ${
                membership.type === bestMembershipType
                  ? "bg-blue-50"
                  : "bg-gray-50"
              }`}
            >
              {membership.type === bestMembershipType && (
                <div className="text-xs text-blue-600 font-medium mb-1">
                  RECOMMENDED
                </div>
              )}
              {membership.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {features.map((feature) => (
          <tr key={feature.id}>
            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
              {feature.name}
            </td>
            {filteredMemberships.map((membership) => (
              <td
                key={`${membership.type}-${feature.id}`}
                className={`px-4 py-4 text-sm text-gray-500 ${
                  membership.type === bestMembershipType ? "bg-blue-50" : ""
                }`}
              >
                {feature.formatter(membership)}
              </td>
            ))}
          </tr>
        ))}
        <tr>
          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
            Actions
          </td>
          {filteredMemberships.map((membership) => (
            <td
              key={`${membership.type}-action`}
              className={`px-4 py-4 text-sm text-gray-500 ${
                membership.type === bestMembershipType ? "bg-blue-50" : ""
              }`}
            >
              <a
                href={membership.purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${
                  membership.type === bestMembershipType
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                Select
              </a>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

// Helper function to get default memberships to compare
function getDefaultComparisonMemberships(bestMembershipType) {
  // Always include the recommended membership
  const selected = [bestMembershipType];

  // Add alternatives based on the recommended type
  if (bestMembershipType === "Science") {
    selected.push("DPKH", "ScienceKids");
  } else if (bestMembershipType === "DPKH") {
    selected.push("Science", "ScienceKids");
  } else if (bestMembershipType === "DPKR") {
    selected.push("Science", "DPKH");
  } else if (bestMembershipType === "ScienceKids") {
    selected.push("Science", "DPKH");
  } else if (bestMembershipType === "Welcome") {
    selected.push("Science", "ScienceKids");
  } else {
    // Fallback for any other type
    selected.push("Science", "ScienceKids");
  }

  return selected;
}

// Helper function to get membership logo
function getMembershipLogo(type) {
  switch (type) {
    case "Science":
      return <Logos.ScienceIcon />;
    case "DPKH":
      return <Logos.KidsIcon />;
    case "DPKR":
      return <Logos.KidsIcon />;
    case "ScienceKids":
      return <Logos.MainIcon />;
    case "Welcome":
      return <Logos.WelcomeIcon />;
    default:
      return <Logos.MainIcon />;
  }
}

// Helper function to get location name
function getLocationName(type) {
  switch (type) {
    case "Science":
      return "Science";
    case "DPKH":
      return "Kids-Huntersville";
    case "DPKR":
      return "Kids-Rockingham";
    case "ScienceKids":
      return "Science + Kids";
    case "Welcome":
      return "Welcome Program";
    default:
      return type;
  }
}

// Build detailed membership data for comparison
function buildMembershipData(totalPeople) {
  return [
    {
      type: "Science",
      name: "Discovery Place Science",
      price: getPrice("Science", totalPeople),
      locations: ["Science"],
      savings: 100, // Placeholder - would be calculated based on visits
      savingsPercent: 20, // Placeholder
      guestDiscount: "50% off at Science, 25% off at other locations",
      purchaseLink:
        "https://visit.discoveryplace.org/science/events/36a58ae8-155d-8116-9188-7d0b6fae199c",
    },
    {
      type: "DPKH",
      name: "Discovery Place Kids-Huntersville",
      price: getPrice("DPKH", totalPeople),
      locations: ["Kids-Huntersville"],
      savings: 80, // Placeholder
      savingsPercent: 15, // Placeholder
      guestDiscount: "50% off at Kids-Huntersville, 25% off at other locations",
      purchaseLink:
        "https://visit.discoveryplace.org/huntersville/events/7877bc4b-7702-fb6d-b750-01a851e506db",
    },
    {
      type: "DPKR",
      name: "Discovery Place Kids-Rockingham",
      price: getPrice("DPKR", totalPeople),
      locations: ["Kids-Rockingham"],
      savings: 60, // Placeholder
      savingsPercent: 12, // Placeholder
      guestDiscount: "50% off at Kids-Rockingham, 25% off at other locations",
      purchaseLink:
        "https://visit.discoveryplace.org/rockingham/events/b3422931-4d69-406e-3cdc-39e7081a9f41",
    },
    {
      type: "ScienceKids",
      name: "Discovery Place Science + Kids",
      price: getPrice("ScienceKids", totalPeople),
      locations: ["Science", "Kids-Huntersville", "Kids-Rockingham"],
      savings: 150, // Placeholder
      savingsPercent: 30, // Placeholder
      guestDiscount: "50% off at all Discovery Place locations",
      purchaseLink:
        "https://visit.discoveryplace.org/science/events/36a58ae8-155d-8116-9188-7d0b6fae199c",
    },
    {
      type: "Welcome",
      name: "Welcome Program",
      price: 75, // Fixed price for Welcome Program
      locations: ["One location of choice"],
      savings: 200, // Placeholder
      savingsPercent: 40, // Placeholder
      guestDiscount: "$3 per person at other locations",
      purchaseLink:
        "https://visit.discoveryplace.org/science/events/36a58ae8-155d-8116-9188-7d0b6fae199c?tg=d99160b3-94fd-9362-978e-44607faf4b03",
    },
  ];
}

// Helper function to get price based on membership type and people count
function getPrice(type, peopleCount) {
  if (peopleCount < 1) return 0;

  // Cap peopleCount to avoid array out-of-bounds
  const capped = Math.min(
    peopleCount,
    PricingConfig.MembershipPrices[type].length
  );

  // Handle special cases like DPKH, DPKR, and ScienceKids with no 1-person memberships
  if (["DPKH", "DPKR", "ScienceKids"].includes(type) && peopleCount === 1) {
    // Return the 2-person price for these types
    return PricingConfig.MembershipPrices[type][1];
  }

  return PricingConfig.MembershipPrices[type][capped - 1];
}

export default MembershipComparator;
