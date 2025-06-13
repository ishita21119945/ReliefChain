// src/components/OrganizationCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrganizationCard.css';

const OrganizationCard = ({ organization }) => {
  const navigate = useNavigate();

  const handleContact = () => {
    if (organization.contact) {
      // Open the phone dialer with the organization's mobile number.
      window.location.href = `tel:${organization.contact}`;
    } else {
      alert("No contact number available.");
    }
  };

  const handleWebsite = () => {
    if (organization.website) {
      // Open the organization's website in a new tab.
      window.open(organization.website, '_blank');
    } else {
      alert("No website available.");
    }
  };

  const handleDonate = () => {
    // Optionally, store the selected organization so the Donate page can use it.
    localStorage.setItem("selectedOrganization", JSON.stringify(organization));
    navigate('/donate');
  };

  return (
    <div className="org-card">
      <div>{organization.orgName}</div>
      <p className="location">{organization.location}</p>
      <p className="description">{organization.description}</p>
      <div className="details">
        <div className="detail">
          <strong>Specialty:</strong> {organization.specialty || "N/A"}
        </div>
        <div className="detail">
          <strong>Projects:</strong> {organization.projects || "N/A"}
        </div>
        <div className="detail">
          <strong>Zones Active:</strong> {organization.zones || 0}
        </div>
        <div className="detail">
          <strong>Resources Provided:</strong> {organization.resourcesProvided || 0}
        </div>
        <div className="detail">
          <strong>Joined ReliefChain:</strong> {new Date(organization.joined).toLocaleDateString()}
        </div>
      </div>
      <div className="org-actions">
        <button onClick={handleContact}>Contact</button>
        <button onClick={handleWebsite}>Website</button>
        <button onClick={handleDonate}>Donate</button>
      </div>
    </div>
  );
};

export default OrganizationCard;
