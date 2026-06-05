import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import addformbg from "./assets/backflowers.svg";
import logo from "./assets/alcherlogo.svg";
import "./CompetitionPage.css";
import DecorativeButton from "./components/DecorativeButton";
import flower from "./assets/whiteflower.svg";
import dropdown_back from "./assets/dropdown_back.svg";
import searchbar_back from "./assets/searchbar_back.svg";
import competitions from "./assets/competitions.svg";
import dropbutton from "./assets/dropbutton.svg";
function ModuleDropdown({ modules, selectedModule, setSelectedModule }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (module) => {
    setSelectedModule(module);
    setOpen(false);
  };

  const dropdownbg = {
    backgroundImage: `url(${searchbar_back})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  }
  

  return (
    <div className="lg:w-[560.5px] lg:h-[71px] w-[100%] h-[40px] flex flex-col items-center">
      {/* Header / Button */}
      <div
        className=" relative flex justify-center items-center p-4 font-sans cursor-pointer box-border lg:w-[560.5px] lg:h-[71px] w-[100%] h-[40px]"
        style={{
          backgroundImage: `url(${dropdown_back})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="lg:w-[80%] w-[90%] lg:h-[49px] h-[30px] lg:p-2 p-3 lg:text-[32px] text-base shadow-md text-[#EF5243] relative flex items-center justify-center cursor-pointer font-bold font-display bg-transparent outline-none"
          onClick={() => setOpen(!open)}
          style={{
            backgroundImage: `url(${searchbar_back})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <span style={{marginRight:"10px"}}>{selectedModule === "all" ? "All Module" : selectedModule}
            {/* Dropdown Arrow Button */}
            <button
              aria-label={open ? "Close modules list" : "Open modules list"}
              className={`absolute top-1/2 [left:calc(100%_-_50px)] text-[18px] text-[#EF5243] cursor-pointer p-0 leading-[1] transition-transform duration-200 ease-linear ${open ? 'transform -translate-y-1/2 rotate-180' : 'transform -translate-y-1/2 '}`}
              onClick={(e) => {
                e.stopPropagation(); // don't trigger header click twice
                setOpen((s) => !s);
              }}
            >
              <img src={dropbutton} alt="dropdown arrow" style={{ width: "20px", height: "20px",marginLeft:"10px" }} />
            </button>
          </span>
        </div>
      </div>

      {/* List */}
      <div className="lg:w-[80%] w-[90%] ">
        {open && (
          <div className="no-scrollbar flex flex-col items-center w-[100%] font-display text-center overflow-hidden h-auto overflow-y-auto">
            <div
              className="font-bold font-display text-[18px] lg:text-[32px] z-10 text-base text-[#EF5243] cursor-pointer lg:w-[419px] w-[90%] lg:h-[49px] h-[31px] flex justify-center items-center my-[1px]"
              style={dropdownbg}
              onClick={() => handleSelect("all")}
              // transition: "background-color 0.2s",
              // onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#EF5243")}
              // onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFB261")}
            >
              All Modules
            </div>

            {modules.map((mod) => (
              <div
                className="font-bold font-display text-[18px] lg:text-[32px] z-10 text-base text-[#EF5243] cursor-pointer lg:w-[419px] w-[90%] lg:h-[49px] h-[31px] flex justify-center items-center mb-[1px]"
                key={mod.id}
                onClick={() => handleSelect(mod.module)}
                style={dropdownbg}
                // onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#EF5243")}
                // onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFB261")}
              > 
                {mod.module}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CompetitionsList() {
  const location = useLocation();
  const moduleFromNav = location.state?.module;

  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [selectedModule, setSelectedModule] = useState(moduleFromNav || "all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modeFilter, setModeFilter] = useState("all");

  // modal state - selected competition to show details
  const [selectedComp, setSelectedComp] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetch(`${backendUrl}/api/competitions/`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        setData(Array.isArray(json.allcomp) ? json.allcomp : []);
        setData2(Array.isArray(json.modules) ? json.modules : []);
      })
      .catch((err) => console.error(err));
  }, []);
  console.log(data);
  const filteredData = data.filter((comp) => {
    const moduleMatch =
      selectedModule === "all" ||
      (comp.module && comp.module.module === selectedModule);
    const modeMatch =
      modeFilter === "all" ||
      (modeFilter === "online" && comp.event_mode === "true") ||
      (modeFilter === "offline" && comp.event_mode === "false");
    const allFields = Object.values(comp)
      .map((val) =>
        typeof val === "object"
          ? JSON.stringify(val).toLowerCase()
          : (val ? val.toString().toLowerCase() : "")
      )
      .join(" ");
    const searchMatch = allFields.includes(searchTerm.toLowerCase());
    return moduleMatch && searchMatch && modeMatch;
  });

  const formBgStyle = {
    backgroundImage: `url(${addformbg})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#EEECD9",
    padding: "20px",
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div style={formBgStyle} className=" min-h-screen bg-cover bg-center bg-no-repeat overflow-x-hidden box-border">
      <div className="w-full max-w-[1400px] mx-auto  box-border flex flex-col items-center">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start gap-4  justify-between w-full flex-wrap mb-4">
          <Link to="/" >
            <img src={logo} alt="Alcheringa Logo" className="hidden lg:block h-[50px] cursor-pointer"/>
          </Link>

          <div className="w-full lg:w-1/2 flex-shrink order-3 lg:order-1">
              <ModuleDropdown modules={data2} selectedModule={selectedModule} setSelectedModule={setSelectedModule} />
          </div>

          <div className="w-full lg:w-1/6 max-w-[360px] order-1 lg:order-2 flex justify-center items-center self-center">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className=" searchh-input double-notch-all2 outline-none"
            style={{
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              width: 230,
              height: 28,
              padding: "0 8px",
              backgroundColor: "#FFD09F",
              border: "none",
              fontSize: "0.9rem",
              color: "#000",
              boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
            }}
          /></div>

          <div className="flex lg:hidden order-2 gap-2 self-center flex-wrap text-display">
          {["all", "online", "offline"].map((mode) => (
            <div
              key={mode}
              onClick={() => setModeFilter(mode)}
              style={{
                padding: "6px 12px",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: modeFilter === mode ? "bold" : "normal",
                backgroundColor: modeFilter === mode ? "#EF5243" : "#FDF6E3",
                border: "1px solid #000",
                transition: "background-color 0.2s",
              }}
              className="font-display"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#D3D3D3")}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  modeFilter === mode ? "#EF5243" : "#FDF6E3";
              }}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </div>
          ))}
          </div>
        </div>

        {/* Mode Filters for laptop*/}
        <div className="hidden lg:flex  gap-2 mb-4 flex-wrap self-start text-display">
          {["all", "online", "offline"].map((mode) => (
            <div
              key={mode}
              onClick={() => setModeFilter(mode)}
              style={{
                padding: "6px 12px",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: modeFilter === mode ? "bold" : "normal",
                backgroundColor: modeFilter === mode ? "#EF5243" : "#FDF6E3",
                border: "1px solid #000",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#D3D3D3")}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  modeFilter === mode ? "#EF5243" : "#FDF6E3";
              }}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </div>
          ))}
        </div>
  
        {/* Competitions Grid */}
        <div className="flex flex-col items-center justify-center w-[100%]">
          <div 
            // className="flex flex-row flex-wrap gap-2 py-4 overflow-y-auto overscroll-contain h-[calc(100vh-200px)] no-scrollbar w-[100%] bg-neutral-700"
  className="
    flex 
    flex-wrap 
    justify-center 
    gap-4 
    py-4 
    overflow-y-auto 
    overscroll-contain 
    h-[calc(100vh-200px)] 
    no-scrollbar 
    w-full 
  "
>

            {filteredData.length > 0 ? (
              filteredData.map((comp) => (
                <div
                  key={comp.id}
                  className="
  competition-card 
  card 
  double-notch-all 
  w-full 
  sm:w-[48%] 
  [@media(min-width:920px)]:w-[31%] 
  relative 
  overflow-hidden 
  aspect-[4/3]
"

                  style={{background:`url(${backendUrl}${comp.image}) center/cover no-repeat `}}
                >
                  <div
                    className="competition-default"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      alignItems: "center",
                      color: "#fff",
                      backgroundColor: "rgba(0, 0, 0, 0.4)", // adjust opacity for darkness
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    <h3
                      className="flex justify-center items-center gap-[5px] font-bold text-[20px] text-alch-cream font-['TT_Modernoir'] whitespace-nowrap text-ellipsis m-0 [text-shadow:1px_1px_#888888]"
                    >
                      <img src={flower} alt="Alcheringa Logo" className="h-[19px]" />
                      {comp.event_name}
                      <img src={flower} alt="Alcheringa Logo" className="h-[19px]" />
                    </h3>
                    <p className="no-scrollbar prize [text-shadow:1px_1px_#888888] text-alch-cream" style={{ margin: 0, fontSize: "0.9rem", textAlign: "center",height:"80px",width:"350px",overflowY:"scroll"}}>{comp.event_desc}</p>
                    <p className="prize [text-shadow:1px_1px_#888888] text-alch-cream" style={{ margin: 0, fontSize: "1rem",textAlign: "center",fontWeight:"bold"}}>Price worth <span style={{color:"#EF5243",fontSize: "1.3rem"}}>{comp.prize_worth}K+</span></p>
                    <DecorativeButton to={`/register/${comp.id}`} onClick={() => setSelectedComp(comp)} className = "dec-btn" variant="orange-sm">Register</DecorativeButton>
                  </div>   
                </div>
              ))
            ) : (
              <p>No competitions found.</p>
            )}
          </div>
        </div>

        {/* Details Modal (first step) */}
        {selectedComp && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
              padding: "1rem",
            }}
          >
            <div
              className="modal-content"
              style={{
                width: "100%",
                maxWidth: "720px",
                background: "#fff",
                borderRadius: 12,
                padding: "1.5rem",
                boxSizing: "border-box",
              }}
            >
              

              {/* Actions: Close or go to registration form */}
              <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  onClick={() => setSelectedComp(null)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>

                <Link to={`/register/${selectedComp.id}`}>
                  <button
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "none",
                      background: "#EF5243",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Register
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CompetitionsList;
