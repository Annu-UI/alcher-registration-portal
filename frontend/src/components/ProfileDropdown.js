// src/components/ProfileDropdown.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import authorPlaceholder from '../assets/author-placeholder.png';

const ProfileDropdown = ({ user, onLogout, onTabClick }) => {

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const profileImage = user?.profilePic || authorPlaceholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
        <img
          src={profileImage}
          alt="User Profile"
          className="h-10 w-10 rounded-full object-cover border-2 border-alch-cream"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-alch-dark rounded-md shadow-lg py-1 z-50 border border-alch-cream/20">
          <button
            onClick={() => {
              setIsOpen(false);
              onTabClick(1); // 1 = My Profile
            }}
            className="block w-full text-left px-4 py-2 text-sm text-alch-cream hover:bg-alch-red"
          >
            My Profile
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onTabClick(2); // 2 = My Registrations
            }}
            className="block w-full text-left px-4 py-2 text-sm text-alch-cream hover:bg-alch-red"
          >
            My Registrations
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onTabClick(3); // 3 = Team Members
            }}
            className="block w-full text-left px-4 py-2 text-sm text-alch-cream hover:bg-alch-red"
          >
            Team Members
          </button>

          

          <div className="border-t border-alch-cream/20 my-1"></div>

          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="w-full text-left px-4 py-2 text-sm text-alch-cream hover:bg-alch-red"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;