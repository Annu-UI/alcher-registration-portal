// src/components/AuthPage/Stepper.js
import React from 'react';
import { ReactComponent as Step1 } from '../../assets/step1.svg';
import { ReactComponent as Step1DN } from '../../assets/step1-dn.svg'; // new SVG
import { ReactComponent as Step2Active } from '../../assets/step2-active.svg';
import { ReactComponent as Step2Inactive } from '../../assets/step2-inactive.svg';

const Stepper = ({ currentStep = 1 }) => {
  const lineClass = currentStep === 1 ? 'bg-gray-300' : 'bg-gray-400';

  // Text classes based on current step
  const step1TextClass = currentStep === 1 ? 'text-dark-orange font-semibold' : 'text-gray-500';
  const step2TextClass = currentStep === 2 ? 'text-dark-orange font-semibold' : 'text-gray-500';

  return (
    <div className="mt-4">
      <div className="flex items-center relative">
        {/* Step 1 */}
        {currentStep === 2 ? <Step1DN /> : <Step1 />}

        {/* Line */}
        <div className={`flex-auto h-2 mx-8 transition-colors duration-300 ${lineClass}`} />

        {/* Step 2 */}
        {currentStep === 1 ? <Step2Inactive /> : <Step2Active />}
      </div>

      {/* Step labels */}
      <div className="flex justify-between text-xs mt-1 px-1">
        <span className={step1TextClass}>Personal info</span>
        <span className={step2TextClass}>Team info</span>
      </div>
    </div>
  );
};

export default Stepper;
