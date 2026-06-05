
// src/pages/SignInPage.js
import React, { useState } from 'react';
import axios from 'axios';
// We use the original, reliable GoogleLogin component
import { GoogleLogin } from '@react-oauth/google';
import AuthLayout from '../components/AuthPage/AuthLayout.js';
import DecoratedInput from '../components/AuthPage/DecoratedInput.js';
import DecoratedPasswordInput from '../components/AuthPage/DecoratedPasswordInput.js';
import DecoratedButton from '../components/AuthPage/DecoratedButton.js';
import { ReactComponent as NewInputDeco } from '../assets/new-input-deco.svg';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${BASE_URL}/login/`, { email, password });
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      window.location.href = '/profile';
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    }
  };

  // This is the original, working success handler. It expects the 'credential' token.
  const handleGoogleSuccess = async credentialResponse => {
    try {
      const token = credentialResponse.credential;
      const res = await axios.post(`${BASE_URL}/api/auth/google/`, { token });
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      if (res.data.needs_completion) {
        window.location.href = '/complete-profile';
      } else {
        window.location.href = '/profile';
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Google login failed.');
    }
  };
  
  return (
    React.createElement(AuthLayout, { promoTitle: "WELCOME BACK!", promoSubtitle: "Sign in to continue your journey with us" },
      React.createElement('h2', { className: "font-display text-3xl font-bold text-gray-800" }, "SIGN IN"),
      React.createElement('p', { className: "text-brand-gray mt-2" }, "If you don't have an account? ", React.createElement('a', { href: "/register", className: "text-dark-orange font-semibold" }, "Sign up")),
      
      React.createElement('form', { className: "mt-8", onSubmit: handleSubmit },
        React.createElement('div', { className: 'space-y-4' },
          React.createElement(DecoratedInput, { key: 'email', id: "email", label: "Email ID", type: "email", placeholder: "Enter your email", value: email, onChange: e => setEmail(e.target.value), required: true }),
          React.createElement(DecoratedPasswordInput, { key: 'password', id: "password", label: "Password", placeholder: "Enter your Password", value: password, onChange: e => setPassword(e.target.value), required: true })
        ),
        
        error && React.createElement('p', { key: 'error', className: "text-sm text-brand-red text-center mt-4" }, error),
        React.createElement('div', { key: 'forgot-link', className: 'text-right mt-2' }, 
          React.createElement('a', {href: '/forgot-password', className: 'text-sm text-dark-orange hover:underline'}, 'Forgot password?')
        ),
        
        React.createElement('div', { key: 'divider', className: 'my-6 flex items-center' },
          React.createElement('div', { className: 'flex-grow border-t border-gray-300' }),
          React.createElement('span', { className: 'mx-4 text-gray-500 text-sm' }, 'Or'),
          React.createElement('div', { className: 'flex-grow border-t border-gray-300' })
        ),
        
        // --- CORRECTED AND STYLED GOOGLE LOGIN BUTTON ---
        React.createElement('div', { key: 'google-btn', className: 'flex justify-center' },
          React.createElement(GoogleLogin, {
            onSuccess: handleGoogleSuccess,
            onError: () => setError('Google login failed'),
            // These props style the button to match your design
            theme: 'outline',
            text: 'signin_with',
            shape: 'rectangular',
            width: '100%' // Ensures it takes the full width available
          })
        ),
        
        React.createElement('div', { key: 'bottom-buttons', className: 'mt-8 flex items-center justify-between' },
          React.createElement('a', {
            href: '/register',
            className: 'relative h-10 flex items-center justify-center px-6 group focus:outline-none'
          },
            React.createElement(NewInputDeco, {
              className: 'absolute inset-0 w-full h-full text-black group-hover:text-dark-orange transition-colors duration-200',
              preserveAspectRatio: 'none'
            }),
            React.createElement('span', { className: 'relative z-10 text-sm font-medium text-gray-800' },
              'Create New Account'
            )
          ),
          
          React.createElement(DecoratedButton, {
              type: 'submit',
              className: 'justify-center'
          }, "Sign In")
        )
      )
    )
  );
};

export default SignInPage;