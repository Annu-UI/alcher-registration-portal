import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axiosInstance from "./utils/axiosInstance";

// Assets
import logo from "./assets/alcher-logo2.svg";
import headerImage from "./assets/group-dance.svg";
import guidelinesFrame from "./assets/guidelines-frame.svg";
import bgPattern from "./assets/background-pattern.svg";
import flower from "./assets/flower.svg";
import DecoratedButton from "./components/AuthPage/DecoratedButton";

const RegisterPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [competition, setCompetition] = useState(null);
  const [formData, setFormData] = useState({ teamVideo: "", description: "" });
  const [teamMembers, setTeamMembers] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch competition details
  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const res = await axiosInstance.get(`/api/competitions/${id}/`);
        setCompetition(res.data);
      } catch (err) {
        console.error("Error fetching competition:", err);
      }
    };
    fetchCompetition();
  }, [id]);

  // Fetch available members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axiosInstance.get("/Participantdata/Participant/");
        setAvailableMembers(res.data.map((m) => m.name));
      } catch (err) {
        console.error("Error fetching members:", err);
      }
    };
    fetchMembers();
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddMember = (member) => {
    if (!teamMembers.includes(member) && teamMembers.length < (competition?.max_members || 1) - 1) {
      setTeamMembers((prev) => [...prev, member]);
    }
    setDropdownOpen(false);
  };

  const removeMember = (member) =>
    setTeamMembers((prev) => prev.filter((m) => m !== member));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

// ✅ Validation for team member count (including leader)
const minMembers = competition?.min_members || 1;
const maxMembers = competition?.max_members || 1;

const totalMembers = teamMembers.length + 1; // +1 for leader

