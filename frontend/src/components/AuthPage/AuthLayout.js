// src/components/AuthPage/AuthLayout.js
import React from "react";
import { Link } from "react-router-dom";
const backgroundPattern = require("../../assets/background-pattern.svg").default;
const authFrame = require("../../assets/auth-frame.svg").default;
const authImg = require("../../assets/auth-img.svg").default;

const AuthLayout = ({ children, promoTitle, promoSubtitle, sizeMode = "fixed" }) => {
  const pageStyle = {
    backgroundImage: `url(${backgroundPattern})`,
    backgroundRepeat: "repeat",
  };
  const frameStyle = {
    backgroundImage: `url(${authFrame})`,
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  const containerClasses = [
    "relative",
    "w-full",
    "max-w-[1032px]",
    "animate-fadeInUp",
  ];
  if (sizeMode === "fixed") {
    containerClasses.push("lg:aspect-[1032/671]");
  }

  // ✅ Reduced width slightly and centered better
  const rightPanelClasses = [
    "w-full",
    "p-6", // slightly reduced padding
    "lg:w-[45%]", // reduced from 45%
    "mx-auto", // keeps it centered in its flex area
  ];
  if (sizeMode === "fixed") {
    rightPanelClasses.push(
      "lg:flex",
      "lg:flex-col",
      "lg:justify-center",
      "lg:overflow-hidden"
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark flex justify-center p-4 font-body lg:items-center">
      <div style={pageStyle} className="absolute inset-0 opacity-20" />

      <div className={containerClasses.join(" ")}>
        {/* Frame */}
        <div style={frameStyle} className="absolute inset-0 z-0" />

        {/* ✅ Added justify-between + responsive gap control */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:h-full overflow-hidden rounded-[2vw] lg:justify-between gap-x-6">
          {/* Left panel */}
          <div
            className="
              relative w-full h-48 
              lg:w-[46.1%] lg:h-auto 
              flex-shrink-0 flex flex-col justify-end items-center text-center
              p-8 overflow-hidden
            "
          >
            <Link to="/register" className="absolute inset-0">
              <img
                src={authImg}
                alt="Decorative Auth Background"
                className="
                  w-full h-full object-cover
                  object-[center_90%]
                  md:object-center
                  transition-all duration-300
                  cursor-pointer
                "
              />
            </Link>
          </div>

          {/* Right panel */}
          <div className={rightPanelClasses.join(" ")}>
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
