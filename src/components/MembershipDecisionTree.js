import React, { useState } from "react";
import { PricingConfig } from "../pricing/pricing-module";

const MembershipDecisionTree = ({ formatCurrency, recommendation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  // Decision tree questions
  const questions = [
    {
      id: "visit_frequency",
      text: "How often do you plan to visit Discovery Place locations in a year?",
      options: [
        { value: "rare", label: "Rarely (1-3 times)" },
        { value: "occasional", label: "Occasionally (4-6 times)" },
        { value: "frequent", label: "Frequently (7-9 times)" },
        { value: "very_frequent", label: "Very frequently (10+ times)" },
      ],
    },
    {
      id: "multiple_locations",
      text: "Do you plan to visit multiple Discovery Place locations?",
      options: [
        { value: "single", label: "No, just one location" },
        { value: "multiple", label: "Yes, multiple locations" },
      ],
      condition: (ans) => ans.visit_frequency !== "rare",
    },
    {
      id: "primary_location",
      text: "Which location will you visit most often?",
      options: [
        { value: "science", label: "Discovery Place Science" },
        { value: "kids_h", label: "Discovery Place Kids-Huntersville" },
        { value: "kids_r", label: "Discovery Place Kids-Rockingham" },
      ],
      condition: (ans) =>
        ans.multiple_locations === "single" || !ans.multiple_locations,
    },
    {
      id: "family_size",
      text: "How many people (including adults and children) need admission?",
      options: [
        { value: "small", label: "1-2 people" },
        { value: "medium", label: "3-4 people" },
        { value: "large", label: "5+ people" },
      ],
      condition: (ans) => ans.visit_frequency !== "rare",
    },
    {
      id: "needs_flexibility",
      text: "Will different adults take children on different visits?",
      options: [
        { value: "yes", label: "Yes, we need flexibility" },
        { value: "no", label: "No, the same adults will always visit" },
      ],
      condition: (ans) =>
        ans.family_size !== "small" && ans.visit_frequency !== "rare",
    },
    {
      id: "ebt_wic",
      text: "Do you have a North or South Carolina EBT/WIC card?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      condition: (ans) => ans.visit_frequency !== "rare",
    },
  ];

  // Filter questions based on previous answers
  const filteredQuestions = questions.filter((q, index) => {
    // First question always shows
    if (index === 0) return true;

    // For other questions, check if their condition is met
    return !q.condition || q.condition(answers);
  });

  // Get current question
  const question = filteredQuestions[currentQuestion];

  // Handle selecting an answer
  const selectAnswer = (value) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    // Check if we've reached the end of relevant questions
    if (currentQuestion >= filteredQuestions.length - 1) {
      // Determine result based on answers
      setResult(determineResult(newAnswers));
    } else {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Restart the decision tree
  const restartTree = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  // Previous question
  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="quiz-container p-0 overflow-hidden">
      {/* Header with title */}
      <div
        className="quiz-header"
        style={{
          backgroundColor: "#ebf8ff",
          padding: "20px",
          borderRadius: "8px 8px 0 0",
          borderBottom: "1px solid #bee3f8",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            margin: "0",
            fontSize: "22px",
            color: "#2c5282",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Discovery Place Membership Finder
        </h2>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: "16px",
            color: "#4a5568",
            textAlign: "center",
          }}
        >
          Answer a few questions to find your ideal membership
        </p>
      </div>

      <div className="quiz-content" style={{ padding: "0 20px 20px" }}>
        {!result ? (
          // Question view
          <div className="question-view">
            {/* Question counter */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {filteredQuestions.length}
              </div>
              <div style={{ fontWeight: "500", color: "#3182ce" }}>
                {Math.round(
                  ((currentQuestion + 1) / filteredQuestions.length) * 100
                )}
                % Complete
              </div>
            </div>

            {/* Progress bar */}
            <div
              style={{
                width: "100%",
                backgroundColor: "#e2e8f0",
                borderRadius: "99px",
                height: "10px",
                marginBottom: "30px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${
                    ((currentQuestion + 1) / filteredQuestions.length) * 100
                  }%`,
                  backgroundColor: "#3182ce",
                  height: "100%",
                  borderRadius: "99px",
                  transition: "width 0.5s ease",
                }}
                role="progressbar"
                aria-valuenow={Math.round(
                  ((currentQuestion + 1) / filteredQuestions.length) * 100
                )}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>

            {/* Current question */}
            <h3
              style={{
                marginTop: "0",
                marginBottom: "24px",
                fontSize: "20px",
                fontWeight: "600",
                color: "#1a202c",
              }}
            >
              {question.text}
            </h3>

            {/* Answer options */}
            <div className="quiz-options" style={{ marginBottom: "30px" }}>
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => selectAnswer(option.value)}
                  style={{ position: "relative" }}
                >
                  {option.label}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      position: "absolute",
                      right: "20px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "20px",
                      height: "20px",
                    }}
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              ))}
            </div>

            {/* Navigation buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "30px",
              }}
            >
              <button
                onClick={goToPreviousQuestion}
                disabled={currentQuestion === 0}
                className="secondary-button"
                style={{
                  opacity: currentQuestion === 0 ? "0.5" : "1",
                  cursor: currentQuestion === 0 ? "not-allowed" : "pointer",
                }}
              >
                Back
              </button>

              <button onClick={restartTree} className="secondary-button">
                Start Over
              </button>
            </div>
          </div>
        ) : (
          // Result view
          <div
            className="result-view"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <ResultIcon result={result} />
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#1a202c",
                  marginTop: "20px",
                }}
              >
                {result.title}
              </h3>
              <p style={{ fontSize: "16px", color: "#4a5568" }}>
                {result.description}
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#ebf8ff",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "24px",
                border: "1px solid #bee3f8",
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
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#2c5282",
                  }}
                >
                  Estimated Annual Cost:
                </span>
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1a202c",
                  }}
                >
                  {formatCurrency(result.price)}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <h4
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#1a202c",
                  marginBottom: "16px",
                }}
              >
                Key Benefits:
              </h4>
              <ul style={{ padding: "0", margin: "0", listStyle: "none" }}>
                {result.benefits.map((benefit, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        flexShrink: "0",
                        marginRight: "12px",
                        marginTop: "4px",
                        backgroundColor: "#c6f6d5",
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckCircleIcon
                        style={{
                          width: "14px",
                          height: "14px",
                          color: "#38a169",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "16px", color: "#2d3748" }}>
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {result.alternative && (
              <div
                style={{
                  marginBottom: "24px",
                  padding: "20px",
                  backgroundColor: "#f7fafc",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#1a202c",
                    marginTop: "0",
                    marginBottom: "12px",
                  }}
                >
                  You Might Also Consider:
                </h4>
                <p
                  style={{
                    fontSize: "15px",
                    color: "#4a5568",
                    marginBottom: "16px",
                    margin: "0 0 12px",
                  }}
                >
                  {result.alternative.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "15px",
                    backgroundColor: "#edf2f7",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <span style={{ fontWeight: "500" }}>
                    {result.alternative.title}
                  </span>
                  <span style={{ fontWeight: "600" }}>
                    {formatCurrency(result.alternative.price)}
                  </span>
                </div>
              </div>
            )}

            {/* Compare to recommendation */}
            {recommendation && (
              <div
                style={{
                  marginBottom: "24px",
                  padding: "20px",
                  backgroundColor: "#f0fff4",
                  borderRadius: "10px",
                  border: "1px solid #c6f6d5",
                }}
              >
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#276749",
                    marginTop: "0",
                    marginBottom: "12px",
                  }}
                >
                  Compare with Detailed Calculator:
                </h4>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#f0fff4",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "#2f855a",
                      }}
                    >
                      {recommendation.bestMembershipLabel ||
                        "No calculation yet"}
                    </div>
                    <div style={{ fontSize: "13px", color: "#48bb78" }}>
                      Based on your detailed visit information
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#2f855a",
                    }}
                  >
                    {formatCurrency(
                      recommendation?.bestMembershipPromoCost || 0
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginTop: "30px",
              }}
            >
              <a
                href={result.purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="primary-button"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Learn More About This Option
                <svg
                  style={{ width: "16px", height: "16px", marginLeft: "8px" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              <button onClick={restartTree} className="secondary-button">
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Determine result based on answers
const determineResult = (answers) => {
  // Default to pay-as-you-go
  let result = membershipOptions.payAsYouGo;

  // EBT/WIC recipients qualify for Welcome Program
  if (answers.ebt_wic === "yes" && answers.visit_frequency !== "rare") {
    return membershipOptions.welcome;
  }

  // Determine based on visit frequency
  if (answers.visit_frequency === "rare") {
    // 1-3 visits per year - recommend pay-as-you-go
    return membershipOptions.payAsYouGo;
  } else if (answers.visit_frequency === "occasional") {
    // 4-6 visits per year
    if (answers.family_size === "small") {
      // Small family, single location - basic membership
      if (answers.primary_location === "science") {
        return membershipOptions.scienceBasic;
      } else if (answers.primary_location === "kids_h") {
        return membershipOptions.kidsHBasic;
      } else {
        return membershipOptions.kidsRBasic;
      }
    } else {
      // Larger family, determine by location
      if (answers.multiple_locations === "multiple") {
        return membershipOptions.scienceKids;
      } else if (answers.primary_location === "science") {
        return membershipOptions.science;
      } else if (answers.primary_location === "kids_h") {
        return membershipOptions.kidsH;
      } else {
        return membershipOptions.kidsR;
      }
    }
  } else {
    // Frequent or very frequent visits
    if (
      answers.multiple_locations === "multiple" ||
      answers.visit_frequency === "very_frequent"
    ) {
      // Multiple locations or very frequent - Science + Kids
      return membershipOptions.scienceKids;
    } else {
      // Single location frequent visitors
      if (answers.primary_location === "science") {
        return membershipOptions.science;
      } else if (answers.primary_location === "kids_h") {
        return membershipOptions.kidsH;
      } else {
        return membershipOptions.kidsR;
      }
    }
  }
};

// Membership options data
const membershipOptions = {
  payAsYouGo: {
    id: "pay_as_you_go",
    title: "Pay As You Go",
    description:
      "For occasional visitors, regular admission is the most cost-effective option.",
    price: 0, // Variable based on visits
    purchaseLink: "https://discoveryplace.org/visit/buy-tickets/",
    benefits: [
      "No upfront commitment",
      "Pay only for the visits you make",
      "Access to all public exhibits and areas",
    ],
    alternative: {
      title: "Basic Membership",
      description:
        "If you think you might visit more than expected, consider a basic membership.",
      price: 109,
    },
  },
  scienceBasic: {
    id: "science_basic",
    title: "Discovery Place Science Basic Membership",
    description:
      "A cost-effective option for individuals or pairs who primarily visit Science.",
    price: 109,
    purchaseLink:
      "https://visit.discoveryplace.org/science/events/36a58ae8-155d-8116-9188-7d0b6fae199c",
    benefits: [
      "Unlimited admission for one adult",
      "50% off guest admission for your companions",
      "$8 flat-rate parking at Science",
      "Member discounts on IMAX films and special exhibitions",
    ],
    alternative: {
      title: "Full Science Membership",
      description:
        "For maximum flexibility, consider upgrading to a full membership.",
      price: 209,
    },
  },
  kidsHBasic: {
    id: "kids_h_basic",
    title: "Discovery Place Kids-Huntersville Basic Membership",
    description:
      "Perfect for a parent/caregiver and child who regularly visit Kids-Huntersville.",
    price: 129,
    purchaseLink:
      "https://visit.discoveryplace.org/huntersville/events/7877bc4b-7702-fb6d-b750-01a851e506db",
    benefits: [
      "Unlimited admission for one adult and one child",
      "50% off guest admission for additional family members",
      "Special member-only events",
      "Discounts on camps and special programs",
    ],
  },
  kidsRBasic: {
    id: "kids_r_basic",
    title: "Discovery Place Kids-Rockingham Basic Membership",
    description:
      "Great value for a parent/caregiver and child who primarily visit Kids-Rockingham.",
    price: 89,
    purchaseLink:
      "https://visit.discoveryplace.org/rockingham/events/b3422931-4d69-406e-3cdc-39e7081a9f41",
    benefits: [
      "Unlimited admission for one adult and one child",
      "50% off guest admission for additional family members",
      "Special member-only events",
      "Discounts on camps and special programs",
    ],
  },
  science: {
    id: "science",
    title: "Discovery Place Science Membership",
    description:
      "Best for families who primarily visit our Science location in Uptown Charlotte.",
    price: 229, // Price for family of 3-4, approximate
    purchaseLink:
      "https://visit.discoveryplace.org/science/events/36a58ae8-155d-8116-9188-7d0b6fae199c",
    benefits: [
      "Unlimited admission for all named members",
      "$8 flat-rate parking at Science",
      "50% off guest admission at Science",
      "25% off at other Discovery Place locations",
      "Reciprocal admission at ASTC partner museums",
    ],
    alternative: {
      title: "Science + Kids Membership",
      description: "For maximum flexibility across all locations.",
      price: 329,
    },
  },
  kidsH: {
    id: "kids_h",
    title: "Discovery Place Kids-Huntersville Membership",
    description:
      "Ideal for families with younger children who primarily visit Kids-Huntersville.",
    price: 229, // Price for family of 3-4, approximate
    purchaseLink:
      "https://visit.discoveryplace.org/huntersville/events/7877bc4b-7702-fb6d-b750-01a851e506db",
    benefits: [
      "Unlimited admission for all named members",
      "50% off guest admission at Kids-Huntersville",
      "25% off at other Discovery Place locations",
      "Special member-only events",
      "Member discounts on camps and programs",
    ],
  },
  kidsR: {
    id: "kids_r",
    title: "Discovery Place Kids-Rockingham Membership",
    description:
      "Perfect for families with young children who visit Kids-Rockingham.",
    price: 139, // Price for family of 3-4, approximate
    purchaseLink:
      "https://visit.discoveryplace.org/rockingham/events/b3422931-4d69-406e-3cdc-39e7081a9f41",
    benefits: [
      "Unlimited admission for all named members",
      "50% off guest admission at Kids-Rockingham",
      "25% off at other Discovery Place locations",
      "Special member-only events",
      "Member discounts on camps and programs",
    ],
  },
  scienceKids: {
    id: "science_kids",
    title: "Discovery Place Science + Kids Membership",
    description:
      "The ultimate membership for families who visit multiple locations frequently.",
    price: 329, // Price for family of 3-4, approximate
    purchaseLink:
      "https://visit.discoveryplace.org/science/events/36a58ae8-155d-8116-9188-7d0b6fae199c",
    benefits: [
      "Unlimited admission to ALL Discovery Place locations",
      "50% off guest admission at all locations",
      "$8 flat-rate parking at Science",
      "ASTC reciprocal benefits (90 mile radius exclusions apply)",
      "Priority registration for camps and programs",
    ],
  },
  welcome: {
    id: "welcome",
    title: "Welcome Program Membership",
    description: "Discounted membership option for EBT/WIC cardholders.",
    price: 75,
    purchaseLink:
      "https://visit.discoveryplace.org/science/events/36a58ae8-155d-8116-9188-7d0b6fae199c?tg=d99160b3-94fd-9362-978e-44607faf4b03",
    benefits: [
      "Deeply discounted membership for up to 8 people",
      "Unlimited admission to one Discovery Place location",
      "$3 per person admission at other locations",
      "$8 flat-rate parking at Science",
      "50% off fee-based educational programs",
    ],
  },
};

// Result icon component
const ResultIcon = ({ result }) => {
  let bgColor = "#3182ce";
  let iconContent = "✓";

  switch (result.id) {
    case "science_kids":
      bgColor = "#38a169";
      iconContent = "★";
      break;
    case "welcome":
      bgColor = "#805ad5";
      iconContent = "♥";
      break;
    case "pay_as_you_go":
      bgColor = "#718096";
      iconContent = "$";
      break;
    default:
      bgColor = "#3182ce";
      iconContent = "✓";
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        backgroundColor: bgColor,
        color: "white",
        fontSize: "32px",
        fontWeight: "bold",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      {iconContent}
    </div>
  );
};

// Check icon for benefits
const CheckCircleIcon = ({ style }) => (
  <svg
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export default MembershipDecisionTree;
