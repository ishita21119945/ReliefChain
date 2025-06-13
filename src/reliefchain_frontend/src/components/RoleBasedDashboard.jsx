// src/components/RoleBasedDashboard.js
import React from 'react';

const RoleBasedDashboard = () => {
  const role = localStorage.getItem('userRole');

  if (role === 'victim') {
    return (
      <div>
        <div>Victim Dashboard</div>
        <p>Welcome, Victim! Here you can view available resources and report your needs.</p>
      </div>
    );
  } else if (role === 'organization') {
    return (
      <div>
        <div>Organization Dashboard</div>
        <p>Welcome, Organization! Here you can coordinate disaster relief efforts.</p>
      </div>
    );
  } else if (role === 'volunteer') {
    return (
      <div>
        <div>Volunteer Dashboard</div>
        <p>Welcome, Volunteer! Here you can view assignments and collaborate on relief tasks.</p>
      </div>
    );
  } else {
    return (
      <div>
        <div>Dashboard</div>
        <p>No role selected. Please log in again.</p>
      </div>
    );
  }
};

export default RoleBasedDashboard;
