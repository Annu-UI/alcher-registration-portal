// src/components/AuthPage/RegistrationContext.js
import React, { createContext, useState, useContext } from 'react';

const RegistrationContext = createContext();
export const RegistrationProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    confirm_password: '',
    country_code: '+91',
    phone_number: '',
    alternate_phone: '',
    teamName: '',
    collegename: '',
    city: '',
    state: '',
  });
  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };
  const value = { formData, updateFormData };
  return React.createElement(RegistrationContext.Provider, { value }, children);
};
export const useRegistration = () => useContext(RegistrationContext);