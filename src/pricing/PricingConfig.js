// pricing/PricingConfig.js
/**
 * Centralized Pricing Configuration
 *
 * This file serves as the single source of truth for all pricing structures
 * across the application. It contains:
 *
 * - Admission prices for each location
 * - Membership pricing tiers by number of people
 * - Parking rates
 * - Guest discount percentages
 * - Promotional discounts and eligibility rules
 * - Welcome Program pricing
 * - System constraints
 *
 * All prices are in USD and should be updated when official pricing changes.
 */

export const PricingConfig = {
  /**
   * Admission Prices
   *
   * Contains standard admission prices for each Discovery Place location
   * including adult and child pricing, plus age thresholds for free admission
   */
  AdmissionPrices: {
    // Discovery Place Science (Charlotte)
    Science: {
      adult: 24, // Adult admission price
      child: 18, // Child admission price
      childAgeThreshold: 2, // Children under 2 are free
      description:
        "Our flagship science museum in Uptown Charlotte featuring interactive exhibits for all ages",
    },

    // Discovery Place Kids-Huntersville
    DPKH: {
      adult: 15, // Adult admission price
      child: 12, // Child admission price
      childAgeThreshold: 1, // Children under 1 are free
      description:
        "Children's museum in Huntersville designed for children 10 and under",
    },

    // Discovery Place Kids-Rockingham
    DPKR: {
      // Standard pricing for non-residents
      standard: {
        adult: 8,
        child: 8,
      },
      // Discounted pricing for Richmond County residents
      resident: {
        adult: 6,
        child: 6,
      },
      childAgeThreshold: 1, // Children under 1 are free
      description:
        "Children's museum in Rockingham designed for children 10 and under",
    },
  },

  /**
   * Membership Base Prices
   *
   * Prices are indexed by number of people:
   * - Index 0 = 1 person
   * - Index 1 = 2 people
   * - Index 2 = 3 people
   * And so on...
   *
   * Note: DPKH, DPKR, and ScienceKids do not offer 1-person memberships
   */
  MembershipPrices: {
    // Discovery Place Science
    Science: [109, 209, 229, 249, 269, 289, 309, 329, 349, 369],

    // Discovery Place Kids-Huntersville
    DPKH: [0, 209, 229, 249, 269, 289, 309, 329, 349, 369], // No 1-person memberships

    // Discovery Place Kids-Rockingham
    DPKR: [0, 129, 139, 149, 159, 169, 179, 189, 199, 209], // No 1-person memberships

    // Science + Kids Membership (access to all locations)
    ScienceKids: [0, 309, 329, 349, 369, 389, 409, 429, 449, 469], // No 1-person memberships
  },

  /**
   * Parking Rates
   *
   * Different parking rates based on membership status
   */
  ParkingRates: {
    member: 8, // Flat rate for members
    welcome: 8, // Flat rate for Welcome Program participants
    standard: 18, // Estimated average for non-members (3hr visit)
  },

  /**
   * Guest Discounts
   *
   * Percentage discounts applied when visiting with a member
   * Format: memberLocation -> visitLocation -> discount percentage
   */
  GuestDiscounts: {
    discountMap: {
      // For Science members
      Science: {
        Science: 0.5, // 50% off at home location
        DPKH: 0.25, // 25% off at other locations
        DPKR: 0.25,
      },

      // For DPKH members
      DPKH: {
        Science: 0.25,
        DPKH: 0.5, // 50% off at home location
        DPKR: 0.25,
      },

      // For DPKR members
      DPKR: {
        Science: 0.25,
        DPKH: 0.25,
        DPKR: 0.5, // 50% off at home location
      },

      // For Science+Kids members
      ScienceKids: {
        Science: 0.5,
        DPKH: 0.5,
        DPKR: 0.5, // 50% off at all locations with ScienceKids membership
      },
    },
  },

  /**
   * Discount Configurations
   *
   * Contains settings for promotional and special discounts
   */
  Discounts: {
    /**
     * Current membership discount promotion
     *
     * Controls eligibility and rates for promotional discounts
     */
    membershipDiscount: {
      minimumMembers: 3, // Minimum number of people required for discount
      eligibleLocations: ["Science", "DPKH", "ScienceKids"], // Eligible membership types
      currentRate: 0.2, // 20% discount
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-06-30"),

      // Display content for promotional banner
      promoBanner: {
        title: "20% Off Select Memberships!",
        description:
          "Discount applies to memberships with 3+ people at Discovery Place Science and Kids-Huntersville locations.",
      },
    },

    /**
     * Welcome Program configuration
     *
     * Special pricing for NC/SC EBT and WIC cardholders
     */
    welcomeProgram: {
      membershipPrice: 75, // Base price for Welcome Program membership
      maxPeople: 8, // Maximum number of people on a membership
      maxAdults: 2, // Maximum number of adults
      maxChildren: 6, // Maximum number of children
      singleVisitPrice: 3, // Per-person price for single visits
      maxSingleVisitGroup: 6, // Maximum group size for single visits (2 adults + 4 children)

      // Purchase links
      purchaseLinks: {
        Science:
          "https://visit.discoveryplace.org/science/events/36a58ae8-155d-8116-9188-7d0b6fae199c?tg=d99160b3-94fd-9362-978e-44607faf4b03",
        DPKH: "https://visit.discoveryplace.org/huntersville/events/7877bc4b-7702-fb6d-b750-01a851e506db?tg=a658b01e-6aba-c0ff-8e41-b14b70951408",
        DPKR: "https://visit.discoveryplace.org/rockingham/events/b3422931-4d69-406e-3cdc-39e7081a9f41?tg=bd6e1a77-669f-f280-3eaa-527526149c43",
      },

      // Information links
      infoLinks: {
        Science: "https://discoveryplace.org/visit/welcome-program/",
        DPKH: "https://discoveryplacekids.org/welcome-program/",
        DPKR: "https://dpkidsrockingham.org/welcome-program/",
      },

      // Eligibility requirements (for display purposes)
      eligibilityRequirements: [
        "Must be a current North Carolina or South Carolina EBT or WIC cardholder",
        "Must present valid ID and EBT/WIC card when purchasing or using membership",
        "Available for purchase online or at any Discovery Place location",
      ],
    },
  },

  /**
   * System Constraints
   *
   * Limits and constraints for the application
   */
  Constraints: {
    MAX_ADULTS: 6, // Maximum number of adults allowed
    MAX_CHILDREN: 8, // Maximum number of children allowed
    MAX_VISITS_PER_LOCATION: 20, // Maximum number of visits to calculate for a single location
    MAX_TOTAL_VISITS: 50, // Maximum total visits to calculate across all locations
  },

  /**
   * Location Information
   *
   * Details about each Discovery Place location
   */
  LocationInfo: {
    Science: {
      name: "Discovery Place Science",
      address: "301 N Tryon St, Charlotte, NC 28202",
      hours: "9:30 AM - 4:30 PM (Mon-Fri), 9:30 AM - 5:30 PM (Sat-Sun)",
      phone: "(704) 372-6261",
      coordinates: { lat: 35.229, lng: -80.839 },
      description:
        "Discovery Place Science offers interactive exhibits and innovative STEM programming that inspires learning for visitors of all ages.",
    },
    DPKH: {
      name: "Discovery Place Kids-Huntersville",
      address: "105 Gilead Rd, Huntersville, NC 28078",
      hours:
        "9:30 AM - 4:30 PM (Tue-Sat), 12:00 PM - 5:00 PM (Sun), Closed Monday",
      phone: "(704) 372-6261",
      coordinates: { lat: 35.41, lng: -80.858 },
      description:
        "Discovery Place Kids in Huntersville is a children's museum designed for kids 10 and under that encourages learning through play.",
    },
    DPKR: {
      name: "Discovery Place Kids-Rockingham",
      address: "233 E Washington St, Rockingham, NC 28379",
      hours:
        "9:30 AM - 4:30 PM (Tue-Sat), 12:00 PM - 5:00 PM (Sun), Closed Monday",
      phone: "(704) 372-6261",
      coordinates: { lat: 34.94, lng: -79.751 },
      description:
        "Discovery Place Kids in Rockingham offers playful learning experiences for children and families in Richmond County and surrounding areas.",
    },
  },

  /**
   * Membership Benefits
   *
   * Details about benefits included with each membership type
   */
  MembershipBenefits: {
    core: [
      "Unlimited free admission for all named members",
      "Discounted parking at Discovery Place Science ($8 flat rate)",
      "10% discount at museum stores and cafes",
      "Discounted tickets for special exhibitions and IMAX films",
      "Member-only events and exhibit previews",
      "Monthly e-newsletter with exclusive content",
    ],
    Science: [
      "50% off guest admission when accompanied by a member at Discovery Place Science",
      "25% off admission at other Discovery Place locations",
      "Reciprocal admission at over 300 science centers worldwide through ASTC Travel Passport Program (restrictions apply)",
    ],
    DPKH: [
      "50% off guest admission when accompanied by a member at Discovery Place Kids-Huntersville",
      "25% off admission at other Discovery Place locations",
      "Special member events and previews at Discovery Place Kids-Huntersville",
    ],
    DPKR: [
      "50% off guest admission when accompanied by a member at Discovery Place Kids-Rockingham",
      "25% off admission at other Discovery Place locations",
      "Special member events and previews at Discovery Place Kids-Rockingham",
    ],
    ScienceKids: [
      "Unlimited free admission to ALL Discovery Place locations for all named members",
      "50% off guest admission at all locations when accompanied by a member",
      "ASTC reciprocal benefits and special access to all Discovery Place locations",
      "Priority registration for camps and programs",
    ],
    Welcome: [
      "Reduced-price membership ($75) for 2 adults and up to 6 children",
      "Same core benefits as standard memberships",
      "$3 per person admission at other Discovery Place locations",
      "50% off fee-based educational programs",
    ],
  },
};

export default PricingConfig;
