// pricing/DiscountService.js
import { PricingConfig } from "./PricingConfig";

/**
 * Discount Service
 * Handles all discount-related operations including eligibility checks and price calculations
 */
export const DiscountService = {
  /**
   * Check if a membership is eligible for the current promotion discount
   * @param {number} memberCount - Number of family members
   * @param {string} location - Primary membership location
   * @param {string} membershipType - Type of membership (optional)
   * @returns {boolean} Whether the membership is eligible for discount
   */
  isEligibleForDiscount(memberCount, location, membershipType = null) {
    const { minimumMembers, eligibleLocations } =
      PricingConfig.Discounts.membershipDiscount;

    // Special case: Rockingham-only memberships are never eligible
    if (location === "DPKR") {
      return false;
    }

    // Special case: Science + Kids membership has its own eligibility rules
    if (membershipType === "ScienceKids" && memberCount >= minimumMembers) {
      return eligibleLocations.includes(location);
    }

    // Standard eligibility: minimum member count AND location is eligible
    return (
      memberCount >= minimumMembers && eligibleLocations.includes(location)
    );
  },

  /**
   * Apply membership discount if eligible
   * @param {number} originalPrice - Original membership price
   * @param {number} memberCount - Number of family members
   * @param {string} location - Primary membership location
   * @param {string} membershipType - Type of membership (optional)
   * @returns {number} Price after applicable discounts
   */
  applyDiscount(originalPrice, memberCount, location, membershipType = null) {
    if (this.isEligibleForDiscount(memberCount, location, membershipType)) {
      const { currentRate } = PricingConfig.Discounts.membershipDiscount;
      return Math.round(originalPrice * (1 - currentRate));
    }

    // Return original price if not eligible
    return originalPrice;
  },

  /**
   * Calculate guest admission price with membership discount
   * @param {number} regularPrice - Regular admission price
   * @param {string} memberLocation - Member's home location
   * @param {string} visitLocation - Location being visited
   * @returns {number} Discounted guest admission price
   */
  calculateGuestAdmission(regularPrice, memberLocation, visitLocation) {
    const { discountMap } = PricingConfig.GuestDiscounts;

    // Check if discount mapping exists
    if (
      !discountMap[memberLocation] ||
      !discountMap[memberLocation][visitLocation]
    ) {
      return regularPrice; // No applicable discount found
    }

    const discountRate = discountMap[memberLocation][visitLocation];
    return Math.round(regularPrice * (1 - discountRate));
  },

  /**
   * Calculate total guest admission savings for a visit pattern
   * @param {Object} options - Calculation options
   * @returns {Object} Guest savings calculation results
   */
  calculateGuestAdmissionSavings(options) {
    const {
      adultCount,
      childAges,
      scienceVisits,
      dpkhVisits,
      dpkrVisits,
      isRichmondResident,
      primaryLocation,
    } = options;

    const MAX_VISITS = PricingConfig.Constraints.MAX_VISITS_PER_LOCATION;
    const admissionPrices = PricingConfig.AdmissionPrices;
    const savingsBreakdown = [];
    let totalSavings = 0;

    // Calculate eligible children for each location
    const eligibleChildrenForScience = childAges.filter(
      (age) => age >= admissionPrices.Science.childAgeThreshold
    ).length;
    const eligibleChildrenForDPKH = childAges.filter(
      (age) => age >= admissionPrices.DPKH.childAgeThreshold
    ).length;
    const eligibleChildrenForDPKR = childAges.filter(
      (age) => age >= admissionPrices.DPKR.childAgeThreshold
    ).length;

    // Process Science visits
    const cappedScienceVisits = Math.min(scienceVisits, MAX_VISITS);
    if (cappedScienceVisits > 0) {
      const scienceDiscountRate = primaryLocation === "Science" ? 0.5 : 0.25;

      // Calculate adult savings
      const regularAdultSciencePrice = admissionPrices.Science.adult;
      const discountedAdultSciencePrice =
        regularAdultSciencePrice * (1 - scienceDiscountRate);
      const scienceAdultSaving =
        cappedScienceVisits *
        adultCount *
        (regularAdultSciencePrice - discountedAdultSciencePrice);

      // Calculate child savings
      const regularChildSciencePrice = admissionPrices.Science.child;
      const discountedChildSciencePrice =
        regularChildSciencePrice * (1 - scienceDiscountRate);
      const scienceChildSaving =
        cappedScienceVisits *
        eligibleChildrenForScience *
        (regularChildSciencePrice - discountedChildSciencePrice);

      // Total Science savings
      const scienceTotalSaving = scienceAdultSaving + scienceChildSaving;

      if (scienceTotalSaving > 0) {
        savingsBreakdown.push({
          label: `Science guest discounts (${Math.round(
            scienceDiscountRate * 100
          )}% off)`,
          cost: -scienceTotalSaving,
          details: `${cappedScienceVisits} visits × ${
            adultCount + eligibleChildrenForScience
          } people`,
          fullDetails: [
            {
              label: `Adult admission (${adultCount} × ${cappedScienceVisits} visits)`,
              saving: scienceAdultSaving,
            },
            {
              label: `Child admission (${eligibleChildrenForScience} × ${cappedScienceVisits} visits)`,
              saving: scienceChildSaving,
            },
          ],
        });

        totalSavings += scienceTotalSaving;
      }
    }

    // Process DPKH visits
    const cappedDPKHVisits = Math.min(dpkhVisits, MAX_VISITS);
    if (cappedDPKHVisits > 0) {
      const dpkhDiscountRate = primaryLocation === "DPKH" ? 0.5 : 0.25;

      // Calculate adult savings
      const regularAdultDPKHPrice = admissionPrices.DPKH.adult;
      const discountedAdultDPKHPrice =
        regularAdultDPKHPrice * (1 - dpkhDiscountRate);
      const dpkhAdultSaving =
        cappedDPKHVisits *
        adultCount *
        (regularAdultDPKHPrice - discountedAdultDPKHPrice);

      // Calculate child savings
      const regularChildDPKHPrice = admissionPrices.DPKH.child;
      const discountedChildDPKHPrice =
        regularChildDPKHPrice * (1 - dpkhDiscountRate);
      const dpkhChildSaving =
        cappedDPKHVisits *
        eligibleChildrenForDPKH *
        (regularChildDPKHPrice - discountedChildDPKHPrice);

      // Total DPKH savings
      const dpkhTotalSaving = dpkhAdultSaving + dpkhChildSaving;

      if (dpkhTotalSaving > 0) {
        savingsBreakdown.push({
          label: `Kids-Huntersville guest discounts (${Math.round(
            dpkhDiscountRate * 100
          )}% off)`,
          cost: -dpkhTotalSaving,
          details: `${cappedDPKHVisits} visits × ${
            adultCount + eligibleChildrenForDPKH
          } people`,
          fullDetails: [
            {
              label: `Adult admission (${adultCount} × ${cappedDPKHVisits} visits)`,
              saving: dpkhAdultSaving,
            },
            {
              label: `Child admission (${eligibleChildrenForDPKH} × ${cappedDPKHVisits} visits)`,
              saving: dpkhChildSaving,
            },
          ],
        });

        totalSavings += dpkhTotalSaving;
      }
    }

    // Process DPKR visits
    const cappedDPKRVisits = Math.min(dpkrVisits, MAX_VISITS);
    if (cappedDPKRVisits > 0) {
      const dpkrDiscountRate = primaryLocation === "DPKR" ? 0.5 : 0.25;

      // Get the appropriate prices based on Richmond residency
      const priceCategory = isRichmondResident ? "resident" : "standard";
      const regularAdultDPKRPrice = admissionPrices.DPKR[priceCategory].adult;
      const regularChildDPKRPrice = admissionPrices.DPKR[priceCategory].child;

      // Calculate discounted prices
      const discountedAdultDPKRPrice =
        regularAdultDPKRPrice * (1 - dpkrDiscountRate);
      const discountedChildDPKRPrice =
        regularChildDPKRPrice * (1 - dpkrDiscountRate);

      // Calculate savings
      const dpkrAdultSaving =
        cappedDPKRVisits *
        adultCount *
        (regularAdultDPKRPrice - discountedAdultDPKRPrice);
      const dpkrChildSaving =
        cappedDPKRVisits *
        eligibleChildrenForDPKR *
        (regularChildDPKRPrice - discountedChildDPKRPrice);
      const dpkrTotalSaving = dpkrAdultSaving + dpkrChildSaving;

      if (dpkrTotalSaving > 0) {
        savingsBreakdown.push({
          label: `Kids-Rockingham guest discounts (${Math.round(
            dpkrDiscountRate * 100
          )}% off)`,
          cost: -dpkrTotalSaving,
          details: `${cappedDPKRVisits} visits × ${
            adultCount + eligibleChildrenForDPKR
          } people`,
          fullDetails: [
            {
              label: `Adult admission (${adultCount} × ${cappedDPKRVisits} visits)`,
              saving: dpkrAdultSaving,
            },
            {
              label: `Child admission (${eligibleChildrenForDPKR} × ${cappedDPKRVisits} visits)`,
              saving: dpkrChildSaving,
            },
          ],
        });

        totalSavings += dpkrTotalSaving;
      }
    }

    return {
      total: totalSavings,
      breakdown: savingsBreakdown,
      primaryLocation: primaryLocation,
    };
  },

  /**
   * Get discount eligibility message
   * @param {number} memberCount - Number of family members
   * @param {string} location - Primary membership location
   * @param {string} membershipType - Type of membership (optional)
   * @returns {string} Eligibility message
   */
  getEligibilityMessage(memberCount, location, membershipType = null) {
    const { minimumMembers, currentRate } =
      PricingConfig.Discounts.membershipDiscount;
    const { discountMap } = PricingConfig.GuestDiscounts;
    const discountPercent = Math.round(currentRate * 100);

    if (!this.isEligibleForDiscount(memberCount, location, membershipType)) {
      if (memberCount < minimumMembers) {
        return `Not eligible for discount: requires ${minimumMembers} or more people.`;
      }
      if (location === "DPKR") {
        return "Not eligible for discount: Rockingham memberships do not qualify for the promotional discount.";
      }
      return "Not eligible for current discount.";
    }

    // Construct guest discount details
    const guestDiscountDetails = Object.entries(discountMap[location] || {})
      .map(([visitLocation, rate]) => {
        const discountPercentage = Math.round(rate * 100);
        return `${discountPercentage}% off at ${visitLocation}`;
      })
      .join(", ");

    return `Eligible for ${discountPercent}% membership discount! Guest admission benefits: ${guestDiscountDetails}.`;
  },

  /**
   * Get promotional banner text
   * @returns {Object} Banner title and description
   */
  getPromotionBanner() {
    const { currentRate, promoBanner } =
      PricingConfig.Discounts.membershipDiscount;

    return {
      title: promoBanner.title,
      description: promoBanner.description,
    };
  },

  /**
   * Calculate Welcome Program pricing
   * @param {Object} options - Welcome Program options
   * @returns {Object} Welcome program pricing details
   */
  calculateWelcomeProgramPricing(options) {
    const {
      people = 6,
      adultCount = 2,
      childrenCount = 4,
      type = "membership",
      location = "Science",
      scienceVisits = 0,
      dpkhVisits = 0,
      dpkrVisits = 0,
      includeParking = true,
    } = options;

    const welcomeConfig = PricingConfig.Discounts.welcomeProgram;
    const totalPeople = Math.min(people, welcomeConfig.maxPeople);

    // Get the appropriate purchase and info links
    const purchaseLink =
      welcomeConfig.purchaseLinks[location] ||
      welcomeConfig.purchaseLinks.Science;
    const infoLink =
      welcomeConfig.infoLinks[location] || welcomeConfig.infoLinks.Science;

    // Calculate parking costs for Science visits with Welcome Program
    const parkingCost = includeParking
      ? AdmissionCostCalculator.calculateParkingCost(scienceVisits, true)
      : 0;

    // Calculate cross-location visits (visits to locations other than the primary one)
    let crossLocationVisits = 0;
    if (location === "Science") {
      crossLocationVisits = dpkhVisits + dpkrVisits;
    } else if (location === "DPKH") {
      crossLocationVisits = scienceVisits + dpkrVisits;
    } else if (location === "DPKR") {
      crossLocationVisits = scienceVisits + dpkhVisits;
    }

    // Calculate cross-location admission costs ($3 per person per visit)
    const crossLocationCost =
      crossLocationVisits * totalPeople * welcomeConfig.singleVisitPrice;

    if (type === "membership") {
      // Welcome Membership
      const basePrice = welcomeConfig.membershipPrice;
      const totalPrice = basePrice + parkingCost + crossLocationCost;

      // Calculate what the cost would be with regular admission
      const regularAdmissionOptions = {
        adultCount,
        childrenCount,
        childAges: Array(childrenCount).fill(5), // Assume average child age of 5 for calculation
        scienceVisits,
        dpkhVisits,
        dpkrVisits,
        includeParking,
      };

      const regularAdmissionCost =
        AdmissionCostCalculator.calculateRegularAdmissionCost(
          regularAdmissionOptions
        );
      const savings = Math.max(0, regularAdmissionCost - totalPrice);
      const savingsPercentage =
        regularAdmissionCost > 0
          ? Math.min(90, Math.round((savings / regularAdmissionCost) * 100))
          : 0;

      return {
        basePrice: basePrice,
        parkingCost: parkingCost,
        crossLocationCost: crossLocationCost,
        totalPrice: totalPrice,
        location: location,
        locationLabel: this.getLocationLabel(location),
        maxPeople: welcomeConfig.maxPeople,
        peopleIncluded: totalPeople,
        type: "Welcome",
        bestMembershipType: "Welcome",
        bestMembershipLabel: `Discovery Place Welcome Program Membership (${this.getLocationLabel(
          location
        )})`,
        purchaseLink: purchaseLink,
        infoLink: infoLink,
        regularAdmissionCost: regularAdmissionCost,
        bestMembershipSavings: savings,
        savingsPercentage: savingsPercentage,
        iconType: "welcome",
        explanation: `Includes ${totalPeople} people (up to ${
          welcomeConfig.maxAdults
        } adults and ${
          welcomeConfig.maxChildren
        } children) with access to ${this.getLocationLabel(
          location
        )}. $3 admission per person at other locations.`,
        costBreakdown: {
          items: [
            {
              label: `Welcome Program Membership (${this.getLocationLabel(
                location
              )})`,
              cost: basePrice,
              details: `Annual membership for up to ${welcomeConfig.maxPeople} people`,
            },
            {
              label: "Parking at Science",
              cost: parkingCost,
              details:
                scienceVisits > 0
                  ? `${scienceVisits} visits × $8 per visit`
                  : null,
            },
            {
              label: "Cross-location Visits",
              cost: crossLocationCost,
              details:
                crossLocationVisits > 0
                  ? `${crossLocationVisits} visits × ${totalPeople} people × $3 per person`
                  : null,
            },
          ],
        },
      };
    } else {
      // Single-visit pricing (WelcomeAdmission)
      const includedPeople = Math.min(
        people,
        welcomeConfig.maxSingleVisitGroup
      );
      const singleVisitPrice = welcomeConfig.singleVisitPrice;
      const admissionCost = includedPeople * singleVisitPrice;
      const totalPrice =
        admissionCost +
        (includeParking && location === "Science"
          ? PricingConfig.ParkingRates.welcome
          : 0);

      return {
        pricePerPerson: singleVisitPrice,
        admissionCost: admissionCost,
        parkingCost:
          includeParking && location === "Science"
            ? PricingConfig.ParkingRates.welcome
            : 0,
        totalPrice: totalPrice,
        people: includedPeople,
        location: location,
        locationLabel: this.getLocationLabel(location),
        type: "WelcomeAdmission",
        bestMembershipType: "WelcomeAdmission",
        bestMembershipLabel: `Discovery Place Welcome Program Single Visit (${this.getLocationLabel(
          location
        )})`,
        purchaseLink: purchaseLink,
        infoLink: infoLink,
        iconType: "welcome",
        explanation: `${singleVisitPrice} per person for ${includedPeople} people. Includes same-day admission to ${this.getLocationLabel(
          location
        )}.`,
        costBreakdown: {
          items: [
            {
              label: `Welcome Program Admission (${this.getLocationLabel(
                location
              )})`,
              cost: admissionCost,
              details: `${includedPeople} people × ${singleVisitPrice} per person`,
            },
            {
              label: "Parking at Science",
              cost:
                includeParking && location === "Science"
                  ? PricingConfig.ParkingRates.welcome
                  : 0,
              details:
                includeParking && location === "Science"
                  ? `$8 flat rate`
                  : null,
            },
          ],
        },
      };
    }
  },

  /**
   * Get readable location label
   * @param {string} locationCode - Location code
   * @returns {string} Human-readable location label
   */
  getLocationLabel(locationCode) {
    const labels = {
      Science: "Discovery Place Science",
      DPKH: "Discovery Place Kids-Huntersville",
      DPKR: "Discovery Place Kids-Rockingham",
      ScienceKids: "All Discovery Place Locations",
    };

    return labels[locationCode] || locationCode;
  },
};

export default DiscountService;
