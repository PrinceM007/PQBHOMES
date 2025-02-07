import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './NavBar.css';

const NavBar = () => {
  const { user, isAuthenticated, logout } = useUser();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="header">
      <div className="logo-container">
        <h1>PQB HOMES</h1>
        <div className="datetime">
          <span>{currentTime.toLocaleDateString()}</span>
          <span>{currentTime.toLocaleTimeString()}</span>
        </div>
      </div>
      
      <nav className="nav-menu">
        {isAuthenticated ? (
          <>
            <Link to="/home">Home</Link>
            <Link to="/rooms">Rooms</Link>
            <Link to="/my-bookings">My Bookings</Link>
            
            <div className="nav-right">
              <div className="notifications">
                <svg className="bell-icon" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
                <span className="notification-count">2</span>
              </div>

              <div className="user-section" onClick={() => setShowDropdown(!showDropdown)}>
                <div className="user-avatar">
                  {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </div>
                <div className="user-info">
                  <span className="welcome-text">
                    Welcome, <strong>{user?.fullName || user?.username || "User"}</strong>
                  </span>
                  <span className="user-email">{user?.email}</span>
                </div>

                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/profile">Profile</Link>
                    <Link to="/settings">Settings</Link>
                    <button onClick={logout}>Logout</button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <Link to="/login" className="login-link">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default NavBar;