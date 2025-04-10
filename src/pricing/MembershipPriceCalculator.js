// pricing/MembershipPriceCalculator.js
import { PricingConfig } from "./PricingConfig";
import { DiscountService } from "./DiscountService";
import { AdmissionCostCalculator } from "./AdmissionCostCalculator";

/**
 * Membership Price Calculator
 * Handles calculations related to membership pricing and recommendations
 */
export const MembershipPriceCalculator = {
  /**
   * Get base membership price
   * @param {string} type - Membership type
   * @param {number} memberCount - Number of family members
   * @returns {number} Base price for the membership
   */
  getMembershipPrice(type, memberCount) {
    // Add input validation
    if (memberCount <= 0) return 0;

    // Cap memberCount to avoid array out-of-bounds
    memberCount = Math.min(
      memberCount,
      PricingConfig.MembershipPrices[type].length
    );

    // Special case: DPKH, DPKR, and ScienceKids don't offer 1-person memberships
    if (["DPKH", "DPKR", "ScienceKids"].includes(type) && memberCount === 1) {
      // Return the 2-person price
      return PricingConfig.MembershipPrices[type][1];
    }

    return PricingConfig.MembershipPrices[type][memberCount - 1];
  },

  /**
   * Calculate comprehensive membership costs and determine recommendation
   * @param {Object} options - Calculation options
   * @returns {Object} Detailed membership calculation results
   */
  calculateMembershipCosts(options) {
    const {
      adultCount,
      childrenCount,
      childAges,
      scienceVisits,
      dpkhVisits,
      dpkrVisits,
      isRichmondResident = false,
      needsFlexibility = false,
      isWelcomeEligible = false,
      includeParking = true,
    } = options;

    // Calculate eligible family members
    const eligibleChildrenCount = childAges.filter((age) => age >= 2).length;
    const totalFamilyMembers = Math.min(
      PricingConfig.Constraints.MAX_ADULTS +
        PricingConfig.Constraints.MAX_CHILDREN,
      adultCount + eligibleChildrenCount
    );

    // Determine primary location
    const primaryLocation = AdmissionCostCalculator.determinePrimaryLocation(
      scienceVisits,
      dpkhVisits,
      dpkrVisits
    );

    // Calculate guest admission savings with detailed breakdown
    const guestAdmissionSavingsData =
      DiscountService.calculateGuestAdmissionSavings({
        adultCount,
        childAges,
        scienceVisits,
        dpkhVisits,
        dpkrVisits,
        isRichmondResident,
        primaryLocation,
      });

    const guestAdmissionSavings = guestAdmissionSavingsData.total;
    const guestSavingsBreakdown = guestAdmissionSavingsData.breakdown;

    // Cap visits
    const cappedScienceVisits = Math.min(
      scienceVisits,
      PricingConfig.Constraints.MAX_VISITS_PER_LOCATION
    );
    const cappedDpkhVisits = Math.min(
      dpkhVisits,
      PricingConfig.Constraints.MAX_VISITS_PER_LOCATION
    );
    const cappedDpkrVisits = Math.min(
      dpkrVisits,
      PricingConfig.Constraints.MAX_VISITS_PER_LOCATION
    );

    const totalVisits = AdmissionCostCalculator.countTotalVisits(
      scienceVisits,
      dpkhVisits,
      dpkrVisits
    );

    // Calculate regular admission cost (what they would pay without membership)
    const regularAdmissionCost =
      AdmissionCostCalculator.calculateRegularAdmissionCost({
        adultCount,
        childAges,
        scienceVisits,
        dpkhVisits,
        dpkrVisits,
        isRichmondResident,
        includeParking,
      });

    // Calculate membership costs for different options
    const scienceMembershipCost = this.getMembershipPrice(
      "Science",
      totalFamilyMembers
    );
    const dpkhMembershipCost = this.getMembershipPrice(
      "DPKH",
      totalFamilyMembers
    );
    const dpkrMembershipCost = this.getMembershipPrice(
      "DPKR",
      totalFamilyMembers
    );
    const scienceKidsMembershipCost = this.getMembershipPrice(
      "ScienceKids",
      totalFamilyMembers
    );

    // Check if Rockingham-only (no visits to other locations)
    const isRockinghamOnlyMembership =
      primaryLocation === "DPKR" && dpkhVisits === 0 && scienceVisits === 0;

    // Apply promotional discounts if eligible
    const scienceMembershipPromoCost = DiscountService.applyDiscount(
      scienceMembershipCost,
      totalFamilyMembers,
      "Science"
    );

    const dpkhMembershipPromoCost = DiscountService.applyDiscount(
      dpkhMembershipCost,
      totalFamilyMembers,
      "DPKH"
    );

    const dpkrMembershipPromoCost = DiscountService.applyDiscount(
      dpkrMembershipCost,
      totalFamilyMembers,
      "DPKR"
    );

    const scienceKidsPromoCost = DiscountService.applyDiscount(
      scienceKidsMembershipCost,
      totalFamilyMembers,
      primaryLocation,
      "ScienceKids"
    );

    // Check discount eligibility for each membership type
    const scienceDiscountEligible = DiscountService.isEligibleForDiscount(
      totalFamilyMembers,
      "Science"
    );

    const dpkhDiscountEligible = DiscountService.isEligibleForDiscount(
      totalFamilyMembers,
      "DPKH"
    );

    const dpkrDiscountEligible = false; // Rockingham memberships never eligible

    const scienceKidsDiscountEligible = DiscountService.isEligibleForDiscount(
      totalFamilyMembers,
      primaryLocation,
      "ScienceKids"
    );

    // Calculate parking costs
    const parkingCost = includeParking
      ? AdmissionCostCalculator.calculateParkingCost(cappedScienceVisits, true)
      : 0;

    // Calculate cross-location costs for each membership type
    // For Science membership - calculate discounted costs for DPKH and DPKR
    let scienceCrossLocationCosts = this.calculateCrossLocationCosts({
      adultCount,
      childAges,
      membershipType: "Science",
      scienceVisits: 0, // Don't include visits to home location
      dpkhVisits: cappedDpkhVisits,
      dpkrVisits: cappedDpkrVisits,
      isRichmondResident,
    });

    // For DPKH membership - calculate discounted costs for Science and DPKR
    let dpkhCrossLocationCosts = this.calculateCrossLocationCosts({
      adultCount,
      childAges,
      membershipType: "DPKH",
      scienceVisits: cappedScienceVisits,
      dpkhVisits: 0, // Don't include visits to home location
      dpkrVisits: cappedDpkrVisits,
      isRichmondResident,
    });

    // For DPKR membership - calculate discounted costs for Science and DPKH
    let dpkrCrossLocationCosts = this.calculateCrossLocationCosts({
      adultCount,
      childAges,
      membershipType: "DPKR",
      scienceVisits: cappedScienceVisits,
      dpkhVisits: cappedDpkhVisits,
      dpkrVisits: 0, // Don't include visits to home location
      isRichmondResident,
    });

    // ScienceKids membership has no cross-location costs (covers all locations)
    let scienceKidsCrossLocationCosts = 0;

    // Calculate total costs for all membership types (with parking and cross-location costs)
    const scienceTotalCost =
      scienceMembershipPromoCost + parkingCost + scienceCrossLocationCosts;
    const dpkhTotalCost =
      dpkhMembershipPromoCost + parkingCost + dpkhCrossLocationCosts;
    const dpkrTotalCost =
      dpkrMembershipPromoCost + parkingCost + dpkrCrossLocationCosts;
    const scienceKidsTotalCost = scienceKidsPromoCost + parkingCost;

    // Replacement code for the Welcome Program selection section

    // Calculate Welcome Program costs if eligible
    let welcomeProgramOption = null;
    if (isWelcomeEligible) {
      welcomeProgramOption = DiscountService.calculateWelcomeProgramPricing({
        people: adultCount + childrenCount,
        adultCount,
        childrenCount,
        type: "membership",
        location: primaryLocation,
        scienceVisits,
        dpkhVisits,
        dpkrVisits,
        includeParking,
      });

      // Compare Welcome Program with best option purely on cost
      if (
        welcomeProgramOption &&
        welcomeProgramOption.totalPrice < bestOption.cost
      ) {
        bestOption = {
          type: "Welcome",
          cost: welcomeProgramOption.totalPrice,
          baseCost: welcomeProgramOption.basePrice,
          discountedCost: welcomeProgramOption.basePrice, // No additional discount
          isDiscountEligible: false,
          parkingCost: welcomeProgramOption.parkingCost,
          crossLocationCosts: welcomeProgramOption.crossLocationCost,
          description: `Discovery Place Welcome Program Membership for ${welcomeProgramOption.locationLabel}`,
          welcomeDetails: welcomeProgramOption,
        };
      }
    }

    // Initialize with Science option
    let bestOption = {
      type: "Science",
      cost: scienceTotalCost,
      baseCost: scienceMembershipCost,
      discountedCost: scienceMembershipPromoCost,
      isDiscountEligible: scienceDiscountEligible,
      parkingCost: parkingCost,
      crossLocationCosts: scienceCrossLocationCosts,
      description: `Discovery Place Science Membership with ${
        scienceDiscountEligible ? "20% discount" : "no discount"
      }`,
    };

    // Compare with DPKH option and update if better
    if (dpkhTotalCost < bestOption.cost) {
      bestOption = {
        type: "DPKH",
        cost: dpkhTotalCost,
        baseCost: dpkhMembershipCost,
        discountedCost: dpkhMembershipPromoCost,
        isDiscountEligible: dpkhDiscountEligible,
        parkingCost: parkingCost,
        crossLocationCosts: dpkhCrossLocationCosts,
        description: `Discovery Place Kids-Huntersville Membership with ${
          dpkhDiscountEligible ? "20% discount" : "no discount"
        }`,
      };
    }

    // Compare with DPKR option and update if better (only if they visit DPKR)
    if (
      dpkrTotalCost < bestOption.cost &&
      (dpkrVisits > 0 || isRockinghamOnlyMembership)
    ) {
      bestOption = {
        type: "DPKR",
        cost: dpkrTotalCost,
        baseCost: dpkrMembershipCost,
        discountedCost: dpkrMembershipPromoCost,
        isDiscountEligible: dpkrDiscountEligible,
        parkingCost: parkingCost,
        crossLocationCosts: dpkrCrossLocationCosts,
        description: `Discovery Place Kids-Rockingham Membership with ${
          dpkrDiscountEligible ? "20% discount" : "no discount"
        }`,
      };
    }

    // Compare with Science+Kids option and update if better
    if (scienceKidsTotalCost < bestOption.cost) {
      bestOption = {
        type: "ScienceKids",
        cost: scienceKidsTotalCost,
        baseCost: scienceKidsMembershipCost,
        discountedCost: scienceKidsPromoCost,
        isDiscountEligible: scienceKidsDiscountEligible,
        parkingCost: parkingCost,
        crossLocationCosts: 0,
        description: `Discovery Place Science + Kids Membership with ${
          scienceKidsDiscountEligible ? "20% discount" : "no discount"
        }`,
      };
    }

    // Consider Welcome Program if eligible
    if (isWelcomeEligible && welcomeProgramOption) {
      // If Welcome Program is significantly cheaper
      if (welcomeProgramOption.totalPrice < bestOption.cost * 0.8) {
        // If it's at least 20% cheaper
        bestOption = {
          type: "Welcome",
          cost: welcomeProgramOption.totalPrice,
          baseCost: welcomeProgramOption.basePrice,
          discountedCost: welcomeProgramOption.basePrice, // No additional discount
          isDiscountEligible: false,
          parkingCost: welcomeProgramOption.parkingCost,
          crossLocationCosts: welcomeProgramOption.crossLocationCost,
          description: `Discovery Place Welcome Program Membership for ${welcomeProgramOption.locationLabel}`,
          welcomeDetails: welcomeProgramOption,
        };
      }
    }

    // For very few visits, regular admission might be best
    if (totalVisits <= 3) {
      if (regularAdmissionCost < bestOption.cost) {
        bestOption = {
          type: "PayAsYouGo",
          cost: regularAdmissionCost,
          baseCost: regularAdmissionCost,
          discountedCost: regularAdmissionCost,
          isDiscountEligible: false,
          parkingCost: includeParking
            ? AdmissionCostCalculator.calculateParkingCost(
                cappedScienceVisits,
                false
              )
            : 0,
          crossLocationCosts: 0,
          description: `Pay As You Go (Regular Admission)`,
        };
      }
    }

    // Get membership details
    const membershipDetails = this.getMembershipDetails(bestOption.type);

    // Build cost breakdown items - Include cross-location costs in the breakdown
    let costBreakdownItems = [];

    if (bestOption.type === "Welcome" && bestOption.welcomeDetails) {
      // Use the Welcome Program breakdown
      costBreakdownItems = bestOption.welcomeDetails.costBreakdown.items;
    } else if (bestOption.type === "PayAsYouGo") {
      // Regular admission breakdown
      costBreakdownItems = [
        {
          label: "Regular Admission",
          cost:
            regularAdmissionCost -
            (includeParking
              ? AdmissionCostCalculator.calculateParkingCost(
                  cappedScienceVisits,
                  false
                )
              : 0),
          details: `${totalVisits} total visits`,
        },
      ];

      if (includeParking && cappedScienceVisits > 0) {
        costBreakdownItems.push({
          label: "Parking at Science",
          cost: AdmissionCostCalculator.calculateParkingCost(
            cappedScienceVisits,
            false
          ),
          details: `${cappedScienceVisits} visits × $18 per visit`,
        });
      }
    } else {
      // Standard membership breakdown
      costBreakdownItems = [
        {
          label: `${membershipDetails.label}`,
          cost: bestOption.discountedCost,
          details: bestOption.isDiscountEligible
            ? `Original price: $${bestOption.baseCost}, after ${Math.round(
                PricingConfig.Discounts.membershipDiscount.currentRate * 100
              )}% discount`
            : null,
        },
      ];

      if (includeParking && cappedScienceVisits > 0) {
        costBreakdownItems.push({
          label: "Parking at Science",
          cost: parkingCost,
          details: `${cappedScienceVisits} visits × $8 per visit`,
        });
      }

      // Add cross-location costs if any
      if (bestOption.crossLocationCosts > 0) {
        // Determine which locations are not covered by the membership
        let crossLocations = [];
        if (bestOption.type === "Science") {
          if (cappedDpkhVisits > 0)
            crossLocations.push({
              name: "Kids-Huntersville",
              visits: cappedDpkhVisits,
            });
          if (cappedDpkrVisits > 0)
            crossLocations.push({
              name: "Kids-Rockingham",
              visits: cappedDpkrVisits,
            });
        } else if (bestOption.type === "DPKH") {
          if (cappedScienceVisits > 0)
            crossLocations.push({
              name: "Science",
              visits: cappedScienceVisits,
            });
          if (cappedDpkrVisits > 0)
            crossLocations.push({
              name: "Kids-Rockingham",
              visits: cappedDpkrVisits,
            });
        } else if (bestOption.type === "DPKR") {
          if (cappedScienceVisits > 0)
            crossLocations.push({
              name: "Science",
              visits: cappedScienceVisits,
            });
          if (cappedDpkhVisits > 0)
            crossLocations.push({
              name: "Kids-Huntersville",
              visits: cappedDpkhVisits,
            });
        }

        // Create a description of the cross-location visits
        let crossLocationDetails = crossLocations
          .map((loc) => `${loc.visits} visits to ${loc.name}`)
          .join(", ");

        costBreakdownItems.push({
          label: "Cross-Location Admission (Member Discounted)",
          cost: bestOption.crossLocationCosts,
          details: crossLocationDetails,
        });
      }
    }

    // Add guest savings breakdown items separately - don't subtract from cost
    const savingsBreakdownItems = guestSavingsBreakdown;

    // Calculate total savings compared to regular admission
    const totalSavings = Math.max(0, regularAdmissionCost - bestOption.cost);

    // Calculate savings percentage
    const savingsPercentage =
      regularAdmissionCost > 0
        ? Math.min(90, Math.round((totalSavings / regularAdmissionCost) * 100))
        : 0;

    // Build the explanation text based on membership type
    let explanation = "";
    if (bestOption.type === "Welcome") {
      explanation = bestOption.welcomeDetails.explanation;
    } else if (bestOption.type === "PayAsYouGo") {
      explanation = `With ${totalVisits} total visits planned, regular admission is your most economical option.`;
    } else if (bestOption.type === "ScienceKids") {
      explanation = `With ${totalVisits} total visits planned across multiple locations, a Science + Kids membership offers the best value and flexibility. Includes admission to all Discovery Place locations and $8 flat-rate parking at Science.`;
    } else {
      // For single-location membership, include information about cross-location costs
      if (bestOption.crossLocationCosts > 0) {
        explanation = `With ${totalVisits} total visits planned, a membership to ${
          membershipDetails.label
        } offers good value. Includes $8 flat-rate parking at Science${
          bestOption.type !== "Science" ? " when you visit" : ""
        } and discounted admission to other locations.`;
      } else {
        explanation = `With ${totalVisits} total visits planned, a membership to ${
          membershipDetails.label
        } offers excellent value. Includes $8 flat-rate parking at Science${
          bestOption.type !== "Science" ? " when you visit" : ""
        }.`;
      }
    }

    // Build the complete result object
    const result = {
      baseMembershipPrice: bestOption.baseCost,
      baseMembershipDiscount: bestOption.discountedCost,
      bestMembershipPromoCost: bestOption.cost,
      bestMembershipType: bestOption.type,
      bestMembershipLabel: membershipDetails.label,
      discountEligible: bestOption.isDiscountEligible,
      additionalCosts: [
        ...(bestOption.parkingCost > 0
          ? [{ label: "Parking at Science", cost: bestOption.parkingCost }]
          : []),
        ...(bestOption.crossLocationCosts > 0
          ? [
              {
                label: "Cross-Location Admission",
                cost: bestOption.crossLocationCosts,
              },
            ]
          : []),
      ],
      costBreakdown: {
        items: costBreakdownItems,
        guestSavingsDetails: guestSavingsBreakdown.flatMap(
          (item) => item.fullDetails || []
        ),
      },
      savingsBreakdown: savingsBreakdownItems,
      bestMembershipSavings: totalSavings,
      savingsPercentage: savingsPercentage,
      bestMembershipExplanation: explanation,
      iconType: membershipDetails.iconType,
      primaryLocation: primaryLocation,
      totalVisits: totalVisits,
      totalFamilyMembers: totalFamilyMembers,
      scienceDiscountEligible: scienceDiscountEligible,
      dpkhDiscountEligible: dpkhDiscountEligible,
      dpkrDiscountEligible: dpkrDiscountEligible,
      scienceKidsDiscountEligible: scienceKidsDiscountEligible,
      purchaseLink:
        bestOption.type === "Welcome" && bestOption.welcomeDetails
          ? bestOption.welcomeDetails.purchaseLink
          : membershipDetails.purchaseLink,
      isWelcomeEligible: isWelcomeEligible,
      welcomeProgramOption: isWelcomeEligible ? welcomeProgramOption : null,
      regularAdmissionCost: regularAdmissionCost,
      guestAdmissionSavings: guestAdmissionSavings,
      crossLocationCosts: bestOption.crossLocationCosts || 0,
    };

    return result;
  },

  /**
   * Calculate costs for cross-location visits (visits to locations not covered by primary membership)
   * @param {Object} options - Calculation options
   * @returns {number} Total cross-location costs with member discounts applied
   */
  calculateCrossLocationCosts(options) {
    const {
      adultCount,
      childAges,
      membershipType,
      scienceVisits,
      dpkhVisits,
      dpkrVisits,
      isRichmondResident,
    } = options;

    let totalCost = 0;

    // Get the discount rates based on membership type
    const discountMap =
      PricingConfig.GuestDiscounts.discountMap[membershipType] || {};

    // Admission prices
    const admissionPrices = PricingConfig.AdmissionPrices;

    // Count eligible children by age
    const eligibleChildrenForScience = childAges.filter(
      (age) => age >= admissionPrices.Science.childAgeThreshold
    ).length;
    const eligibleChildrenForDPKH = childAges.filter(
      (age) => age >= admissionPrices.DPKH.childAgeThreshold
    ).length;
    const eligibleChildrenForDPKR = childAges.filter(
      (age) => age >= admissionPrices.DPKR.childAgeThreshold
    ).length;

    // Calculate Science visit costs with member discount
    if (scienceVisits > 0 && discountMap.Science) {
      const discountRate = discountMap.Science;
      const adultPrice = admissionPrices.Science.adult * (1 - discountRate);
      const childPrice = admissionPrices.Science.child * (1 - discountRate);

      totalCost += adultCount * scienceVisits * adultPrice;
      totalCost += eligibleChildrenForScience * scienceVisits * childPrice;
    }

    // Calculate DPKH visit costs with member discount
    if (dpkhVisits > 0 && discountMap.DPKH) {
      const discountRate = discountMap.DPKH;
      const adultPrice = admissionPrices.DPKH.adult * (1 - discountRate);
      const childPrice = admissionPrices.DPKH.child * (1 - discountRate);

      totalCost += adultCount * dpkhVisits * adultPrice;
      totalCost += eligibleChildrenForDPKH * dpkhVisits * childPrice;
    }

    // Calculate DPKR visit costs with member discount
    if (dpkrVisits > 0 && discountMap.DPKR) {
      const discountRate = discountMap.DPKR;
      const priceCategory = isRichmondResident ? "resident" : "standard";
      const adultPrice =
        admissionPrices.DPKR[priceCategory].adult * (1 - discountRate);
      const childPrice =
        admissionPrices.DPKR[priceCategory].child * (1 - discountRate);

      totalCost += adultCount * dpkrVisits * adultPrice;
      totalCost += eligibleChildrenForDPKR * dpkrVisits * childPrice;
    }

    return Math.round(totalCost);
  },

  /**
   * Get membership details for a specific type
   * @param {string} membershipType - Membership type code
   * @returns {Object} Membership details
   */
  getMembershipDetails(membershipType) {
    const details = {
      Science: {
        label: "Discovery Place Science Membership",
        iconType: "science",
        purchaseLink:
          "https://visit.discoveryplace.org/science/events/36a58ae8-155d-8116-9188-7d0b6fae199c",
        description:
          "Access to Discovery Place Science for all named members, plus guest discounts at other locations",
      },
      ScienceBasic: {
        label: "Discovery Place Science Basic Membership",
        iconType: "science-basic",
        purchaseLink:
          "https://visit.discoveryplace.org/science/events/36a58ae8-155d-8116-9188-7d0b6fae199c",
        description:
          "Access to Discovery Place Science for one adult, with 50% off guest admission for family members",
      },
      DPKH: {
        label: "Discovery Place Kids-Huntersville Membership",
        iconType: "kids-huntersville",
        purchaseLink:
          "https://visit.discoveryplace.org/huntersville/events/7877bc4b-7702-fb6d-b750-01a851e506db",
        description:
          "Access to Discovery Place Kids-Huntersville for all named members, plus guest discounts at other locations",
      },
      DPKHBasic: {
        label: "Discovery Place Kids-Huntersville Basic Membership",
        iconType: "kids-huntersville-basic",
        purchaseLink:
          "https://visit.discoveryplace.org/huntersville/events/7877bc4b-7702-fb6d-b750-01a851e506db",
        description:
          "Access to Discovery Place Kids-Huntersville for one adult and one child, with 50% off guest admission for other family members",
      },
      DPKR: {
        label: "Discovery Place Kids-Rockingham Membership",
        iconType: "kids-rockingham",
        purchaseLink:
          "https://visit.discoveryplace.org/rockingham/events/b3422931-4d69-406e-3cdc-39e7081a9f41",
        description:
          "Access to Discovery Place Kids-Rockingham for all named members, plus guest discounts at other locations",
      },
      DPKRBasic: {
        label: "Discovery Place Kids-Rockingham Basic Membership",
        iconType: "kids-rockingham-basic",
        purchaseLink:
          "https://visit.discoveryplace.org/rockingham/events/b3422931-4d69-406e-3cdc-39e7081a9f41",
        description:
          "Access to Discovery Place Kids-Rockingham for one adult and one child, with 50% off guest admission for other family members",
      },
      ScienceKids: {
        label: "Discovery Place Science + Kids Membership",
        iconType: "science-kids",
        purchaseLink:
          "https://visit.discoveryplace.org/science/events/36a58ae8-155d-8116-9188-7d0b6fae199c",
        description:
          "Access to all Discovery Place locations for all named members",
      },
      Welcome: {
        label: "Discovery Place Welcome Program Membership",
        iconType: "welcome",
        purchaseLink:
          "https://visit.discoveryplace.org/science/events/36a58ae8-155d-8116-9188-7d0b6fae199c?tg=d99160b3-94fd-9362-978e-44607faf4b03",
        description:
          "Discounted membership program for NC/SC EBT/WIC cardholders, with access to one Discovery Place location",
      },
      WelcomeAdmission: {
        label: "Discovery Place Welcome Program Admission",
        iconType: "welcome",
        purchaseLink:
          "https://visit.discoveryplace.org/science/events/36a58ae8-155d-8116-9188-7d0b6fae199c?tg=d99160b3-94fd-9362-978e-44607faf4b03",
        description:
          "$3 per person admission for NC/SC EBT/WIC cardholders and their guests (up to 6 people)",
      },
      PayAsYouGo: {
        label: "Pay As You Go (Regular Admission)",
        iconType: "ticket",
        purchaseLink: "https://discoveryplace.org/visit/buy-tickets/",
        description: "Regular admission tickets purchased for each visit",
      },
    };

    return details[membershipType] || details["Science"];
  },

  /**
   * Determine best membership type based on visit pattern and family composition
   * @param {Object} options - Calculation options
   * @returns {string} Best membership type code
   */
  determineBestMembershipType(options) {
    // NOTE: This method is maintained for backward compatibility
    // The actual decision logic is now entirely in calculateMembershipCosts
    // based on pure cost comparison

    const {
      scienceVisits,
      dpkhVisits,
      dpkrVisits,
      totalFamilyMembers,
      needsFlexibility = false,
    } = options;

    const totalVisits = scienceVisits + dpkhVisits + dpkrVisits;

    // For very few visits, recommend pay-as-you-go
    if (totalVisits <= 3) {
      return "PayAsYouGo";
    }

    // For Rockingham-only visits
    if (dpkrVisits > 0 && scienceVisits === 0 && dpkhVisits === 0) {
      return "DPKR";
    }

    // For significant visits to multiple locations
    if (
      scienceVisits > 0 &&
      (dpkhVisits > 0 || dpkrVisits > 0) &&
      totalVisits >= 10
    ) {
      return "ScienceKids";
    }

    // For primarily Science visits
    if (scienceVisits >= dpkhVisits && scienceVisits >= dpkrVisits) {
      return totalFamilyMembers <= 2 && !needsFlexibility
        ? "ScienceBasic"
        : "Science";
    }

    // For primarily DPKH visits
    if (dpkhVisits >= scienceVisits && dpkhVisits >= dpkrVisits) {
      return totalFamilyMembers <= 2 && !needsFlexibility
        ? "DPKHBasic"
        : "DPKH";
    }

    // For primarily DPKR visits
    return totalFamilyMembers <= 2 && !needsFlexibility ? "DPKRBasic" : "DPKR";
  },
};

export default MembershipPriceCalculator;
