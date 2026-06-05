import React, { createContext, useContext, useState } from "react";
import LoadingScreen from "../components/LoadingScreen"; // adjust path if needed

// Create context
const LoadingContext = createContext();

// Provider component
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {loading && <LoadingScreen />}
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook for easier access
export const useLoading = () => useContext(LoadingContext);
