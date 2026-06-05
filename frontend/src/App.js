// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RegistrationProvider } from './components/AuthPage/RegistrationContext.js';
import { LoadingProvider } from './components/LoadingContext.js'; // <-- import LoadingProvider

// Page Imports
import LandingPage from './pages/landingPage';
import CompleteProfile from './pages/CompleteProfile';
import RegisterPage from "./RegisterPage";
// import { AddMember } from './AddMember/AddMember';
import ProfilePage from './pages/ProfilePage.js'; 
import SignInPage from './pages/SignInPage.js';
import PersonalInfoPage from './pages/PersonalInfoPage.js';
import TeamInfoPage from './pages/TeamInfoPage.js';
import ResetPasswordPage from './pages/ResetPasswordPage.js';
import ForgotPasswordPage from './pages/ForgotPasswordPage.js';
import NotFoundPage from './pages/NotFoundPage.js';
import MyRegisteredCompetitions from "./pages/MyRegisteredCompetitions";
import CompetitionsList from './CompetitionsPage.js';

function App() {
  const token = localStorage.getItem("access");

  const routeElements = [
    React.createElement(Route, { key: "landing", path: "/", element: React.createElement(LandingPage) }),
    React.createElement(Route, { key: "profile", path: "/profile", element: React.createElement(ProfilePage) }),
    React.createElement(Route, { key: "complete-profile", path: "/complete-profile", element: React.createElement(CompleteProfile) }),
    React.createElement(Route, { key: "competitions", path: "/competitions", element: React.createElement(CompetitionsList) }),
    React.createElement(Route, { key: "register-id", path: "/register/:id", element: React.createElement(RegisterPage) }),
    //React.createElement(Route, { key: "add-member", path: "/addmember", element: React.createElement(AddMember) }),
    React.createElement(Route, { key: "signin", path: "/signin", element: React.createElement(SignInPage) }),
    React.createElement(Route, { key: "login-compat", path: "/login", element: React.createElement(SignInPage) }),
    React.createElement(Route, { key: "register-personal", path: "/register", element: React.createElement(PersonalInfoPage) }),
    React.createElement(Route, { key: "register-team", path: "/register/team-info", element: React.createElement(TeamInfoPage) }),
    React.createElement(Route, { key: "forgot-password", path: "/forgot-password", element: React.createElement(ForgotPasswordPage) }),
    React.createElement(Route, { key: "reset-password", path: "/reset-password", element: React.createElement(ResetPasswordPage) }),
    React.createElement(Route, { key: "not-found", path: "*", element: React.createElement(NotFoundPage) }),
    React.createElement(Route, { key: "my-competitions", path: "/profile", element: React.createElement(MyRegisteredCompetitions)}),

  ];

  return (
    <RegistrationProvider>
      <LoadingProvider>
        {/* This div sets the default font for the entire application */}
        <div className="font-sans">
          <BrowserRouter>
            <Routes>
              {routeElements}
            </Routes>
          </BrowserRouter>
        </div>
      </LoadingProvider>
    </RegistrationProvider>
  );
}

export default App;
