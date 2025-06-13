// src/App.js (Dashboard.js portion)
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaExclamationTriangle, 
  FaBoxes, 
  FaUsers, 
  FaDonate, 
  FaSignInAlt,
  FaTachometerAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaCoins,
  FaBell,
  FaSearch,
  FaExclamationCircle,
  FaFileAlt,
  FaGlobe,
  FaLock,
} from 'react-icons/fa';
import GlobalMap from './GlobalMap';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Check if the user is logged in based on localStorage (you can expand this logic)
  const userRole = localStorage.getItem('userRole');

  // Logout handler: clear the stored role and reload or redirect.
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    // Optionally clear other auth tokens/data
    navigate('/');
    window.location.reload();
  };

  const features = [
    {
      title: "Real-time Mapping",
      description: "Visualize affected areas, resource distribution points, and volunteer locations on an interactive map.",
      icon: <FaMapMarkerAlt />,
    },
    {
      title: "Verified Identities",
      description: "Trust-based system ensuring legitimate organizations and volunteers through blockchain verification.",
      icon: <FaCheckCircle />,
    },
    {
      title: "Tokenized Donations",
      description: "Transparent fund allocation with smart contracts ensuring donations reach intended recipients.",
      icon: <FaCoins />,
    },
    {
      title: "Real-time Updates",
      description: "Instant notifications about changing situations, resource availability, and critical needs.",
      icon: <FaBell />,
    },
    {
      title: "Need-Resource Matching",
      description: "Automated system that matches available resources with prioritized needs in disaster zones.",
      icon: <FaSearch />,
    },
    {
      title: "Early Warning System",
      description: "Integration with weather and geological data sources to provide early disaster warnings.",
      icon: <FaExclamationCircle />,
    },
    {
      title: "Transparent Records",
      description: "Immutable blockchain records of all transactions, resource distributions, and aid deliveries.",
      icon: <FaFileAlt />,
    },
    {
      title: "Global Coordination",
      description: "Connect international relief efforts, enabling efficient resource sharing across borders.",
      icon: <FaGlobe />,
    },
    {
      title: "Secure Communication",
      description: "Encrypted channels for sensitive coordination between verified relief organizations.",
      icon: <FaLock />,
    },
  ];

  return (
    <div className="dashboard">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div>Powered by Internet Computer Protocol</div>
          <h2>Decentralized Disaster Relief Coordination</h2>
          <p>
            A transparent platform where organizations, volunteers, and victims can coordinate disaster relief efforts efficiently using blockchain technology.
          </p>
          <div className="hero-buttons">
            <Link to="/disasters" className="btn btn-disasters">
              View Active Disasters
            </Link>
            <Link to="/donate" className="btn btn-donate">
              Donate Now
            </Link>
          </div>
        </div>
        {/* Curved bottom effect */}
        <div className="curve"></div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Our Features</h2>
        <div className="features-grid">
          {features.map((feat, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feat.icon}</div>
              <h3>{feat.title}</h3>
              <p>{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Global Map Section */}
      <section className="global-map-section">
        <GlobalMap />
      </section>
    </div>
  );
};

export default Dashboard;
