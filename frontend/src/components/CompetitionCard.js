import React from "react";
import { useNavigate } from "react-router-dom";

const CompetitionCard = ({ name, description, prize, image }) => {
  return (
    <div className="relative w-full h-64 overflow-hidden rounded-xl cursor-pointer group">
      {/* Background Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Default Content (Visible) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white transition-opacity duration-300 group-hover:opacity-0">
        <h3 className="text-xl font-bold">{name}</h3>
        <button className="mt-3 bg-neutral-100 text-black font-semibold px-4 py-1 rounded-md hover:bg-neutral-200">
          Registration
        </button>
      </div>

      {/* Hover Overlay (Hidden → Visible) */}
      <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-center text-white px-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        {description && (
          <p className="text-sm mb-3">{description}</p>
        )}
        {prize && (
          <p className="font-bold mb-3">
            Price worth <span className="text-red-500">{prize}</span>
          </p>
        )}
        <button className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-orange-600">
          Registration
        </button>
      </div>
    </div>
  );
};

export default CompetitionCard;
