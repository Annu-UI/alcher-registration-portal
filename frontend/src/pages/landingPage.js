// src/pages/landingPage.js

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; // Using the custom axios instance

// Component Imports
import HeroSection from '../components/landingPage/heroSection';
import Preloader from '../components/Preloader';
import AfterMovieSection from '../components/landingPage/AfterMovieSection';
import TestimonialsSection from '../components/landingPage/TestimonialsSection';
import {CompModules } from '../components/landingPage/compModules';
import { Pixel } from '../components/landingPage/Pixel';
import { Footer } from '../components/landingPage/Footer';
import { FAQS } from '../components/landingPage/FAQS';
import DecorativeButton from '../components/DecorativeButton';
import DecoratedButton from '../components/AuthPage/DecoratedButton';
import ProfileDropdown from '../components/ProfileDropdown';

// Asset Imports
import logo from '../assets/logo.svg';
import hamburgerIcon from '../assets/hamburger-icon.svg';
import backgroundPattern from '../assets/background-pattern.svg';
import authorPlaceholder from '../assets/author-placeholder.png';
import mbbgpattern from "../assets/mbbgpatternwh.svg"
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State for authentication and user data
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const faqRef = useRef(null);
  const compRef = useRef(null);
  const testimonialRef = useRef(null);
  const footerRef = useRef(null);
  const [openindex, setOpenindex] = useState([]);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
  let ticking = false;

  const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // scrolling down → hide header
            setShowHeader(false);
          } else {
            // scrolling up → show header
            setShowHeader(true);
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);



  const handleTabClickFromDropdown = (tabIndex) => {
    setOpenindex([tabIndex]); 
    console.log(tabIndex);
    navigate("/profile", { state: { tabIndex } });
  };

  const scrollToFAQ = () => {
    faqRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center', // center the element vertically in the viewport
      inline: 'nearest'
    });
    
  };

  const scrollToTestimonials = () => {
    testimonialRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center', // center the element vertically in the viewport
      inline: 'nearest'
    });
  };

  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const scrollToComp = () => {
    compRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => { setLoading(false); }, 2000);

    // Check for authentication token on component mount
    const token = localStorage.getItem('access');
    if (token) {
      axiosInstance.get('/profile/')
        .then(res => {
        // +++ START: THIS IS THE LOGIC TO CHANGE +++
                let pic;
                // Priority 1: User has a manually uploaded image that isn't the DB default.
                if (res.data.img && !res.data.img.includes('user-default.png')) {
                  pic = res.data.img;
                } 
                // Priority 2: User signed up with Google and has a Google picture URL.
                else if (res.data.provider === 'google' && res.data.profile_pic_url) {
                  pic = res.data.profile_pic_url;
                } 
                // Priority 3: Fallback for manual sign-ups or any other case.
                else {
                  pic = authorPlaceholder;
                }
                // +++ END: LOGIC CHANGE +++

          const dataFromApi = {
            ...res.data,
            profilePic: pic,
            // Ensure phone numbers are empty strings if null
            phone_number: res.data.phone_number || "",
            alternate_phone: res.data.alternate_phone || "",
          };
          setUser(dataFromApi);
          setIsAuthenticated(true);
        })
        .catch(err => {
          // This will only run if the token and refresh token are both invalid
          console.error("Auth check failed:", err);
        });
    }

    return () => clearTimeout(timer);
  }, []);

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <div>
      {loading && <Preloader />}

      {/* Page Content */}
      
        {/* laptop */}
        <header className={`top-0 z-30 hidden lg:block fixed shadow-lg w-full bg-alch-dark ${showHeader ? 'header-visible' : 'header-hidden'}`}>
          <nav className="relative z-10 flex justify-between items-center py-4 px-4 sm:px-8">
            <Link to="/">
              <div>
                <div className='flex flex-row justify-center items-center gap-[10px] h-[69px]'>
                    <img className="lg:w-[37.99px] lg:h-[43.71px] w-[24px] h-[27.61px]" src={logo} alt="logo"/>
                    <div className='text-alch-cream h-[32px] lg:h-[65.83px] flex flex-col justify-center'>
                        <p className='font-display font-bold lg:text-[37.99px] text-[18px] h-[42px] leading-none'>ALCHERINGA</p>
                        <p className='font-sans h-[27px]  font-normal lg:text-[18.99px] text-[10px] leading-none self-end'>IIT GUWAHATI</p>
                    </div>
                </div>    
              </div> 
            </Link>
            <div className="hidden lg:flex items-center">
              <DecorativeButton to="#" variant="nav">
                <div className="flex space-x-8 px-4 text-sm">
                  {/* <Link to="/about" className="text-alch-cream hover:text-white whitespace-nowrap">About us</Link> */}
                  <Link to="/competitions" className="text-alch-cream hover:text-white whitespace-nowrap">Modules & Competitions</Link>
                  <p className='text-alch-cream hover:text-white whitespace-nowrap' onClick={ scrollToFAQ}>FAQ</p>
                </div>
              </DecorativeButton>
            </div>
            <div className="hidden lg:flex items-center space-x-6">
              <Link className="text-alch-cream hover:text-white" onClick={scrollToFooter}>Contact us</Link>
              {isAuthenticated ? (
                <ProfileDropdown user={user} onLogout={handleLogout} onTabClick={handleTabClickFromDropdown}/>
              ) : (
                <DecoratedButton to="/login" variant="orange-sm">Login</DecoratedButton>
              )}
            </div>
            {/* mobile */}
            <div className="lg:hidden">
              <button onClick={toggleMenu}><img src={hamburgerIcon} alt="Menu" className="h-12 w-12" /></button>
            </div>
          </nav>
        </header>

        {/* mobile */}
        <header className={`top-0 z-30 lg:hidden fixed w-full bg-alch-dark ${showHeader ? 'header-visible' : 'header-hidden'}`}>
          <nav className="relative z-10 flex justify-between items-center py-4 px-4 sm:px-8">
            <Link to="/">
              <div>
                <div className='flex flex-row justify-center items-center gap-[10px] h-[69px]'>
                    <img className="lg:w-[37.99px] lg:h-[43.71px] w-[24px] h-[27.61px]" src={logo} alt="logo"/>
                    <div className='text-alch-cream h-[32px] lg:h-[65.83px] flex flex-col justify-center'>
                        <p className='font-display font-bold lg:text-[37.99px] text-[18px] h-[42px] leading-none'>ALCHERINGA</p>
                        <p className='font-sans h-[27px]  font-normal lg:text-[18.99px] text-[10px] leading-none self-end'>IIT GUWAHATI</p>
                    </div>
                </div>    
              </div> 
            </Link>
            <div className="hidden lg:flex items-center">
              <DecorativeButton to="#" variant="nav">
                <div className="flex space-x-8 px-4 text-sm">
                  {/* <Link to="/about" className="text-alch-cream hover:text-white whitespace-nowrap">About us</Link> */}
                  <Link to="/competitions" className="text-alch-cream hover:text-white whitespace-nowrap">  Modules & Competitions</Link>
                </div>
              </DecorativeButton>
            </div>
            <div className="hidden lg:flex items-center space-x-6">
              <Link className="text-alch-cream hover:text-white" onClick={scrollToFooter}>Contact us</Link>
              {isAuthenticated ? (
                <ProfileDropdown user={user} onLogout={handleLogout} />
              ) : (
                <DecorativeButton to="/login" variant="orange-sm">Login</DecorativeButton>
              )}
            </div>
            {/* mobile */}
            <div className="lg:hidden">
              <button onClick={toggleMenu}><img src={hamburgerIcon} alt="Menu" className="h-12 w-12" /></button>
            </div>
          </nav>
        </header>

        {/* Mobile Menu Overlay */}
        <div className={`fixed top-0 left-0 h-full w-[100%] bg-black bg-opacity-95 z-40 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-end p-8">
            <button onClick={toggleMenu}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-3/4 space-y-8 text-2xl">
            {/* <Link to="/about"  onClick={toggleMenu} className="text-alch-cream hover:text-white">About us</Link> */}
            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  state={{ tabIndex: 1 }}
                  onClick={toggleMenu}
                  className="text-alch-cream hover:text-white"
                >
                  My Profile
                </Link>

                <Link
                  to="/profile"
                  state={{ tabIndex: 2 }}
                  onClick={toggleMenu}
                  className="text-alch-cream hover:text-white"
                >
                  My Registrations
                </Link>

                <Link
                  to="/profile"
                  state={{ tabIndex: 3 }}
                  onClick={toggleMenu}
                  className="text-alch-cream hover:text-white"
                >
                  Team Members
                </Link>
              </>
            )}
            <Link onClick={()=>{toggleMenu();scrollToComp()}} className="text-alch-cream hover:text-white">Modules</Link>
            <Link to="/competitions" onClick={toggleMenu} className="text-alch-cream hover:text-white">Competitions</Link>
            <Link onClick={()=>{toggleMenu();scrollToFooter()}} className="text-alch-cream hover:text-white" >Contact us</Link>

            {/* Conditional links for mobile menu */}
            {isAuthenticated ? (
              <>
                {/* <Link to="/profile" state={{ tabIndex: 1 }} onClick={toggleMenu} className="text-alch-cream hover:text-white">My Profile</Link>
                <Link to="/profile" state={{ tabIndex: 3 }} onClick={toggleMenu} className="text-alch-cream hover:text-white">Team Members</Link> */}
                <button
                  onClick={() => {
                    toggleMenu();
                    handleLogout();
                  }}
                  className="text-alch-red hover:text-white font-bold text-2xl bg-transparent border-none"
                >
                  Logout
                </button>
              </>
            ) : (
              <DecorativeButton to="/profile" variant="orange-sm" onClick={toggleMenu}>Login</DecorativeButton>
            )}
          </div>
        </div>
      
      <div className='bg-alch-dark pixelbg'>
        <HeroSection isAuthenticated={isAuthenticated} />
      </div>

      <div className='landingbg'>
        <CompModules ref={compRef}/>
      </div>
      <Pixel />
      
        <div
          className='bg-alch-cream landingbg'  
        >
            <AfterMovieSection />
            {/* <TestimonialsSection ref={testimonialRef}/> */}
            <FAQS ref={faqRef}/>
            <Footer scrollToFAQ={scrollToFAQ} scrollToTestimonials={scrollToTestimonials} scrollToComp={scrollToComp} ref={footerRef}/>
        </div> 
        {/* <AddMembers/> */}
    </div>
  );
};

export default LandingPage;