if (totalMembers < minMembers || totalMembers > maxMembers) {
  setError(
    `Total team size (including leader) must be between ${minMembers} and ${maxMembers}.`
  );
  setLoading(false);
  return;
}

    const finalData = {
      competition_id: id,
      team_members: teamMembers,
      team_video: formData.teamVideo,
      description: formData.description,
    };

    try {
      await axiosInstance.post("/api/register-competition/", finalData);

      const stored =
        JSON.parse(localStorage.getItem("registeredCompetitions") || "[]") || [];
      const newEntry = {
        id,
        team_members: teamMembers,
        comp_image_url: competition?.image,
        team_video: formData.teamVideo,
        description: formData.description,
        registered_at: new Date().toISOString(),
      };

      localStorage.setItem(
        "registeredCompetitions",
        JSON.stringify([...stored, newEntry])
      );
      navigate("/profile", { state: { tabIndex: 2 } });
    } catch (err) {
      console.error("Registration Error:", err);

      // Check if the server sent a specific error message
      if (err.response && err.response.data) {
        const data = err.response.data;

        // 1. Check for the "You have already registered" error
        if (data.error) {
          setError(data.error);
        } 
        // 2. Check for "Invalid URL" errors (Django sends these as arrays)
        else if (data.team_video) {
          setError(data.team_video[0]); 
        }
        // 3. Check for Description errors
        else if (data.description) {
          setError(data.description[0]);
        }
        // 4. Fallback: Take the first available error found
        else {
          const firstKey = Object.keys(data)[0];
          const firstError = data[firstKey];
          // If it's an array (standard Django format), show the first item
          const message = Array.isArray(firstError) ? firstError[0] : firstError;
          setError(message);
        }
      } else {
        // Fallback for network issues (server down, no internet)
        setError("Something went wrong. Please check your internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white pixelbg bg-alch-dark">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 max-w-screen-xl mx-auto">
        <Link to="/">
          <img src={logo} alt="logo" className="h-10 w-auto" />
        </Link>
      </div>

      {/* Header Image */}
      <div className="flex justify-center">
        <div className="relative w-[calc(100%-3rem)] sm:w-[calc(100%-4rem)] md:w-[calc(100%-6rem)] max-w-screen-xl">
          <img
            src={headerImage}
            alt="header"
            className="w-full h-56 sm:h-64 md:h-72 object-cover object-top"
          />
        </div>
      </div>

      {/* Cream Section */}
      <div className="bg-[#FFF8E7] text-black flex justify-center pb-20 mx-auto w-[calc(100%-3rem)] sm:w-[calc(100%-4rem)] md:w-[calc(100%-6rem)] max-w-screen-xl">
        <div className="w-full px-6 py-8 md:px-10 lg:px-14 relative">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
            <div>
              {/* Competition Name */}
              <div className="flex items-center justify-center gap-4 mt-8 w-full">
                <img
                  src={flower}
                  alt="left flower"
                  className="w-8 h-8 sm:w-10 sm:h-10"
                />
                <h2 className="text-[#171717] text-center font-display text-[2.625rem] font-bold leading-normal capitalize">
                  {competition?.event_name || "Competition Name"}
                </h2>
                <img
                  src={flower}
                  alt="right flower"
                  className="w-8 h-8 sm:w-10 sm:h-10"
                />
              </div>

              {/* Module */}
              {competition?.event_module && (
                <h3 className="text-[#171717] text-center font-display text-[2rem] font-medium capitalize mt-2">
                  {competition?.event_module.module ||
                    competition?.event_module}
                </h3>
              )}

              {/* Mode & Type */}
              <div className="flex items-center gap-8 mt-3">
                <span className="text-[#171717] text-center font-sans text-[1.25rem] font-medium capitalize">
                  {competition?.solo_or_group || "N/A"}
                </span>
                <span className="text-[#171717] text-center font-sans text-[1.25rem] font-medium capitalize">
                  {competition?.event_mode === "true" ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            {/* ✅ Responsive Guidelines Popup */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setGuidelinesOpen(!guidelinesOpen)}
                className="w-32 h-12 bg-transparent"
              >
                <img
                  src={guidelinesFrame}
                  alt="guidelines"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
                />
              </button>

              {guidelinesOpen && (
                <>
                  {/* Mobile View (centered) */}
                  <div className="sm:hidden fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                      className="absolute inset-0 bg-black/60"
                      onClick={() => setGuidelinesOpen(false)}
                    />
                    <div className="relative w-full max-w-[90vw]">
                      <div className="flex flex-col items-center w-full">
                        <div className="bg-black w-[86%] h-[0.7rem]" />
                        <div className="bg-black w-[92%] h-[0.9rem]" />
                        <div
                          className="bg-black text-white w-full p-5 overflow-hidden rounded-none"
                          style={{ maxHeight: "75vh" }}
                        >
                          <p className="text-center text-lg font-semibold text-[#f79b2b] mb-3">
                            Competition Guidelines
                          </p>
                          <div className="text-[#e5e5e5] text-sm whitespace-pre-line leading-relaxed overflow-y-auto max-h-[60vh] pr-2">
                            {competition?.event_rules || "No rules provided."}
                          </div>
                          <div className="mt-5 flex justify-center">
                            <DecoratedButton
                              className="bg-[#f79b2b] hover:bg-[#f58e1f] text-black font-semibold px-6 py-2 rounded-none"
                              onClick={() => setGuidelinesOpen(false)}
                            >
                              Agree
                            </DecoratedButton>
                          </div>
                        </div>
                        <div className="bg-black w-[92%] h-[0.9rem]" />
                        <div className="bg-black w-[86%] h-[0.7rem]" />
                      </div>
                    </div>
                  </div>

                  {/* Tablet & Desktop View (right side) */}
                  <div className="hidden sm:block absolute right-0 top-full mt-3 z-50">
                    <div className="flex flex-col items-center w-full">
                      <div className="bg-black w-[86%] h-[0.7rem]" />
                      <div className="bg-black w-[92%] h-[0.9rem]" />
                      <div className="bg-black text-white w-[25rem] p-5 max-h-[60vh] overflow-y-auto rounded-none">
                        <p className="text-center text-lg font-semibold text-[#f79b2b] mb-3">
                          Competition Guidelines
                        </p>
                        <div className="text-[#e5e5e5] text-sm whitespace-pre-line leading-relaxed overflow-y-auto max-h-[50vh] pr-2">
                          {competition?.event_rules || "No rules provided."}
                        </div>
                        <div className="mt-5 flex justify-center">
                          <DecoratedButton
                            className="bg-[#f79b2b] hover:bg-[#f58e1f] text-black font-semibold px-6 py-2 rounded-none"
                            onClick={() => setGuidelinesOpen(false)}
                          >
                            Agree
                          </DecoratedButton>
                        </div>
                      </div>
                      <div className="bg-black w-[92%] h-[0.9rem]" />
                      <div className="bg-black w-[86%] h-[0.7rem]" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Competition Description */}
          <p className="text-[#171717] font-sans text-[1rem] leading-[1.6875rem] mb-8">
            {competition?.event_desc}
          </p>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
            <div>
              <label className="text-[#171717] text-[1.125rem] font-normal">
                Add Members 
                {competition?.max_members > 999 
                   ? ` (Min ${competition?.min_members})` 
                   : ` (Min ${competition?.min_members} - Max ${competition?.max_members})`}
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {teamMembers.length === 0 && (
                  <span className="text-sm text-gray-500">
                    No members added yet
                  </span>
                )}
                {teamMembers.map((member) => (
                  <div
                    key={member}
                    className="bg-[#FFE8CF] text-sm px-3 py-1 rounded flex items-center gap-2"
                  >
                    <span className="text-[#5a3a14]">{member}</span>
                    <button
                      type="button"
                      onClick={() => removeMember(member)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-[#f79b2b] hover:bg-[#f58e1f] text-black px-3 py-2 rounded font-medium"
                >
                  + <span className="text-sm">Add Member</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg max-h-48 overflow-y-auto z-30">
                    {availableMembers.map((member) => (
                      <div
                        key={member}
                        onClick={() => handleAddMember(member)}
                        className="px-3 py-2 hover:bg-[#fffaef] cursor-pointer text-sm"
                      >
                        {member}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-[#171717] text-[1.125rem]">
                Previous Performance
              </label>
              <input
                type="url"
                name="teamVideo"
                value={formData.teamVideo}
                onChange={handleChange}
                placeholder="Enter Link"
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#f5a24c]"
              />
            </div>

            <div>
              <label className="text-[#171717] text-[1.125rem]">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a suitable caption explaining your performance..."
                rows="3"
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#f5a24c]"
              />
            </div>

            <p className="text-black font-sans text-[1rem] leading-[1.4rem]">
              Note: Our team will review your entry. Once approved, you will be
              notified via email and SMS.
            </p>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="mt-4">
              <DecoratedButton
                type="submit"
                disabled={loading}
                className={`transition-all inline-flex items-center ${
                  loading ? "opacity-60 cursor-not-allowed" : "hover:scale-105"
                }`}
              >
                Register
              </DecoratedButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
