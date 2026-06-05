import React, { useEffect, useState } from "react";
import "././assets/background-pattern.svg";

const Competitions = ({ onSelectCompetition }) => {
  const [competitions, setCompetitions] = useState([]);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetch(`${backendUrl}/api/competitions/`) // your backend API
      .then((response) => response.json())
      .then((data) => setCompetitions(data))
      .catch((error) => console.error("Error fetching competitions:", error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Competitions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {competitions.map((competition) => (
          <div
            key={competition.id}
            className="p-4 bg-white shadow rounded-lg cursor-pointer hover:shadow-lg transition"
            onClick={() => onSelectCompetition(competition)}
          >
            <h2 className="text-xl font-semibold">{competition.name}</h2>
            <p className="text-gray-600">{competition.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Competitions;
