import { useEffect, useState } from 'react';
import axios from 'axios';
import { AddMember } from './components/AddMember';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

function Profile() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      setMessage('You are not logged in.');
      return;
    }

    axios
      .get(`${BASE_URL}/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {setProfile(res.data); console.log(res.data)})
      .catch(() => setMessage('Failed to load profile.'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/login';
  };

  if (message) return <p>{message}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Profile</h2>
      <p><strong>Full Name:</strong> {profile.fullname}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Phone:</strong> {profile.phone_number}</p>
      <p><strong>Alternate Phone:</strong> {profile.alternate_phone || '—'}</p>
      <p><strong>College:</strong> {profile.collegename}</p>
      <p><strong>City:</strong> {profile.city}</p>
      <p><strong>State:</strong> {profile.state}</p>

      <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
        Logout
      </button>
      <button onClick={()=>{window.location.href = '/';}} className='h-[10px] w-[10px] bg-red'>
        home
      </button>
    </div>
  );
}

export default Profile;
