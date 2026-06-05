// src/pages/TeamInfoPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../components/AuthPage/RegistrationContext.js';
import AuthLayout from '../components/AuthPage/AuthLayout.js';
import DecoratedInput from '../components/AuthPage/DecoratedInput.js';
import DecoratedButton from '../components/AuthPage/DecoratedButton.js';
import Stepper from '../components/AuthPage/Stepper.js';
import OtpModal from '../components/AuthPage/OtpModal.js';


const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const TeamInfoPage = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useRegistration();
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- NEW STATE MANAGEMENT ---
  const [isLoading, setIsLoading] = useState(false);
  const [isAwaitingOtp, setIsAwaitingOtp] = useState(false);

  const handleChange = e => {
    updateFormData({ [e.target.id]: e.target.value });
  };

  // --- REFACTORED REGISTRATION LOGIC ---
  // This function now handles both the initial registration request and subsequent "resend" requests.
  const handleRegistrationOrResend = async () => {
    setIsLoading(true);
    setError('');

    const requestData = {
      fullname: formData.fullname,
      username: formData.username,
      phone_number: formData.country_code + formData.phone_number,
      alternate_phone: formData.alternate_phone ? formData.country_code + formData.alternate_phone : '',
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirm_password,
      collegename: formData.collegename,
      city: formData.city,
      state: formData.state,
      team_name: formData.teamName,
    };

    try {
      const response = await fetch(`${BASE_URL}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Use the detailed error message from the backend
        const errorMessage = data.detail || Object.values(data).join(' ');
        throw new Error(errorMessage || 'Registration failed.');
      }

      // If successful, the backend has sent an OTP.
      // Now, we switch the UI to the "awaiting OTP" state.
      setIsAwaitingOtp(true);
      setIsModalOpen(true);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW: Wrapper for the initial form submission ---
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleRegistrationOrResend();
  };
  
  const onOtpSuccess = () => {
    setIsModalOpen(false);
    navigate('/signin');
  };

  // --- UI for the registration form ---
  const registrationForm = () => {
    const buttonContainer = React.createElement('div', { key: 'submit-wrapper', className: 'flex justify-between items-center pt-4' },
      React.createElement(DecoratedButton, { type: 'button', onClick: () => navigate(-1) }, 'Back'),
      React.createElement(DecoratedButton, { type: 'submit', disabled: isLoading }, isLoading ? 'Creating...' : 'Create Account')
    );

    const formFields = [
      React.createElement(DecoratedInput, { key: 'teamName', id: "teamName", label: "Team Name", placeholder: "Team name (Your name/solo)", value: formData.teamName, onChange: handleChange, required: true }),
      React.createElement(DecoratedInput, { key: 'collegename', id: "collegename", label: "College Name", placeholder: "Enter your college name", value: formData.collegename, onChange: handleChange, required: true }),
      React.createElement(DecoratedInput, { key: 'city', id: "city", label: "College City", placeholder: "Enter your college city", value: formData.city, onChange: handleChange, required: true }),
      React.createElement(DecoratedInput, { key: 'state', id: "state", label: "College State", placeholder: "Enter your college state", value: formData.state, onChange: handleChange, required: true }),
      React.createElement('p', { key: 'mandatory', className: 'text-xs text-brand-red -mt-2' }, '*All fields are mandatory'),
      error && React.createElement('p', { key: 'error', className: "text-sm text-brand-red text-center mt-2" }, error),
      buttonContainer
    ];

    return React.createElement('form', { className: "mt-4 space-y-4", onSubmit: handleFormSubmit }, formFields);
  };
  
  // --- NEW: UI for the "awaiting verification" state ---
  const awaitingVerificationView = () => {
    return React.createElement('div', { className: 'text-center mt-8' },
      React.createElement('p', { className: 'text-brand-gray' }, 'We have sent a verification OTP to your email address:'),
      React.createElement('p', { className: 'font-semibold text-gray-800 my-2' }, formData.email),
      React.createElement('p', { className: 'text-sm text-brand-gray' }, 'Please enter the OTP to complete your registration.'),
      React.createElement('div', { className: 'mt-6' },
        React.createElement(DecoratedButton, { 
          onClick: handleRegistrationOrResend, 
          disabled: isLoading 
        }, isLoading ? 'Resending...' : 'Resend OTP')
      ),
      error && React.createElement('p', { key: 'error', className: "text-sm text-brand-red text-center mt-2" }, error)
    );
  };

  return (
    React.createElement(AuthLayout, null,
      isModalOpen && React.createElement(OtpModal, {
        onClose: () => setIsModalOpen(false),
        onVerifySuccess: onOtpSuccess,
        email: formData.email,
        onResend: handleRegistrationOrResend // Pass the resend function to the modal
      }),
      
      React.createElement('div', { className: 'relative' },
        React.createElement('h2', { className: "font-display text-2xl font-bold text-gray-800" }, "CREATE NEW ACCOUNT."),
        React.createElement('p', { className: "text-brand-gray mt-1 text-xs" }, "Already a member? ", React.createElement('a', { href: "/signin", className: "text-dark-orange font-semibold" }, "Sign in")),
        React.createElement(Stepper, { currentStep: 2 }),
        
        // --- Conditionally render the form or the "awaiting" view ---
        isAwaitingOtp ? awaitingVerificationView() : registrationForm()
      )
    )
  );
};

export default TeamInfoPage;