import React from 'react';
import { ReactComponent as InputDeco } from '../../assets/input-deco.svg';

const DecoratedInput = ({ id, label, type = 'text', ...props }) => {
  const inputProps = {
    id,
    name: id,
    type,
    className:
      "absolute inset-0 z-10 w-full h-full bg-transparent border-none focus:outline-none px-3 text-sm font-sans text-gray-800 placeholder:text-gray-500",
    ...props,
  };

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-xs font-medium text-black font-sans mb-1"
      >
        {label}
      </label>

      {/* ✅ CHANGED from aspect-[393/33] to h-8 for consistency */}
      <div className="relative w-full h-8 group">
        {/* SVG frame — scales responsively but keeps its ratio */}
        <InputDeco
          className="absolute top-0 left-0 w-full h-full text-rgba(23, 23, 23, 0.40) font-sans group-hover:text-dark-orange group-focus-within:text-dark-orange font-sans transition-colors duration-300 pointer-events-none"
          preserveAspectRatio="none"
        />

        {/* Input field — fills inside the SVG */}
        <input {...inputProps} />
      </div>
    </div>
  );
};

export default DecoratedInput;