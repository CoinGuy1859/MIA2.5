// pricing/AdmissionCostCalculator.js
import { PricingConfig } from "./PricingConfig";

/**
 * Admission Cost Calculator
 * Handles calculations related to general admission costs
 * Optimized for readability, maintainability, and edge case handling
 */
export const AdmissionCostCalculator = {
  /**
   * Calculate admission cost for a single visit to a specific location
   * @param {Object} options - Calculation options
   * @returns {number} Total admission cost for one visit
   */
  calculateSingleVisitCost(options) {
    const {
      location,
      adultCount = 0,
      childAges = [],
      isRichmondResident = false,
    } = options;

    // Input validation
    if (!location || adultCount < 0 || !Array.isArray(childAges)) {
      console.error("Invalid input to calculateSingleVisitCost");
      return 0;
    }

    // Get location pricing data
    const locationPrices = this.getLocationPrices(location);
    if (!locationPrices) return 0;

    // Count eligible children based on age thresholds
    const eligibleChildrenCount = this.countEligibleChildren(
      childAges,
      locationPrices.childAgeThreshold
    );

    // Get appropriate pricing based on location and residency
    const { adultPrice, childPrice } = this.getPricing(
      location,
      locationPrices,
      isRichmondResident
    );

    // Calculate and return total cost
    return adultCount * adultPrice + eligibleChildrenCount * childPrice;
  },

  /**
   * Get pricing data for a specific location
   * @param {string} location - Location code
   * @returns {Object|null} Location pricing data or null if invalid
   */
  getLocationPrices(location) {
    const locationPrices = PricingConfig.AdmissionPrices[location];

    if (!locationPrices) {
      console.error(`Invalid location: ${location}`);
      return null;
    }

    return locationPrices;
  },

  /**
   * Count eligible children based on age threshold
   * @param {Array} childAges - Array of child ages
   * @param {number} ageThreshold - Minimum age for paid admission
   * @returns {number} Count of eligible children
   */
  countEligibleChildren(childAges, ageThreshold) {
    if (!Array.isArray(childAges)) return 0;

    return childAges.filter(
      (age) => typeof age === "number" && age >= ageThreshold
    ).length;
  },

  /**
   * Get appropriate pricing based on location and residency
   * @param {string} location - Location code
   * @param {Object} locationPrices - Location pricing data
   * @param {boolean} isRichmondResident - Whether visitor is Richmond resident
   * @returns {Object} Adult and child prices
   */
  getPricing(location, locationPrices, isRichmondResident) {
    // Handle special case for Rockingham with resident pricing
    if (location === "DPKR") {
      const priceCategory = isRichmondResident ? "resident" : "standard";
      return {
        adultPrice: locationPrices[priceCategory].adult,
        childPrice: locationPrices[priceCategory].child,
      };
    }

    // Standard pricing for other locations
    return {
      adultPrice: locationPrices.adult,
      childPrice: locationPrices.child,
    };
  },

  /**
   * Calculate total admission costs across all locations for a year
   * @param {Object} options - Calculation options
   * @returns {number} Total regular admission cost
   */
  calculateRegularAdmissionCost(options) {
    const {
      adultCount = 0,
      childAges = [],
      scienceVisits = 0,
      dpkhVisits = 0,
      dpkrVisits = 0,
      isRichmondResident = false,
      includeParking = true,
    } = options;

    // Input validation
    if (
      adultCount < 0 ||
      !Array.isArray(childAges) ||
      scienceVisits < 0 ||
      dpkhVisits < 0 ||
      dpkrVisits < 0
    ) {
      console.error("Invalid input to calculateRegularAdmissionCost");
      return 0;
    }

    // Get constraints from configuration
    const MAX_VISITS_PER_LOCATION =
      PricingConfig.Constraints.MAX_VISITS_PER_LOCATION;
    const MAX_TOTAL_VISITS = PricingConfig.Constraints.MAX_TOTAL_VISITS;

    // Cap visits to maximum limits
    const cappedScienceVisits = this.capVisits(
      scienceVisits,
      MAX_VISITS_PER_LOCATION
    );
    const cappedDpkhVisits = this.capVisits(
      dpkhVisits,
      MAX_VISITS_PER_LOCATION
    );
    const cappedDpkrVisits = this.capVisits(
      dpkrVisits,
      MAX_VISITS_PER_LOCATION
    );

    // Calculate costs for each location
    const costsByLocation = this.calculateCostsByLocation({
      adultCount,
      childAges,
      scienceVisits: cappedScienceVisits,
      dpkhVisits: cappedDpkhVisits,
      dpkrVisits: cappedDpkrVisits,
      isRichmondResident,
    });

    // Add parking costs if requested
    const parkingCost = includeParking
      ? this.calculateParkingCost(cappedScienceVisits, false)
      : 0;

    // Sum up all costs
    const totalCost =
      Object.values(costsByLocation).reduce((sum, cost) => sum + cost, 0) +
      parkingCost;

    // Apply a reasonable maximum cap based on total visits
    const totalVisits = Math.min(
      MAX_TOTAL_VISITS,
      cappedScienceVisits + cappedDpkhVisits + cappedDpkrVisits
    );

    // Log calculation details for debugging
    this.logCalculationDetails(costsByLocation, parkingCost, totalCost);

    // Return the calculated total cost
    return totalCost;
  },

  /**
   * Cap visits to a maximum value
   * @param {number} visits - Number of visits
   * @param {number} maxVisits - Maximum allowed visits
   * @returns {number} Capped visits
   */
  capVisits(visits, maxVisits) {
    return Math.min(Math.max(0, visits), maxVisits);
  },

  /**
   * Calculate admission costs for each location
   * @param {Object} options - Calculation options
   * @returns {Object} Costs by location
   */
  calculateCostsByLocation(options) {
    const {
      adultCount,
      childAges,
      scienceVisits,
      dpkhVisits,
      dpkrVisits,
      isRichmondResident,
    } = options;

    const scienceCost =
      scienceVisits > 0
        ? this.calculateSingleVisitCost({
            location: "Science",
            adultCount,
            childAges,
            isRichmondResident,
          }) * scienceVisits
        : 0;

    const dpkhCost =
      dpkhVisits > 0
        ? this.calculateSingleVisitCost({
            location: "DPKH",
            adultCount,
            childAges,
            isRichmondResident,
          }) * dpkhVisits
        : 0;

    const dpkrCost =
      dpkrVisits > 0
        ? this.calculateSingleVisitCost({
            location: "DPKR",
            adultCount,
            childAges,
            isRichmondResident,
          }) * dpkrVisits
        : 0;

    return {
      scienceCost,
      dpkhCost,
      dpkrCost,
    };
  },

  /**
   * Log calculation details for debugging
   * @param {Object} costsByLocation - Costs by location
   * @param {number} parkingCost - Parking cost
   * @param {number} totalCost - Total cost
   */
  logCalculationDetails(costsByLocation, parkingCost, totalCost) {
    console.log("Regular admission calculation:");
    console.log("Science visits cost:", costsByLocation.scienceCost);
    console.log("DPKH visits cost:", costsByLocation.dpkhCost);
    console.log("DPKR visits cost:", costsByLocation.dpkrCost);
    console.log("Parking cost:", parkingCost);
    console.log("Total regular admission cost:", totalCost);
  },

  /**
   * Calculate parking costs
   * @param {number} visitCount - Number of visits
   * @param {boolean} hasMembershipAccess - Whether visitor has membership or Welcome Program access
   * @returns {number} Total parking cost
   */
  calculateParkingCost(visitCount, hasMembershipAccess = false) {
    // Input validation
    if (visitCount <= 0) return 0;

    // Get constraints from configuration
    const MAX_VISITS = PricingConfig.Constraints.MAX_VISITS_PER_LOCATION;

    // Cap visits to maximum value
    const cappedVisits = this.capVisits(visitCount, MAX_VISITS);

    // Get appropriate parking rate - members and Welcome Program participants get flat rate
    const parkingRate = hasMembershipAccess
      ? PricingConfig.ParkingRates.member
      : PricingConfig.ParkingRates.standard;

    return cappedVisits * parkingRate;
  },

  /**
   * Determine primary location based on visit frequency
   * @param {number} scienceVisits - Number of Science visits
   * @param {number} dpkhVisits - Number of DPKH visits
   * @param {number} dpkrVisits - Number of DPKR visits
   * @returns {string} Primary location code
   */
  determinePrimaryLocation(scienceVisits, dpkhVisits, dpkrVisits) {
    // Input validation
    const validScience = Math.max(0, scienceVisits || 0);
    const validDpkh = Math.max(0, dpkhVisits || 0);
    const validDpkr = Math.max(0, dpkrVisits || 0);

    // Compare visit counts to determine most-visited location
    if (validScience >= validDpkh && validScience >= validDpkr) {
      return "Science";
    } else if (validDpkh >= validScience && validDpkh >= validDpkr) {
      return "DPKH";
    } else {
      return "DPKR";
    }
  },

  /**
   * Count total visits across all locations
   * @param {number} scienceVisits - Number of Science visits
   * @param {number} dpkhVisits - Number of DPKH visits
   * @param {number} dpkrVisits - Number of DPKR visits
   * @returns {number} Total visit count (capped at maximum)
   */
  countTotalVisits(scienceVisits, dpkhVisits, dpkrVisits) {
    // Input validation
    const validScience = Math.max(0, scienceVisits || 0);
    const validDpkh = Math.max(0, dpkhVisits || 0);
    const validDpkr = Math.max(0, dpkrVisits || 0);

    // Get constraints from configuration
    const MAX_VISITS_PER_LOCATION =
      PricingConfig.Constraints.MAX_VISITS_PER_LOCATION;
    const MAX_TOTAL_VISITS = PricingConfig.Constraints.MAX_TOTAL_VISITS;

    // Cap individual location visits
    const cappedScienceVisits = this.capVisits(
      validScience,
      MAX_VISITS_PER_LOCATION
    );
    const cappedDpkhVisits = this.capVisits(validDpkh, MAX_VISITS_PER_LOCATION);
    const cappedDpkrVisits = this.capVisits(validDpkr, MAX_VISITS_PER_LOCATION);

    // Cap total visits
    return Math.min(
      MAX_TOTAL_VISITS,
      cappedScienceVisits + cappedDpkhVisits + cappedDpkrVisits
    );
  },
};

export default AdmissionCostCalculator;
