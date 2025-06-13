// src/components/Organizations.js
import React, { useEffect, useState } from 'react';
import OrganizationCard from './OrganizationCard';
import './Organizations.css';

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    const storedOrganizations = JSON.parse(localStorage.getItem('registeredOrganizations')) || [];
    setOrganizations(storedOrganizations);
  }, []);

  return (
    <div className="organizations">
      <div>Registered Organizations</div>
    <div>
    {organizations.length === 0 ? (
        <p>No organizations registered yet.</p>
      ) : (
        <div className="organization-list">
          {organizations.map((org, index) => (
            <OrganizationCard key={index} organization={org} />
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default Organizations;
