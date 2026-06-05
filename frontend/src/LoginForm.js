import { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Normal email/password login handler
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${BASE_URL}/login/`, { email, password });
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      window.location.href = '/profile';
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  // Google login success handler
  const handleGoogleSuccess = async credentialResponse => {
    try {
      const token = credentialResponse.credential;
      console.log("Google token:", token); // Debug
      const res = await axios.post(`${BASE_URL}/api/auth/google/`, { token });
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);

      if (res.data.needs_completion) {
        window.location.href = '/complete-profile';
      } else {
        window.location.href = '/profile';
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Google login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <hr />
      <p>Or login with Google:</p>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => setError('Google login failed')}
      />
    </div>
  );
}

export default LoginForm;
