// components/MembershipFAQ.js
import React, { useState } from "react";
import { PricingConfig } from "../pricing/pricing-module";

/**
 * MembershipFAQ component
 * Renders FAQs based on membership recommendation
 */
const MembershipFAQ = ({ recommendation }) => {
  const relevantCategories = getRelevantCategories(recommendation);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 mt-1">
          Common questions about Discovery Place memberships
        </p>
      </div>

      <div className="p-6">
        {relevantCategories.map((category) => (
          <FAQSection
            key={category.id}
            title={category.title}
            questions={category.questions}
            recommendation={recommendation}
          />
        ))}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Have more questions?{" "}
          <a
            href="https://discoveryplace.org/contact"
            className="text-blue-600 hover:text-blue-800"
          >
            Contact our membership team
          </a>
          .
        </p>
        <ContactOptions />
      </div>
    </div>
  );
};

const FAQSection = ({ title, questions, recommendation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="pt-6 pb-4">
      <button
        className="faq-category-button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <h3 className="faq-category-title">{title}</h3>
        <span className="faq-icon-container">
          {isExpanded ? (
            <MinusIcon className="h-5 w-5 text-gray-600" />
          ) : (
            <PlusIcon className="h-5 w-5 text-gray-600" />
          )}
        </span>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {questions.map((q) => (
            <FAQItem
              key={q.id}
              question={q.question}
              answer={q.answer}
              recommendation={recommendation}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FAQItem = ({ question, answer, recommendation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const processedAnswer = processAnswer(answer, recommendation);

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <button
        className="faq-question-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h4 className="faq-question">{question}</h4>
        <span className="faq-icon-container">
          {isOpen ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          )}
        </span>
      </button>
      {isOpen && <div className="faq-answer">{processedAnswer}</div>}
    </div>
  );
};

const ContactOptions = () => (
  <div className="flex gap-4">
    <a
      href="tel:7043372661"
      className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900"
      aria-label="Call membership support"
    >
      <PhoneIcon className="h-5 w-5 text-gray-500 mr-2" />
      (704) 337-2661
    </a>
    <a
      href="mailto:members@discoveryplace.org"
      className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900"
      aria-label="Email membership support"
    >
      <MailIcon className="h-5 w-5 text-gray-500 mr-2" />
      Email Us
    </a>
  </div>
);

// --- Helpers below ---

function getRelevantCategories(recommendation) {
  const defaultCategories = ["general", "pricing", "benefits"];
  let additionalCategories = [];

  if (recommendation) {
    const { bestMembershipType, scienceVisits } = recommendation;
    if (bestMembershipType === "Welcome") additionalCategories.push("welcome");
    if (bestMembershipType === "ScienceKids")
      additionalCategories.push("multiple-locations");
    if (scienceVisits > 0) additionalCategories.push("parking");
  }

  return faqData.filter(
    (category) =>
      defaultCategories.includes(category.id) ||
      additionalCategories.includes(category.id)
  );
}

function processAnswer(answer, recommendation) {
  if (!recommendation) return answer;
  const name = getMembershipName(recommendation.bestMembershipType);
  const price = recommendation.bestMembershipPromoCost || 0;
  return answer
    .replace(/%MEMBERSHIP_TYPE%/g, name)
    .replace(/%PRICE%/g, `$${price}`);
}

function getMembershipName(type) {
  switch (type) {
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
    default:
      return "Discovery Place";
  }
}

// --- Icons ---
const PlusIcon = (props) => (
  <svg {...props} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
      clipRule="evenodd"
    />
  </svg>
);

const MinusIcon = (props) => (
  <svg {...props} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronDownIcon = (props) => (
  <svg {...props} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronUpIcon = (props) => (
  <svg {...props} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const PhoneIcon = (props) => (
  <svg {...props} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

const MailIcon = (props) => (
  <svg {...props} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

/**
 * FAQ Data
 */
const faqData = [
  {
    id: "general",
    title: "General Membership Information",
    questions: [
      {
        id: "what-is-membership",
        question: "What is a Discovery Place membership?",
        answer:
          "A Discovery Place membership provides unlimited admission to one or more of our museums for a full year. Depending on your membership type, you'll have access to Discovery Place Science, Discovery Place Kids-Huntersville, Discovery Place Kids-Rockingham, or all locations. Your membership is valid through the end of the month in the following year (e.g., a membership purchased on March 14, 2025 would be valid through March 31, 2026).",
      },
      {
        id: "membership-includes",
        question: "What's included in my membership?",
        answer:
          "Your %MEMBERSHIP_TYPE% membership includes unlimited admission for all named members on your account, discounted guest admission, $8 flat-rate parking at Discovery Place Science, and special member benefits like Member Hour. At Discovery Place Science, members also receive discounts at our ShopScience store and Bean Sprouts cafe.",
      },
      {
        id: "membership-length",
        question: "How long does a membership last?",
        answer:
          "All Discovery Place memberships are valid from the date of purchase through the end of the same month in the following year. For example, a membership purchased on March 14, 2025 would remain valid through March 31, 2026.",
      },
      {
        id: "add-people",
        question: "Can I add more people to my membership later?",
        answer:
          "Yes, you can add additional people to your membership at any time. Each additional person costs approximately $20-$30 depending on your membership type. Contact our membership office for exact pricing and assistance.",
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing and Payment",
    questions: [
      {
        id: "price-factors",
        question: "What factors determine membership price?",
        answer:
          "Membership prices are determined by three main factors: the type of membership (Science, Kids-Huntersville, Kids-Rockingham, or Science + Kids), the number of people included on the membership, and any promotional discounts you might qualify for.",
      },
      {
        id: "payment-options",
        question: "What payment options do you accept?",
        answer:
          "We accept all major credit cards (Visa, MasterCard, American Express, Discover) as well as cash for in-person purchases. Credit card payments can be made online, over the phone, or in person at any of our locations.",
      },
      {
        id: "renew-discount",
        question: "Are there discounts when I renew my membership?",
        answer:
          "Renewal discounts may be available depending on current promotions. While we don't automatically apply a renewal discount, we frequently offer special incentives for renewing members. Our membership team can inform you of any available promotions when it's time to renew.",
      },
    ],
  },
  {
    id: "benefits",
    title: "Membership Benefits",
    questions: [
      {
        id: "guest-discounts",
        question: "Do my guests receive discounts?",
        answer:
          "Yes, your guests can receive significant discounts when visiting with you. With your membership, guests receive 50% off admission at your home museum and 25% off at other Discovery Place locations. These discounts apply to up to 6 guests per visit.",
      },
      {
        id: "reciprocal-benefits",
        question: "Are there reciprocal benefits with other museums?",
        answer:
          "Yes, Discovery Place Science memberships include reciprocal benefits through the ASTC Travel Passport Program, giving you free admission for 2 adults and up to 4 children to over 300 science centers worldwide. Note: Reciprocal benefits are not valid at museums within 90 linear miles of your home address or your home museum.",
      },
      {
        id: "special-events",
        question: "Are there special events for members?",
        answer:
          "Yes! We offer Member Hour, a special time when only members can enjoy our museums. Member Hour is available on Fridays and Saturdays at Discovery Place Science, and daily at our Kids locations in Huntersville and Rockingham. This is a great opportunity to experience our exhibits with smaller crowds.",
      },
    ],
  },
  {
    id: "parking",
    title: "Parking Information",
    questions: [
      {
        id: "parking-cost",
        question: "How much does parking cost with a membership?",
        answer:
          "Members receive discounted parking at the Discovery Place Science parking deck for a flat rate of $8 per visit, regardless of how long you stay. Non-members pay hourly rates that can exceed $18 for a typical visit.",
      },
      {
        id: "parking-validation",
        question: "How do I validate my parking?",
        answer:
          "Present your membership card at the Welcome Desk when you check in, and they will validate your parking ticket. The validation is good for one exit on the same day.",
      },
      {
        id: "parking-alternatives",
        question: "Are there alternative parking options?",
        answer:
          "Yes, there are several public parking decks and street parking options within walking distance of Discovery Place Science. However, our parking deck offers the most convenient access and with your member discount, it's often the best value.",
      },
    ],
  },
  {
    id: "welcome",
    title: "Welcome Program",
    questions: [
      {
        id: "welcome-eligibility",
        question: "Who qualifies for the Welcome Program?",
        answer:
          "The Welcome Program is available to North Carolina and South Carolina residents who are current EBT (SNAP/FNS) or WIC cardholders. You'll need to present your valid ID and EBT/WIC card when purchasing or using your membership.",
      },
      {
        id: "welcome-cost",
        question: "How much does a Welcome Program membership cost?",
        answer:
          "The Welcome Program membership costs $75 for a full year and includes 2 adults and up to 6 children. This represents a significant savings compared to regular membership prices.",
      },
      {
        id: "welcome-cross-location",
        question:
          "Can I visit all Discovery Place locations with a Welcome membership?",
        answer:
          "Your Welcome Program membership provides unlimited admission to one Discovery Place location of your choice. You can visit other Discovery Place locations for just $3 per person per visit.",
      },
    ],
  },
  {
    id: "multiple-locations",
    title: "Multiple Locations",
    questions: [
      {
        id: "science-kids-benefits",
        question: "What are the benefits of a Science + Kids membership?",
        answer:
          "The Science + Kids membership gives you unlimited access to all Discovery Place locations: Discovery Place Science, Discovery Place Kids-Huntersville, and Discovery Place Kids-Rockingham. It's perfect for families who want to experience all of our museums throughout the year, with no additional fees across locations.",
      },
      {
        id: "location-differences",
        question: "What are the differences between the locations?",
        answer:
          "Discovery Place Science (in Uptown Charlotte) features interactive science exhibits, an aquarium, and IMAX Dome Theatre, appropriate for all ages. Discovery Place Kids-Huntersville and Kids-Rockingham are designed specifically for children under 10, with age-appropriate exhibits focusing on play-based learning.",
      },
      {
        id: "best-age-ranges",
        question: "Which locations are best for different age ranges?",
        answer:
          "For children under 7, Discovery Place Kids locations offer the most engaging experiences. For older children (8+) and adults, Discovery Place Science provides more advanced content. The Science + Kids membership allows your family to choose the right location for your needs on any given day.",
      },
    ],
  },
];

export default MembershipFAQ;
