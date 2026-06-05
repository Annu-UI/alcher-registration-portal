import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DecorativeButton from "../AuthPage/DecoratedButton";
import bottomBorder from "../../assets/bottom-border.svg";
import backgroundPattern from "../../assets/background-pattern.svg";
import flower from "../../assets/star-filled.svg";
import mbbgpattern from "../../assets/mbbgpatternwh.svg"
import middle_line from "../../assets/Middle_line.svg";

const HeroSection = ({ isAuthenticated }) => {
  const mainContentStyle = {
    backgroundImage: `url(${backgroundPattern})`,
    backgroundRepeat: "repeat-y",
    backgroundPosition: "center",
    backgroundSize: "cover",
  };

  const bgmainContentStyle = {
    backgroundImage: `url(${mbbgpattern})`,
    backgroundRepeat: 'repeat-y',
    backgroundPosition: 'center',
    backgroundSize: "100% auto",
  };

  /*
  // Dynamic, responsive flower positions
  const [flowers, setFlowers] = useState([]);

useEffect(() => {
  const updateFlowers = () => {
    const width = window.innerWidth;
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;

    // Base positions (desktop reference)
    const manualFlowers = [
      { top: 15, left: 35, baseSize: 120, rotateDir: 1, delay: 0.2, duration: 3 },
      { top: 25, left: 50, baseSize: 100, rotateDir: -1, delay: 0.4, duration: 2.5 },
      { top: 35, left: 25, baseSize: 140, rotateDir: 1, delay: 0.6, duration: 3.2 },
      { top: 30, left: 65, baseSize: 130, rotateDir: -1, delay: 0.8, duration: 2.8 },
    ];

    // Scale for mobile/tablet
    const sizeScale = isMobile ? 0.6 : isTablet ? 0.85 : 1;

    // Vertical adjustment — push them slightly lower on small screens
    const topShift = isMobile ? 15 : isTablet ? 8 : 0;

    setFlowers(
      manualFlowers.map(f => ({
        ...f,
        size: `${f.baseSize * sizeScale}px`,
        top: `${f.top + topShift}vh`,  // shift downward
        left: `${f.left}vw`,
      }))
    );
  };

  updateFlowers(); // initial render
  window.addEventListener("resize", updateFlowers);
  return () => window.removeEventListener("resize", updateFlowers);
}, []);
*/
  return (
    <div className="text-alch-cream overflow-hidden">
      <main className="relative flex flex-col justify-center items-center text-center min-h-screen py-16 sm:py-24 md:py-32">
        {/* Dark background with pattern */}
        <div className="absolute inset-0 bg-transparent "></div>

      {/*  Flowers 
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {flowers.map((f, i) => (
            <motion.img
              key={i}
              src={flower}
              alt="flower"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 0.7, 0],
                scale: [0.9, 1.1, 0.95],
                translateY: [0, -8, 0],
                rotate: [0, 5 * f.rotateDir, -5 * f.rotateDir, 0],
              }}
              transition={{
                duration: f.duration,
                delay: f.delay,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                top: f.top,
                left: f.left,
                width: f.size,
                height: f.size,
                transform: "translate(-50%, -50%)",
                zIndex: 5,
              }}
            />
          ))}
        </div>
       */}
       
        {/* Text */}
<motion.h1
  initial={{ opacity: 0, scale: 0.85 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6, delay: 1.8, ease: "easeOut" }}
  className="relative z-10 font-display font-bold text-alch-red tracking-wide leading-[1.05] 
             text-[clamp(4rem,10vw,9rem)] text-center"
>
  ALCHERINGA
</motion.h1>

<motion.p
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6, delay: 2.2 }}
  className="relative z-10  font-display font-light text-brand-beige tracking-wide 
             text-[clamp(1rem,3vw,1.5rem)] text-center"
>
  STITCH YOUR JOURNEY – ALCHERINGA AWAITS
</motion.p>

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6, delay: 2.4 }}
  className="relative z-10 mt-[clamp(2rem,5vw,6rem)]"
>
  {!isAuthenticated && (
    <DecorativeButton to="/register" variant="orange">
      Register
    </DecorativeButton>
  )}
</motion.div>

      </main>
      
      <div className="bg-black">
        <img src={middle_line} alt="Decorative Footer Border" className="w-full transform scale-y-[-1]"/>
      </div>
      {/* Footer */}
      <footer className="bg-alch-cream">
        <img src={bottomBorder} alt="Decorative Footer Border" className="w-full" />
        <img src={bottomBorder} alt="Decorative Footer Border" className="w-full transform scale-y-[-1]" />
      </footer>
    </div>
  );
};

export default HeroSection;
