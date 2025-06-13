// src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaExclamationTriangle, 
  FaBoxes, 
  FaUsers, 
  FaDonate, 
  FaTachometerAlt, 
  FaSignInAlt 
} from 'react-icons/fa';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  // Determine dashboard link based on role
  const getDashboardLink = () => {
    if (userRole === 'organization') return '/org-dashboard';
    if (userRole === 'victim') return '/victim-dashboard';
    if (userRole === 'volunteer') return '/volunteer-dashboard';
    return '/dashboard';
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userPrincipal');
    window.location.reload();
  };

  return (
    <header className="global-header">
      <nav className="global-nav">
        <Link to="/" className="nav-item">
          <FaHome /> Home
        </Link>
        <Link to="/disasters" className="nav-item">
          <FaExclamationTriangle /> Disasters
        </Link>
        <Link to="/organizations" className="nav-item">
          <FaUsers /> Organizations
        </Link>
        <Link to="/donate" className="nav-item">
          <FaDonate /> Donate
        </Link>
        <div>
        {userRole && (
          <Link to={getDashboardLink()} className="nav-item">
            <FaTachometerAlt /> Dashboard
          </Link>
        )}
        </div>
        <div>
          <div>
        {userRole ? (
          <button onClick={handleLogout} className="nav-item logout-btn">
            <FaSignInAlt /> Logout
          </button>
        ) : (
          <Link to="/login" className="nav-item">
            <FaSignInAlt /> Login
          </Link>
        )}
        </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
