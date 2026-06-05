import { forwardRef, useEffect, useState, useRef } from "react";
import Modules from "./modules"; // your module card component
import { motion } from "framer-motion";
import addformbg from "../../assets/background-pattern.svg";
import addbottom1 from "../../assets/bottomcompborder.svg";
import pentagonborder from "../../assets/pentagonborder.svg";
import Modulename from "../../assets/modulename.svg";
import middle_line from "../../assets/Middle_line.svg";
import CountUp from "../../animation/CountUp";
import headingIconRed from "../../assets/heading-icon-red.svg";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export const CompModules = forwardRef((props, ref) => {
  const [modulesFromBackend, setModulesFromBackend] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch modules from backend
  useEffect(() => {
    setLoading(true);
    fetch(`${backendUrl}/api/competitions/`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        const mods = Array.isArray(json.modules) ? json.modules : [];
        setModulesFromBackend(mods);
      })
      .catch((err) => {
        console.error("Failed to fetch modules:", err);
        setModulesFromBackend([]);
      })
      .finally(() => setLoading(false));
  }, []);

 useEffect(() => {
  if (!containerRef.current || !wrapperRef.current) return;

  const container = containerRef.current;
  const wrapper = wrapperRef.current;

  const setupScroll = () => {
    // Kill previous triggers if any
    ScrollTrigger.getAll().forEach(t => t.kill());

    const isLargeScreen = window.innerWidth >= 1024; // lg breakpoint

    if (isLargeScreen) {
      const scrollDistance = container.scrollWidth - wrapper.offsetWidth;
      const totalScroll = scrollDistance + window.innerWidth * 0.1;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: () => `+=${totalScroll}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // markers: true, // for debugging
        },
      });

      tl.to(container, {
        x: -scrollDistance,
        ease: "none",
      });
    } else {
      // Reset GSAP transforms for mobile
      gsap.set(container, { clearProps: "all" });
    }
  };

  setupScroll();

  // Recalculate on resize
  const handleResize = () => {
    ScrollTrigger.refresh();
    setupScroll();
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
    ScrollTrigger.getAll().forEach(t => t.kill());
  };
}, [modulesFromBackend]);



  return (
    <div className="no-scrollbar" ref={ref}>
      <div className="lg:flex hidden flex-row items-center justify-around w-[100%]  mb-[120px]">
        <div className="text-center mt-[120px]">
          <CountUp from={0} to={140} separator="," direction="up" duration={0.8} className="count-up-text font-sans font-extrabold text-[48px]"/>
          <p className="font-sans font-extrabold text-[48px] inline-block">k+</p>
          <p className="font-sans font-normal text-[24px]">Footfall</p>
        </div>
        <div className="text-center mt-[120px]">
          <CountUp from={0} to={100} separator="," direction="up" duration={0.8} className="count-up-text font-sans font-extrabold text-[48px]"/>
          <p className="font-sans font-extrabold text-[48px] inline-block">+</p>
          <p className="font-sans font-normal text-[24px]">Events</p>
        </div>
        <div className="text-center mt-[120px]">
          <CountUp from={0} to={3000} separator="," direction="up" duration={0.8} className="count-up-text font-sans font-extrabold text-[48px]"/>
          <p className="font-sans font-extrabold text-[48px] inline-block">+</p>
          <p className="font-sans font-normal text-[24px]">Participants</p>
        </div>
        <div className="text-center mt-[120px]">
          <CountUp from={0} to={500} separator="," direction="up" duration={0.8} className="count-up-text font-sans font-extrabold text-[48px]"/>
          <p className="font-sans font-extrabold text-[48px] inline-block">+</p>
          <p className="font-sans font-normal text-[24px]">College</p>
        </div>
        <div className="text-center mt-[120px]">
          <CountUp from={0} to={45} separator="," direction="up" duration={0.8} className="count-up-text font-sans font-extrabold text-[48px]"/>
          <p className="font-sans font-extrabold text-[48px] inline-block">+</p>
          <p className="font-sans font-normal text-[24px]">Competitions</p>
        </div>
      </div>
      
      <div className="flex lg:hidden lg:flex-row flex-col items-center justify-around w-[100%] mb-[140px]">
        <div className="flex flex-row gap-[50px] mb-[50px]">
          <div className="text-center mt-[50px]">
            <CountUp from={0} to={140} separator="," direction="up" duration={0.8} className="count-up-text font-sans font-extrabold text-[24px] lg:text-[48px]"/>
            <p className="font-sans font-extrabold text-[24px] lg:text-[48px] inline-block">k+</p>
            <p className="font-sans font-normal text-[12px] lg:text-[24px]">Footfall</p>
          </div>
          <div className="text-center mt-[50px]">
            <CountUp from={0} to={100} separator="," direction="up" duration={0.8} className="count-up-text font-sans font-extrabold text-[24px] lg:text-[48px]"/>
            <p className="font-sans font-extrabold text-[24px] lg:text-[48px] inline-block">+</p>
            <p className="font-sans font-normal text-[12px] lg:text-[24px]">Events</p>
          </div>
        </div>
        <div className="flex flex-row gap-[50px] mb-[50px]">
          <div className="text-center mt-[50px]">
            <CountUp from={0} to={3000} separator="," direction="up" duration={0.8} className="count-up-text font-sans font-extrabold text-[24px] lg:text-[48px]"/>
            <p className="font-sans font-extrabold text-[24px] lg:text-[48px] inline-block">+</p>
            <p className="font-sans font-normal text-[12px] lg:text-[24px]">Participants</p>
          </div>
          <div className="text-center mt-[50px]">
            <CountUp from={0} to={500} separator="," direction="up" duration={0.8} className="count-up-text font-sans font-extrabold text-[24px] lg:text-[48px]"/>
            <p className="font-sans font-extrabold text-[24px] lg:text-[48px] inline-block">+</p>
            <p className="font-sans font-normal text-[12px] lg:text-[24px]">College</p>
          </div>
        </div>
        <div className="text-center mt-[50px]">
          <CountUp from={0} to={45} separator="," direction="up" duration={0.8} className="count-up-text font-sans font-extrabold text-[24px] lg:text-[48px]"/>
          <p className="font-sans font-extrabold text-[24px] lg:text-[48px] inline-block">+</p>
          <p className="font-sans font-normal text-[12px] lg:text-[24px]">Competitions</p>
        </div>
      </div>
      <div className="flex justify-center items-center no-scrollbar mb-[30px]" >
         <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="flex items-center justify-center text-center font-display text-[30px] lg:text-[48px] font-extrabold text-dark-orange mb-5"
                >
                  <img src={headingIconRed} alt="Decorative Icon" className="h-5 sm:h-6 mx-2" />
                  MODULES
                  <img src={headingIconRed} alt="Decorative Icon" className="h-5 sm:h-6 mx-2" />
                </motion.h2>
      </div>

      {/* Horizontal scrolling section */}
      {/* lg */}
      <div ref={wrapperRef} className="relative hidden overflow-x-auto overflow-y-hidden overflow-hidden h-screen lg:flex items-center no-scrollbar">
        <div 
          ref={containerRef} 
          className="flex gap-4 absolute"
          style={{ padding: "1rem", willChange: "transform" }}
        >
          {loading ? (
            <p>Loading modules...</p>
          ) : modulesFromBackend.length === 0 ? (
            <p>No modules available.</p>
          ) : (
            modulesFromBackend.map((m) => (
              <div key={m.id ?? m.module}>
                <Modules module={m} />
              </div>
            ))
          )}
        </div>
      </div>
      {/* mobile */}
      <div className="relative lg:hidden no-scrollbar overflow-x-auto overflow-y-hidden overflow-hidden h-[400px] flex items-center pb-[30px]">
        <div 
          className="flex gap-4 absolute"
          style={{ padding: "1rem", willChange: "transform" }}
        >
          {loading ? (
            <p>Loading modules...</p>
          ) : modulesFromBackend.length === 0 ? (
            <p>No modules available.</p>
          ) : (
            modulesFromBackend.map((m) => (
              <div key={m.id ?? m.module}>
                <Modules module={m} />
              </div>
            ))
          )}
        </div>
      </div>

      <img src={addbottom1} alt="Decorative Footer Border" className="w-full" />
      <div className="bg-alch-dark">
        <img src={middle_line} alt="Decorative Footer Border" className="w-full bg-alch-dark" />
        <div className="w-full mx-auto flex items-center justify-center bg-black">
          <img src={pentagonborder} className="w-[97.8%] mt-[2px] lg:mt-[5px] h-full" alt="pentagon" />
        </div>
      </div>
    </div>
  );
});