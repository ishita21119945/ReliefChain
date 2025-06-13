// src/components/RoleLogin.js
import React, { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { useNavigate } from 'react-router-dom';
import { identityVerificationActor } from '../icp/actors';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './RoleLogin.css';

const RoleLogin = () => {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const navigate = useNavigate();

  // On mount, check if a role is already stored.
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const storedPrincipal = localStorage.getItem('userPrincipal');
    if (storedRole && storedPrincipal) {
      if (storedRole === 'organization') {
        const existingOrgs = localStorage.getItem('registeredOrganizations');
        if (existingOrgs) {
          const orgArray = JSON.parse(existingOrgs);
          const alreadyRegistered = orgArray.find(o => o.principal === storedPrincipal);
          if (alreadyRegistered) {
            navigate('/org-dashboard');
            return;
          } else {
            navigate('/org-registration');
            return;
          }
        } else {
          navigate('/org-registration');
          return;
        }
      } else if (storedRole === 'victim') {
        navigate('/victim-dashboard'); // Make sure this route exists
        return;
      } else if (storedRole === 'volunteer') {
        navigate('/volunteer-dashboard'); // Make sure this route exists
        return;
      } else {
        // Default fallback
        navigate('/dashboard');
        return;
      }
    }

    // If no role is stored, then initiate ICP login.
    const initAuth = async () => {
      const client = await AuthClient.create({ host: window.location.origin });
      setAuthClient(client);

      // If already authenticated, logout to start fresh.
      if (client.isAuthenticated()) {
        await client.logout();
      }

      client.login({
        identityProvider: 'https://identity.ic0.app/#authorize',
        redirectUri: window.location.origin,
        onSuccess: () => {
          setIsAuthenticated(true);
          toast.success('Successfully logged in with ICP!');
          // No role stored, show the role selection modal.
          setShowRoleModal(true);
        },
        onError: (error) => {
          console.error('ICP Login failed:', error);
          toast.error('ICP Login failed. Please try again.');
        },
      });
    };

    initAuth();
  }, [navigate]);

  const handleRoleSelection = async (role) => {
    try {
      const identity = authClient.getIdentity();
      const principalText = identity.getPrincipal().toText().trim();
      // Persist the role and principal
      localStorage.setItem('userRole', role);
      localStorage.setItem('userPrincipal', principalText);
      console.log("Selected role:", role, "Principal:", principalText);

      if (role === 'organization') {
        const existingOrgs = localStorage.getItem('registeredOrganizations');
        if (existingOrgs) {
          const orgArray = JSON.parse(existingOrgs);
          const alreadyRegistered = orgArray.find(o => o.principal === principalText);
          if (alreadyRegistered) {
            toast.info("Organization already registered.");
            setShowRoleModal(false);
            navigate('/org-dashboard');
            return;
          }
        }
        setShowRoleModal(false);
        navigate('/org-registration');
      } else if (role === 'victim') {
        // For victim role, navigate to the victim dashboard.
        setShowRoleModal(false);
        navigate('/victim-dashboard'); // Ensure this route is set up
      } else if (role === 'volunteer') {
        // For volunteer role, navigate to the volunteer dashboard.
        setShowRoleModal(false);
        navigate('/volunteer-dashboard'); // Ensure this route is set up
      } else {
        // Default fallback.
        setShowRoleModal(false);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error during role selection:", error);
      toast.error("User registration failed!");
    }
  };

  return (
    <div className="role-login-container">
      {showRoleModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div>Select Your Role</div>
            <p>Please choose one of the following roles:</p>
            <div className="role-options">
              <button className="role-button" onClick={() => handleRoleSelection('victim')}>
                As a Victim
              </button>
              <button className="role-button" onClick={() => handleRoleSelection('organization')}>
                As an Organization
              </button>
              <button className="role-button" onClick={() => handleRoleSelection('volunteer')}>
                As a Volunteer
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default RoleLogin;
