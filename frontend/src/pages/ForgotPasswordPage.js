import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../components/AuthPage/AuthLayout.js';
import DecoratedInput from '../components/AuthPage/DecoratedInput.js'; 
import DecoratedButton from '../components/AuthPage/DecoratedButton.js';
import OtpModal from '../components/AuthPage/OtpModal.js';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const ForgotPasswordPage = () => {
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Sends the OTP and opens the modal on success
    const sendOtp = async () => {
        setError('');
        setSuccess('');
        if (!email) {
            setError('Please enter your email address.');
            return false; // Indicate failure
        }
        setLoading(true);
        try {
            // Connect to the new backend endpoint for sending the reset OTP
            await axios.post(`${BASE_URL}/forgot-password/`, { email });
            setSuccess(`An OTP has been sent to ${email}.`);
            setLoading(false);
            return true; // Indicate success
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to send OTP. Please check the email and try again.');
            setLoading(false);
            return false; // Indicate failure
        }
    };

    // Step 1: Handle submitting the email to get an OTP
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        const wasOtpSent = await sendOtp();
        if (wasOtpSent) {
            setIsOtpModalOpen(true); // Open the modal on success
        }
    };
    
    // This now accepts the response data from the modal
    // It expects `data` to be an object like { reset_token: "..." }
    const handleVerificationSuccess = (data) => {
        setIsOtpModalOpen(false);
        if (data && data.reset_token) {
            // Navigate to the reset page, passing the token in the state
            navigate('/reset-password', { state: { token: data.reset_token } });
        } else {
            setError("Verification succeeded, but the reset token was not received. Please try again.");
        }
    };
    
    // This calls the same sendOtp function for the modal's "resend" button
    const handleResendOtp = () => {
        console.log("Resending OTP from modal...");
        sendOtp(); // Re-use the same OTP sending logic
    };

    // The main page content (email form)
    const mainContent = () => {
        const formFields = [
            React.createElement(DecoratedInput, { key: 'email', id: "email", type: "email", label: "Email Address", placeholder: "Enter your registered email", value: email, onChange: e => setEmail(e.target.value), required: true }),
            error && React.createElement('p', { key: 'error', className: 'text-sm text-brand-red text-center' }, error),
            success && React.createElement('p', { key: 'success', className: 'text-sm text-green-600 text-center' }, success),
            React.createElement('div', { key: 'submit-wrapper', className: 'flex justify-end pt-4' },
                React.createElement(DecoratedButton, { type: 'submit', disabled: loading }, loading ? 'Sending...' : 'Request Reset')
            )
        ];

        return React.createElement(AuthLayout, { promoTitle: "FORGOT YOUR PASSWORD?", promoSubtitle: "Enter your email to get a reset code" },
            React.createElement('h2', { className: 'font-display text-3xl font-semibold text-gray-800' }, 'FORGOT PASSWORD'),
            React.createElement('p', { className: 'text-brand-gray mt-2' }, "We'll send a verification code to your email."),
            React.createElement('form', { className: 'mt-8 space-y-4', onSubmit: handleEmailSubmit }, formFields)
        );
    };

    return (
        // Using React.Fragment to return multiple elements
        React.createElement(React.Fragment, null,
            mainContent(),
            isOtpModalOpen && React.createElement(OtpModal, {
                email: email,
                onClose: () => setIsOtpModalOpen(false),
                onVerifySuccess: handleVerificationSuccess,
                onResend: handleResendOtp
            })
        )
    );
};

export default ForgotPasswordPage;