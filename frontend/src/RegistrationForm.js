import { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css';
import { GoogleLogin } from '@react-oauth/google';
import countryCodes from './countryCodes'; // Make sure you have this file

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

function RegistrationForm() {
  const [profile, setProfile] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    confirm_password: '',
    phone_number: '',
    alternate_phone: '',
    country_code: '+91',
  });
  const [team, setTeam] = useState({ collegename: '', city: '', state: '' });
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleProfileChange = e =>
    setProfile({ ...profile, [e.target.name]: e.target.value });
  const handleTeamChange = e =>
    setTeam({ ...team, [e.target.name]: e.target.value });

  const handleProfileSubmit = e => {
    e.preventDefault();
    if (profile.password !== profile.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleTeamSubmit = async e => {
    e.preventDefault();
    try {
      const requestData = {
        ...profile,
        phone_number: profile.country_code + profile.phone_number,
        alternate_phone: profile.alternate_phone
          ? profile.country_code + profile.alternate_phone
          : '',
        collegename: team.collegename,
        city: team.city,
        state: team.state,
      };
      await axios.post(`${BASE_URL}/register/`, requestData);
      setError('');
      setSuccess('OTP sent to your email.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.');
    }
  };

  const handleOtpSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/verify-otp/`, {
        email: profile.email,
        otp,
      });
      setSuccess('Registration complete!');
    } catch (err) {
      setError(err.response?.data?.detail || 'OTP verification failed.');
    }
  };

  // Google Registration
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
      alert(err.response?.data?.detail || 'Google registration failed');
    }
  };

  return (
    <div>
      {step === 1 && (
        <form onSubmit={handleProfileSubmit}>
          <input
            name="fullname"
            value={profile.fullname}
            onChange={handleProfileChange}
            placeholder="Full Name"
            required
          />
          <input
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            placeholder="Email"
            required
          />
          <input
            name="username"
            value={profile.username}
            onChange={handleProfileChange}
            placeholder="Username"
            required
          />
          <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleProfileChange}
            placeholder="Password"
            required
          />
          <input
            type="password"
            name="confirm_password"
            value={profile.confirm_password}
            onChange={handleProfileChange}
            placeholder="Confirm Password"
            required
          />

          {/* Country code dropdown */}
          <label>
            Country Code:
            <select
              name="country_code"
              value={profile.country_code}
              onChange={handleProfileChange}
            >
              {countryCodes.map(code => (
                <option key={code.dial_code} value={code.dial_code}>
                  {code.name} ({code.dial_code})
                </option>
              ))}
            </select>
          </label>

          <input
            name="phone_number"
            value={profile.phone_number}
            onChange={handleProfileChange}
            placeholder="Phone Number"
            required
          />
          <input
            name="alternate_phone"
            value={profile.alternate_phone}
            onChange={handleProfileChange}
            placeholder="Alternate Phone Number"
          />

          <button type="submit">Next</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleTeamSubmit}>
          <input
            name="collegename"
            value={team.collegename}
            onChange={handleTeamChange}
            placeholder="College Name"
            required
          />
          <input
            name="city"
            value={team.city}
            onChange={handleTeamChange}
            placeholder="City"
            required
          />
          <input
            name="state"
            value={team.state}
            onChange={handleTeamChange}
            placeholder="State"
            required
          />
          <button type="submit">Register</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleOtpSubmit}>
          <input
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
          />
          <button type="submit">Verify OTP</button>
        </form>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <hr />
      <p>Or Register with Google:</p>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => alert('Google registration failed')}
      />
    </div>
  );
}

export default RegistrationForm;
