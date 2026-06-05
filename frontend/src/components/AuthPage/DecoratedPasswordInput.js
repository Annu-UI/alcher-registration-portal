// src/components/AuthPage/DecoratedPasswordInput.js
import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import DecoratedInput from './DecoratedInput';

const DecoratedPasswordInput = ({ id, label, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const buttonProps = {
    type: 'button',
    onClick: () => setShowPassword(!showPassword),
    className: 'absolute top-7 right-3 z-20 text-gray-500 hover:text-gray-800'
  };

  const icon = showPassword 
    ? React.createElement(FiEye, { className: 'w-4 h-4' })      
    : React.createElement(FiEyeOff, { className: 'w-4 h-4' });  

  return (
    React.createElement('div', { className: 'relative' },
      React.createElement(DecoratedInput, {
        id: id,
        label: label,
        type: showPassword ? 'text' : 'password',
        ...props
      }),
      React.createElement('button', buttonProps, icon)
    )
  );
};

export default DecoratedPasswordInput;