// src/ImprovedHeader.js
import React from "react";
import Logos from "./components/Logos";

const ImprovedHeader = () => {
  return (
    <header className="w-full max-w-4xl mx-auto mb-8 px-4">
      <div className="flex flex-col items-center">
        <div className="mb-3">
          <Logos.MainHeader />
        </div>
        <p className="text-md text-gray-600 text-center">
          Find the best membership option for your family
        </p>
      </div>
    </header>
  );
};

export default ImprovedHeader;
