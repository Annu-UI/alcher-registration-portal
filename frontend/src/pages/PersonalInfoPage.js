import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { useRegistration } from '../components/AuthPage/RegistrationContext.js';
import AuthLayout from '../components/AuthPage/AuthLayout.js';
import DecoratedInput from '../components/AuthPage/DecoratedInput.js';
import DecoratedPasswordInput from '../components/AuthPage/DecoratedPasswordInput.js';
import DecoratedButton from '../components/AuthPage/DecoratedButton.js';
import Stepper from '../components/AuthPage/Stepper.js';

// Using your specified import paths
import { ReactComponent as CountryCodeInputBG } from '../assets/countryCode-input-bg.svg';
import { ReactComponent as InputDeco } from '../assets/input-deco.svg';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const PersonalInfoPage = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useRegistration();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  // Google Sign-Up logic
  const handleGoogleSuccess = async (credentialResponse) => {
    setError(''); // Clear any previous form errors
    try {
      const token = credentialResponse.credential;
      const backendResponse = await axios.post(`${BASE_URL}/auth/google/`, { token });

      localStorage.setItem('access', backendResponse.data.access);
      localStorage.setItem('refresh', backendResponse.data.refresh);

      if (backendResponse.data.needs_completion) {
        navigate('/complete-profile');
      } else {
        navigate('/profile'); // Or to the main dashboard
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Google sign-up failed. The email might already be in use.');
    }
  };

  // All existing handlers remain unchanged
  const handleChange = e => { 
    updateFormData({ [e.target.id || e.target.name]: e.target.value }); 
  };
  const handlePhoneChange = e => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    updateFormData({ [e.target.id]: numericValue });
  };
  const handleCountryCodeChange = e => {
    let value = e.target.value;
    let digits = value.replace(/[^0-9]/g, '');
    value = '+' + digits;
    updateFormData({ country_code: value });
  };
  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (formData.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    updateFormData({ confirm_password: confirmPassword });
    navigate('/register/team-info');
  };

  // The createPhoneInput helper function remains unchanged
  const createPhoneInput = (id, label) => {
    return (
      React.createElement('div', { key: id },
        React.createElement('label', { htmlFor: id, className: "block text-xs font-medium text-gray-700 mb-1" }, label),
        React.createElement('div', { className: 'flex items-center' },
          React.createElement('div', { className: 'relative h-8 w-10 mr-3 group' },
            React.createElement(CountryCodeInputBG, { 
              className: "absolute top-0 left-0 w-full h-full text-gray-800 group-focus-within:text-dark-orange transition-colors duration-200 pointer-events-none",
              preserveAspectRatio: "none"
            }),
            React.createElement('input', {
              type: 'text',
              name: 'country_code',
              id: 'country_code',
              value: formData.country_code,
              onChange: handleCountryCodeChange,
              maxLength: 4,
              className: 'relative z-10 w-full h-full bg-transparent border-none focus:outline-none text-center text-sm text-gray-800'
            })
          ),
          React.createElement('div', { className: 'flex-grow' },
            React.createElement('div', { className: "relative h-8 group" }, 
              React.createElement(InputDeco, { 
                className: "absolute top-0 left-0 w-full h-full text-gray-800 group-focus-within:text-dark-orange transition-colors duration-200 pointer-events-none",
                preserveAspectRatio: "none" 
              }),
              React.createElement('input', {
                id: id,
                name: id,
                type: 'tel',
                placeholder: 'Enter your phone number',
                value: formData[id],
                onChange: handlePhoneChange,
                className: "relative z-10 w-full h-full bg-transparent border-none focus:outline-none px-3 text-sm text-gray-800 placeholder:text-gray-500"
              })
            )
          )
        )
      )
    );
  };
  
  // The formFields array remains completely unchanged
  const formFields = [
      React.createElement(DecoratedInput, { key: 'fullname', id: "fullname", label: "Full Name", placeholder: "Enter your full name", value: formData.fullname, onChange: handleChange, required: true }),
      React.createElement(DecoratedInput, { key: 'username', id: "username", name:"username", label: "Username", placeholder: "Create a username", value: formData.username, onChange: handleChange, required: true }),
      createPhoneInput('phone_number', 'Phone Number'),
      createPhoneInput('alternate_phone', 'Alternative Phone Number'),
      React.createElement(DecoratedInput, { key: 'email', id: "email", label: "Email ID", type: "email", placeholder: "Enter your email", value: formData.email, onChange: handleChange, required: true }),
      React.createElement(DecoratedPasswordInput, { key: 'password', id: "password", label: "Set Password", placeholder: "Create a Password", value: formData.password, onChange: handleChange, required: true }),
      React.createElement('p', {key: 'pw-hint', className: 'text-[10px] text-gray-500'}, 'Must be at least 8 characters'),
      React.createElement(DecoratedPasswordInput, { key: 'confirm_password', id: "confirm_password", label: "Confirm Password", placeholder: "Re-enter Password", value: confirmPassword, onChange: e => setConfirmPassword(e.target.value), required: true }),
      React.createElement('p', {key: 'mandatory', className: 'text-[10px] text-brand-red'}, '*All fields are mandatory'),
      error && React.createElement('p', { key: 'error', className: "text-xs text-brand-red text-center" }, error),
      React.createElement('div', { key: 'submit-wrapper', className: 'flex justify-end pt-1' },
        React.createElement(DecoratedButton, { type: 'submit' }, 'Confirm')
      )
  ];

  return (
    React.createElement(AuthLayout, null,
      // --- RESPONSIVE HEADER ---
      // On mobile (default): flex-col stacks items vertically with a gap.
      // On medium screens and up (md:): flex-row places items side-by-side.
      React.createElement('div', { className: 'flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-2 mb-2' },
        React.createElement('div', null,
          React.createElement('h2', { className: "font-display text-2xl font-bold text-gray-800" }, "CREATE NEW ACCOUNT."),
          React.createElement('p', { className: "text-brand-gray mt-1 text-xs" }, "Already a member? ", React.createElement('a', { href: "/signin", className: "text-dark-orange font-semibold" }, "Sign in"))
        ),
        React.createElement(GoogleLogin, {
          onSuccess: handleGoogleSuccess,
          onError: () => {
            setError('Google sign-up failed. Please try again.');
          },
          theme: 'outline',
          text: 'signup_with',
          shape: 'rectangular',
        })
      ),
      React.createElement(Stepper, { currentStep: 1 }),
      React.createElement('hr', { className: 'my-4 border-gray-200'}),
      React.createElement('form', { className: "mt-4 space-y-2", onSubmit: handleNext }, formFields)
    )
  );
};

export default PersonalInfoPage;