// src/components/OrganizationRegistration.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './OrganizationRegistration.css';

const OrganizationRegistration = () => {
  const [orgName, setOrgName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [projects, setProjects] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [contact, setContact] = useState('');
  const [website, setWebsite] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orgName || !location || !description) {
      toast.error("Please fill in Organization Name, Location, and Description.");
      return;
    }
    
    // Retrieve the logged-in organization's principal from localStorage.
    const userPrincipal = localStorage.getItem('userPrincipal');
    if (!userPrincipal) {
      toast.error("Could not retrieve your ICP principal. Please login again.");
      return;
    }

    const orgData = {
      orgName,
      location,
      description,
      projects,
      specialty,
      contact,
      website,
      joined: new Date().toISOString(),
      zones: 8, // sample data
      resourcesProvided: 12450, // sample data
      principal: userPrincipal, // store the logged-in principal
    };

    // Save the organization data to localStorage.
    const existingOrgs = localStorage.getItem('registeredOrganizations');
    const orgArray = existingOrgs ? JSON.parse(existingOrgs) : [];
    orgArray.push(orgData);
    localStorage.setItem('registeredOrganizations', JSON.stringify(orgArray));

    toast.success("Organization registered successfully!");
    // After registration, navigate to the organization dashboard.
    navigate('/org-dashboard');
  };

  return (
    <div className="org-registration">
      <div>Register Your Organization</div>
      <form onSubmit={handleSubmit} className="org-form">
        <label>
          Organization Name:
          <input
            type="text"
            placeholder="Enter organization name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            required
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            placeholder="Organization situated at?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            placeholder="Brief description (e.g., international emergency response to natural disasters)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          Projects:
          <input
            type="text"
            placeholder="Projects (e.g., food, shelter, transportation, children, etc.)"
            value={projects}
            onChange={(e) => setProjects(e.target.value)}
          />
        </label>
        <label>
          Specialty:
          <input
            type="text"
            placeholder="Specialty (e.g., Medical, Logistics, etc.)"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          />
        </label>
        <label>
          Contact:
          <input
            type="text"
            placeholder="Contact information (mobile number)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </label>
        <label>
          Website:
          <input
            type="text"
            placeholder="Organization website URL"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
        <button type="submit">Register Organization</button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default OrganizationRegistration;
