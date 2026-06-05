import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../components/AuthPage/AuthLayout.js';
import DecoratedPasswordInput from '../components/AuthPage/DecoratedPasswordInput.js';
import DecoratedButton from '../components/AuthPage/DecoratedButton.js';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Get the navigation state passed from the previous page
    const location = useLocation();
    const navigate = useNavigate();
    const token = location.state?.token;

    // Redirect user if they land on this page without a token
    useEffect(() => {
        if (!token) {
            console.error("No reset token found. Redirecting...");
            navigate('/forgot-password'); // Redirect to start the flow over
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
        if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
        
        if (!token) {
            setError('Invalid session. Please request a new password reset link.');
            return;
        }

        try {
            // Connect to the new backend endpoint to confirm the reset
            await axios.post(`${BASE_URL}/reset-password-confirm/`, { 
                token: token, 
                password: password,
                confirm_password: confirmPassword
            });
            
            setSuccess('Your password has been reset successfully! Redirecting to login...');
            setPassword('');
            setConfirmPassword('');
            
            // Redirect to login page after a 3-second delay
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to reset password. The link may have expired.');
        }
    };
    
    const formFields = [
        React.createElement(DecoratedPasswordInput, { key: 'password', id: "password", label: "Set New Password", placeholder: "Create a new password", value: password, onChange: e => setPassword(e.target.value), required: true }),
        React.createElement(DecoratedPasswordInput, { key: 'confirmPassword', id: "confirmPassword", label: "Confirm New Password", placeholder: "Re-enter new password", value: confirmPassword, onChange: e => setConfirmPassword(e.target.value), required: true }),
        error && React.createElement('p', { key: 'error', className: 'text-sm text-brand-red text-center' }, error),
        success && React.createElement('p', { key: 'success', className: 'text-sm text-green-600 text-center' }, success),
        React.createElement('div', { key: 'submit-wrapper', className: 'flex justify-end pt-4' },
            React.createElement(DecoratedButton, { type: 'submit' }, 'Reset Password')
        )
    ];

    return (
        React.createElement(AuthLayout, { promoTitle: "RESET YOUR PASSWORD", promoSubtitle: "No worries, we've got you covered" },
            React.createElement('h2', { className: 'font-display text-3xl font-semibold text-gray-800' }, 'RESET PASSWORD'),
            React.createElement('p', { className: 'text-brand-gray mt-2' }, "Enter your new password below to reset it."),
            React.createElement('form', { className: 'mt-8 space-y-4', onSubmit: handleSubmit }, formFields)
        )
    );
};

export default ResetPasswordPage;