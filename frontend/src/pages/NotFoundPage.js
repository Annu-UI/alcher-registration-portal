// src/pages/NotFoundPage.js
import React from 'react';
import backgroundPattern from '../assets/background-pattern.svg';
import { ReactComponent as ErrorSVG } from '../assets/404error.svg';
import FuzzyText from '../animation/FuzzyText';

const NotFoundPage = () => {
  const patternOverlayStyle = {
    backgroundImage: `url(${backgroundPattern})`,
    backgroundRepeat: 'repeat',
    filter: 'brightness(90%) contrast(110%)',
  };

  const enableHover = true;
  const hoverIntensity = 0.5;

  return (
    React.createElement('div', { className: 'relative min-h-screen bg-brand-beige flex items-center justify-center' },
      
      React.createElement('div', {
        
        className: 'landingbg absolute inset-0 opacity-100',
      }),
      
      React.createElement('div', { className: 'relative z-10' },
        <div className='flex flex-col justify-center items-center'>
          {/* <div className='text-alch-red font-display font-bold text-[128px]'>404</div>
          <p className='text-alch-red font-display text-[40px] font-bold -mt-[20px] p-0' >OOPS!</p> */}
          <FuzzyText baseIntensity={0.2} hoverIntensity={hoverIntensity} enableHover={enableHover} className="!text-alch-red font-display font-bold text-[128px]">404</FuzzyText>
          <FuzzyText baseIntensity={0.2} hoverIntensity={hoverIntensity} enableHover={enableHover} fontSize="3rem" className="mt-[20px]">OOPS!</FuzzyText>
        </div>
      )
    )
  );
};

export default NotFoundPage;