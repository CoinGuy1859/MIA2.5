// components/CheckIcon.js
import React from "react";

/**
 * CheckIcon Component with controlled size
 * A reusable checkmark icon that can be easily imported into other components
 *
 * @param {string} className - Additional CSS classes to apply
 * @param {string} color - The fill color of the checkmark
 * @param {number} size - The size of the icon in pixels
 * @param {object} style - Additional inline styles to apply
 * @returns {React.ReactElement} SVG checkmark icon
 */
const CheckIcon = ({
  className = "",
  color = "currentColor",
  size = 24,
  style = {},
}) => (
  <svg
    className={`checkmark-icon ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={color}
    width={size}
    height={size}
    style={{
      maxWidth: `${size}px`,
      maxHeight: `${size}px`,
      display: "inline-block",
      verticalAlign: "middle",
      ...style,
    }}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M20.707 5.293a1 1 0 010 1.414l-11 11a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 15.586 19.293 5.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export default CheckIcon;
