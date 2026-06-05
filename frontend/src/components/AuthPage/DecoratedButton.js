// src/components/AuthPage/DecoratedButton.js
import React from 'react';
import { Link } from 'react-router-dom';

// Import all the SVG frames you might need
import { ReactComponent as ButtonFrameOrange } from '../../assets/button-frame-orange.svg';
import { ReactComponent as ButtonFrameCream } from '../../assets/button-frame-cream.svg';

const DecoratedButton = ({ 
  children, 
  to, 
  onClick, 
  type = 'button', 
  variant = 'orange', // 'orange' or 'cream'
  size = 'md'        // 'sm' (small, 32px) or 'md' (medium, 38px)
}) => {
  // Determine if this is a link or a button
  const isLink = !!to;
  const Component = isLink ? Link : 'button';

  // --- Dynamic Styling based on Props ---
  const sizeClasses = size === 'sm' ? 'h-8' : 'h-[38px]';
  
  let frameClasses = 'text-brand-orange group-hover:text-dark-orange';
  let textClasses = 'text-black group-hover:text-brand-beige';

  if (variant === 'cream') {
    frameClasses = 'text-brand-beige group-hover:text-white';
    textClasses = 'text-brand-dark';
  }

  // Choose the right SVG component based on the variant
  const FrameComponent = variant === 'cream' ? ButtonFrameCream : ButtonFrameOrange;
  
  // --- Props for the root component (either <Link> or <button>) ---
  const componentProps = {
    onClick: onClick,
    className: `relative ${sizeClasses} group inline-flex items-center justify-center`
  };

  if (isLink) {
    componentProps.to = to;
  } else {
    componentProps.type = type;
  }

  return (
    React.createElement(Component, componentProps,
      React.createElement(FrameComponent, {
        className: `absolute top-0 left-0 w-full h-full transition-colors duration-200 pointer-events-none ${frameClasses}`,
        preserveAspectRatio: "none"
      }),
      
      // --- THIS IS THE RESPONSIVE FIX ---
      // On mobile (default): text is 'text-xs' and padding is 'px-4'.
      // On medium screens and up (md:): text is 'text-sm' and padding is 'px-8'.
      React.createElement('span', { className: `relative z-10 font-bold text-xs md:text-sm px-4 md:px-8 ${textClasses}` }, children)
    )
  );
};

export default DecoratedButton;