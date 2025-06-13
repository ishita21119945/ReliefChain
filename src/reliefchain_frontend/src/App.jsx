// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Donation from './components/Donate';
import ResourceAllocation from './components/ResourceAllocation';
import IdentityVerification from './components/IdentityVerification';
import RoleLogin from './components/RoleLogin';
import OrgDashboard from './components/OrgDashboard'; // Organization dashboard
import VictimDashboard from './components/VictimDashboard'; // Victim dashboard
import VolunteerDashboard from './components/VolunteerDashboard'; // Volunteer dashboard
import Disasters from './components/Disasters';
import Organizations from './components/Organizations';
import OrganizationRegistration from './components/OrganizationRegistration';
import Header from './components/Header';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/donate" element={<Donation />} />
        <Route path="/disasters" element={<Disasters />} />
        <Route path="/identity" element={<IdentityVerification />} />
        <Route path="/login" element={<RoleLogin />} />
        <Route path="/dashboard" element={<OrgDashboard />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/org-dashboard" element={<OrgDashboard />} />
        <Route path="/org-registration" element={<OrganizationRegistration />} />
        <Route path="/victim-dashboard" element={<VictimDashboard />} />
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
      </Routes>
    </>
  );
}

export default App;
