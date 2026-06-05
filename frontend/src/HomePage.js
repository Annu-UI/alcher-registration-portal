import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pixel } from './components/landingPage/Pixel';
import { Footer } from './components/landingPage/Footer';
import { FAQS } from './components/landingPage/FAQS';

function HomePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access"); // check login
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/login';
  };
  return (
    <>
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h1>Welcome to the Homepage!</h1>
        <p>This is a demo homepage.</p>
        {/* Login Button */}
        {!token && (
          <>
            <button
              style={{
                padding: "0.7rem 2rem",
                fontSize: "1.05rem",
                background: "#3265e4",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "1.5rem"
              }}
              onClick={() => navigate('/login')}>
              Login
            </button>
            <button
              style={{
                padding: "0.7rem 2rem",
                fontSize: "1.05rem",
                background: "#3265e4",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "1.5rem"
              }}
              onClick={() => navigate('/register')}>
              register
            </button>
          </>
        )}

        {token && (
          <>
            <button onClick={handleLogout}  className="mt-4 px-6 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 transition">
              Logout
            </button>
          </>
        )}

      </div>

        <Pixel />
        <div
          className='bg-[rgba(238,236,217,1)]'
          style={{
              backgroundImage: "url('/whitevector.png')",
              
              backgroundRepeat: "repeat",
          }}   
        >
          <FAQS />
          <Footer />
        </div>
    </>
  );
}

export default HomePage;
