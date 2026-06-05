import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DecorativeButton from "../AuthPage/DecoratedButton";
import whiteflower from "../../assets/whiteflower.svg"
export default function Modules({ module }) {
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch competitions of this module on hover
  const fetchCompetitions = async () => {
    if (competitions.length > 0) return; // already fetched
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/competitions/`, {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json();
      const allcomps = Array.isArray(json.allcomp) ? json.allcomp : [];
      const filtered = allcomps.filter(
        (c) => c.module && (c.module.module === module.module || c.module === module.module)
      );
      setCompetitions(filtered);
    } catch (err) {
      console.error("Failed to fetch competitions:", err);
      setCompetitions([]);
    } finally {
      setLoading(false);
    }
  };

  const overlayVariants = {
    rest: { backgroundColor: "rgba(0,0,0,0.3)" },
    hover: { backgroundColor: "rgba(0,0,0,0.6)", transition: { duration: 0.4 } },
  };

  const titleVariants = {
    rest: { top: "50%", y: "-30%", transition: { duration: 0.5, ease: "easeOut" } },
    hover: { top: "10%", y: "0%", transition: { duration: 0.6, ease: "easeOut" } },
  };

  const infoVariants = {
    rest: { opacity: 0, y: 10 },
    hover: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.1 } },
  };

  const buttonVariants = {
    rest: { opacity: 0, y: 20, scale: 0.9 },
    hover: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut", delay: 0.2 } },
  };

  return (
    <motion.div
      className="double-notch-all relative inline-block rounded-xl overflow-hidden shadow-lg cursor-pointer w-[230px] h-[330px] lg:w-[306px] lg:h-[500px]"
      style={{backgroundImage: `url(${backendUrl}${module.module_icon})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
      initial="rest"
      whileHover="hover"
      animate="rest"
      onHoverStart={fetchCompetitions} // fetch competitions on hover
      onClick={(e) => {e.stopPropagation(); // prevent parent click
        navigate("/competitions", { state: { module: module.module } });
      }}
    >
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-white"
        variants={overlayVariants}
      >
        {/* Module name — slides up on hover */}
        <motion.h3
          className="absolute  transform -translate-x-1/2 text-[16px] lg:text-[20px] font-bold  tracking-wide text-alch-cream flex flex-row gap-[5px]"
          variants={titleVariants}
          style={{ textShadow: "0 3px 8px rgba(0,0,0,0.6)" }}
        >
           <img src={whiteflower} alt="floweer"/>
            {module.module}
           <img src={whiteflower} alt="floweer"/>
        </motion.h3>

        {/* Competitions info — middle of the card */}
        <motion.div
          className="absolute top-[45%] text-center w-[80%]"
          variants={infoVariants}
        >
          {loading ? (
            <p className="text-sm opacity-90">Loading competitions...</p>
          ) : competitions.length > 0 ? (
            <ul className="text-sm space-y-1 no-scrollbar">
              {competitions.map((comp) => (
                  <li key={comp.id} className="bg-black/2 rounded-md">
                    {comp.event_name}
                  </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm opacity-90">No competitions available.</p>
          )}
        </motion.div>

        {/* Explore button */}
        <motion.button
          className="absolute bottom-6 px-4  font-semibold shadow-md"
          variants={buttonVariants}
          onClick={(e) => {e.stopPropagation(); // prevent parent click
            navigate("/competitions", { state: { module: module.module } });
          }}
        >
          <DecorativeButton>Explore</DecorativeButton>
        
        
        </motion.button>

      </motion.div>
    </motion.div>
  );
}
