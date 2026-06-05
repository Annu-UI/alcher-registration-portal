import React, { useEffect, useState } from "react";
import { ReactComponent as StarIcon } from "../assets/star-filled.svg";
import bg404 from "../assets/background-pattern.svg";
export default function LoadingScreen() {
  const [activeStars, setActiveStars] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStars((prev) => (prev < 5 ? prev + 1 : 0)); // loop through 0→5
    }, 400); // speed of lighting up
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center h-screen"
      style={{
        backgroundImage: `url(${bg404})`,
        backgroundRepeat: 'repeat-y',
        backgroundSize: "100% auto",
        backgroundPosition: 'center',
      }}
    >
      <div className="flex flex-col w-[202.51px] h-[85px] g-[12px]">
        <div className="flex space-x-2">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`w-9 h-9 transition-all duration-300 
                ${
                  i < activeStars
                    ? "fill-alch-red opacity-100"
                    : "fill-alch-red opacity-30"
                }
              `}
            />
          ))}
        </div>

        
          <p className="text-[40px] w-[202.51px] self-center font-display font-semibold text-alch-red animate-pulse">Loading...</p>
      </div>
    </div>
  );
}