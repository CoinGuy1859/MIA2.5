// components/PromotionBanner.js
import React from "react";
import { PricingConfig } from "../pricing/pricing-module";

/**
 * PromotionBanner component
 * Displays a promotional banner for current discounts and special offers
 * Optimized for better readability and maintainability
 */
const PromotionBanner = () => {
  // Extract promotion data from config
  const promotionData = getPromotionData();

  // If no active promotion, don't render anything
  if (!isActivePromotion(promotionData)) {
    return null;
  }

  return (
    <BannerContainer>
      <PromoBadge />
      <PromoContent
        title={promotionData.title}
        description={promotionData.description}
      />
    </BannerContainer>
  );
};

/**
 * Extracts promotion data from config
 */
const getPromotionData = () => {
  const { promoBanner, currentRate } =
    PricingConfig.Discounts.membershipDiscount;

  return {
    title: promoBanner.title,
    description: promoBanner.description,
    discountRate: currentRate,
    isActive: currentRate > 0,
  };
};

/**
 * Checks if there's an active promotion
 */
const isActivePromotion = (promotionData) => {
  return (
    promotionData.isActive && (promotionData.title || promotionData.description)
  );
};

/**
 * Banner Container Component
 */
const BannerContainer = ({ children }) => (
  <div
    className="promo-banner"
    role="complementary"
    aria-label="Limited time promotion information"
    style={{
      background: "linear-gradient(135deg, #5f27cd, #341f97)",
      borderRadius: "8px",
      padding: "15px",
      marginBottom: "20px",
      color: "white",
      display: "flex",
      alignItems: "center",
    }}
  >
    {children}
  </div>
);

/**
 * Promotion Badge Component
 */
const PromoBadge = () => (
  <div
    className="promo-badge"
    style={{
      backgroundColor: "#f6ad55",
      color: "#744210",
      padding: "3px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "bold",
      marginRight: "15px",
    }}
  >
    Limited Time
  </div>
);

/**
 * Promotion Content Component
 */
const PromoContent = ({ title, description }) => (
  <div className="promo-content">
    {title && (
      <h3
        style={{
          margin: "0 0 5px 0",
          color: "white",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        {title}
      </h3>
    )}
    <div
      className="promo-subtitle"
      style={{
        fontSize: "14px",
        opacity: "0.9",
        lineHeight: "1.4",
      }}
    >
      {description}{" "}
      <span style={{ fontWeight: "500" }}>
        Prices shown include eligible discounts.
      </span>
    </div>
  </div>
);

export default PromotionBanner;
