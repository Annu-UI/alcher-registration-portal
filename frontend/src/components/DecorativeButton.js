// src/components/DecorativeButton.js

//import React from 'react';
import { Link } from 'react-router-dom';

// Assumes assets are in 'src/assets/' and this file is in 'src/components/'
import buttonFrameOrange from '../assets/button-frame-orange.svg';
import buttonFrameOrangeSm from '../assets/button-frame-orange-sm.svg';
import buttonFrameCream from '../assets/button-frame-cream.svg';
import navFrameDark from '../assets/nav-frame-dark.svg';

const DecorativeButton = ({ to, children, variant = 'orange', onClick }) => {
  if (variant === 'nav') {
    return (
      <Link to={to} className="relative inline-block group font-bold h-16">
        <img 
          src={buttonFrameCream}
          alt="" 
          className="h-full transition-transform duration-300 group-hover:scale-105" 
        />
        <img 
          src={navFrameDark}
          alt="" 
          className="absolute inset-0 h-full w-full p-2"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </Link>
    );
  }

  // Logic for standard buttons
  let frameSrc = '';
  let textClass = 'text-alch-cream';
  let heightClass = 'h-14'; // Default height

  if (variant === 'orange') {
    frameSrc = buttonFrameOrange;
  } else if (variant === 'orange-sm') {
    // New variant for the smaller login button
    frameSrc = buttonFrameOrangeSm;
    heightClass = 'h-12'; // Smaller height
  } else if (variant === 'cream') {
    frameSrc = buttonFrameCream;
    textClass = 'text-alch-dark';
  }

  return (
    <Link to={to} onClick={onClick} className="relative inline-block group font-bold">
      <img 
        src={frameSrc}
        alt="" 
        className={`${heightClass} transition-transform duration-300 group-hover:scale-105`} 
      />
      <span className={`absolute inset-0 flex items-center justify-center ${textClass}`}>
        {children}
      </span>
    </Link>
  );
};

export default DecorativeButton;