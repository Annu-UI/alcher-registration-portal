import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // It's good practice to use this for navigation

// UI Component Imports
import AuthLayout from '../components/AuthPage/AuthLayout.js';
import DecoratedInput from '../components/AuthPage/DecoratedInput.js';
import DecoratedButton from '../components/AuthPage/DecoratedButton.js';

// NEW: Importing SVG assets for the phone input design
import { ReactComponent as CountryCodeInputBG } from '../assets/countryCode-input-bg.svg';
import { ReactComponent as InputDeco } from '../assets/input-deco.svg';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const CompleteProfilePage = () => {
  const navigate = useNavigate(); // Using React Router's navigate
  
  // State logic with the new team_name field
  const [fullname, setFullname] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone_number, setPhoneNumber] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [team_name, setTeamName] = useState(''); // NEW: Team Name state
  const [collegename, setCollegeName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState('');

  // --- NEW: Handlers adapted from your reference file ---
  const handleCountryCodeChange = e => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    setCountryCode('+' + value);
  };
  
  const handleMainPhoneChange = e => {
    setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''));
  };

  const handleAlternatePhoneChange = e => {
    setAlternatePhone(e.target.value.replace(/[^0-9]/g, ''));
  };

  // --- handleSubmit updated with the new team_name field ---
  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    setError('');

    try {
      await axios.post(
        `${BASE_URL}/auth/complete-profile/`,
        {
          fullname,
          phone_number: countryCode + phone_number,
          alternate_phone: alternatePhone ? countryCode + alternatePhone : '',
          team_name, // <-- Added team_name to the submission data
          collegename,
          city,
          state,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Note for backend: Ensure your `complete_profile` view in views.py can handle `team_name`.
      navigate('/profile'); // Using navigate is generally better than window.location.href
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile. Please check your inputs.');
    }
  };

  // --- NEW: createPhoneInput helper function adapted from your reference ---
  const createPhoneInput = (id, label, value, onChangeHandler) => {
    return (
      React.createElement('div', { key: id },
        React.createElement('label', { htmlFor: id, className: "block text-xs font-medium text-gray-700 mb-1" }, label),
        React.createElement('div', { className: 'flex items-center' },
          React.createElement('div', { className: 'relative h-8 w-14 mr-3 group' },
            React.createElement(CountryCodeInputBG, { 
              className: "absolute top-0 left-0 w-full h-full text-gray-800 group-focus-within:text-dark-orange transition-colors duration-200 pointer-events-none",
              preserveAspectRatio: "none"
            }),
            React.createElement('input', {
              type: 'text',
              name: 'country_code',
              value: countryCode,
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
                placeholder: 'Enter phone number',
                value: value,
                onChange: onChangeHandler,
                className: "relative z-10 w-full h-full bg-transparent border-none focus:outline-none px-3 text-sm text-gray-800 placeholder:text-gray-500"
              })
            )
          )
        )
      )
    );
  };
  
  const formFields = [
    React.createElement(DecoratedInput, { key: 'fullname', id: "fullname", label: "Full Name", placeholder: "Enter your full name", value: fullname, onChange: e => setFullname(e.target.value), required: true }),
    createPhoneInput('phone_number', 'Phone Number', phone_number, handleMainPhoneChange),
    createPhoneInput('alternate_phone', 'Alternate Phone Number (Optional)', alternatePhone, handleAlternatePhoneChange),
    React.createElement(DecoratedInput, { key: 'team_name', id: "team_name", label: "Team Name", placeholder: "Enter your team name", value: team_name, onChange: e => setTeamName(e.target.value), required: true }),
    React.createElement(DecoratedInput, { key: 'collegename', id: "collegename", label: "College Name", placeholder: "Enter your college name", value: collegename, onChange: e => setCollegeName(e.target.value), required: true }),
    React.createElement(DecoratedInput, { key: 'city', id: "city", label: "City", placeholder: "Enter your city", value: city, onChange: e => setCity(e.target.value), required: true }),
    React.createElement(DecoratedInput, { key: 'state', id: "state", label: "State", placeholder: "Enter your state", value: state, onChange: e => setState(e.target.value), required: true }),
    
    error && React.createElement('p', { key: 'error', className: 'text-sm text-brand-red text-center' }, error),
    
    React.createElement('div', { key: 'submit-wrapper', className: 'flex justify-end pt-4' },
      React.createElement(DecoratedButton, { type: 'submit' }, 'Save & Continue')
    )
  ];

  return (
    React.createElement(AuthLayout, { promoTitle: "ONE LAST STEP", promoSubtitle: "Let's get your profile details right" },
      React.createElement('h2', { className: 'font-display text-3xl font-bold text-gray-800' }, 'COMPLETE YOUR PROFILE'),
      React.createElement('p', { className: 'text-brand-gray mt-2' }, "Please fill in the details below to continue."),
      React.createElement('form', { className: 'mt-8 space-y-4', onSubmit: handleSubmit }, formFields)
    )
  );
};

export default CompleteProfilePage;