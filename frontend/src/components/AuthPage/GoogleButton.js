import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleLogo from "../../assets/google-logo.svg";
import GoogleBg from "../../assets/google-bg.svg";

const GoogleButton = ({ onSuccess, onError, size }) => {
  // ✅ Use React hook to handle Google login (no missing client_id issue)
  const login = useGoogleLogin({
    onSuccess,
    onError,
    scope: "email profile",
  });

  // ✅ Size-based classes remain unchanged
  const sizeClasses =
    size === "small"
      ? "w-full max-w-[150px] px-4 py-1 text-xs gap-2"
      : "w-full max-w-xs sm:max-w-sm px-6 py-2 text-sm gap-3";

  return (
    <button
      onClick={() => login()}
      className={`
        relative flex items-center justify-center
        ${sizeClasses}
        text-gray-700 font-medium
        rounded-md overflow-visible
        hover:text-gray-900
        transition-all duration-200
      `}
    >
      {/* ✅ Background Frame */}
      <img
        src={GoogleBg}
        alt="Google background"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />

      {/* ✅ Content */}
      <img src={GoogleLogo} alt="Google" className="w-4 h-4 relative z-10" />
      <span className="relative z-10">Continue with Google</span>
    </button>
  );
};

export default GoogleButton;
