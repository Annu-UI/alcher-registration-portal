import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

// --- Assets ---
import OrangeLine from "../assets/orange -line.svg";

function MyRegistrations() {
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const stored = JSON.parse(localStorage.getItem("registeredCompetitions")) || [];
  //   setCompetitions(stored);
  //   setLoading(false);
  // }, []);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        // --- 2. USE AXIOSINSTANCE ---
        // It already has the base URL and auth headers
        const response = await axiosInstance.get(
          "/api/my-registered-competitions/"
        );

        // 3. GET DATA FROM response.data
        const data = response.data;
        console.log("Fetched competitions:", data); // helpful for debugging
        setCompetitions(data);
        // --- END OF CHANGES ---
      } catch (error) {
        console.error("Error fetching competitions:", error);
        // The axiosInstance interceptor will handle 401 errors
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  return (
    <div
      className="relative min-h-screen w-full text-white flex flex-col items-center " 
    >
      {/* HEADER */}
      <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4rem)] md:w-[calc(100%-6rem)] mx-auto mt-8 px-4 md:px-8 flex flex-col items-center">
      </div>

      

      {/* MAIN CONTENT */}
      <div className="relative w-[calc(100%-3rem)] sm:w-[calc(100%-4rem)] md:w-[calc(100%-6rem)] mx-auto mt-6 md:mt-10 px-4 md:px-8 flex flex-col items-center">
        

        <div className="relative z-10 w-full">
          {loading ? (
            <div className="text-black py-10 font-sans text-center">
              Loading competitions...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 py-10">
              {competitions.length > 0 ? (
                competitions.map((comp, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center cursor-pointer transform hover:scale-105 transition-transform duration-300"
                  >
                    <div className="relative w-full">
                      <img
                        src={backendUrl + comp.event.image}
                        alt={comp.event.event_name || "Competition"}
                        className="w-full md:w-[90%] lg:w-[95%] h-auto object-contain mx-auto rounded-xl"
                      />
                    </div>

                    <p className="mt-3 text-black font-semibold text-sm sm:text-base md:text-lg">
                      {comp.event.event_name}
                    </p>

                    <p className="text-gray-700 text-xs sm:text-sm md:text-base mt-2">
                      {comp.event.event_desc || "No description provided."}
                    </p>

                  </div>
                ))
              ) : (
                <p className="text-black text-center w-full">No registered competitions yet.</p>
              )}
            </div>
          )}

          {/* EXPLORE MORE */}
          <div className="relative flex flex-col items-center justify-center mt-8 mb-12 sm:mb-16 w-full">
            <div
              className="relative flex items-center justify-center cursor-pointer w-full max-w-xs mx-auto"
              onClick={() => navigate("/competitions")}
            >
              <img src={OrangeLine} alt="Orange underline" className="w-full" />
              <span className="absolute text-black font-semibold text-sm sm:text-base md:text-lg">
                Explore More Competitions
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyRegistrations;
