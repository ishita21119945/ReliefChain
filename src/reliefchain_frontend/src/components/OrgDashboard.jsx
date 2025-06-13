// src/components/OrgDashboard.js
import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Bar } from 'react-chartjs-2';
import 'react-circular-progressbar/dist/styles.css';
import './OrgDashboard.css';

// Import and register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Simulated function to fetch donation stats for the organization.
// Replace this with your actual actor/API call.
const fetchDonationStatsForOrg = async (orgPrincipal) => {
  // Retrieve donation records from localStorage.
  // Expected donation record format:
  // [{ orgPrincipal, donor, amount, location, timestamp }, ...]
  const donationRecords = JSON.parse(localStorage.getItem('donationRecords')) || [];
  // Filter records for the current organization.
  const orgDonations = donationRecords.filter(record => record.orgPrincipal === orgPrincipal);
  const totalTokens = orgDonations.reduce((sum, record) => sum + Number(record.amount), 0);
  const uniqueDonors = new Set(orgDonations.map(record => record.donor)).size;
  return { totalTokens, donorCount: uniqueDonors, orgDonations };
};

const OrgDashboard = () => {
  const [orgData, setOrgData] = useState(null);
  const [donationStats, setDonationStats] = useState({
    totalTokens: 0,
    donorCount: 0,
    progress: 0,
    orgDonations: [],
  });
  const [donationGoal, setDonationGoal] = useState(10000);
  const [goalInput, setGoalInput] = useState("");

  useEffect(() => {
    // Retrieve the logged-in organization's principal.
    const userPrincipal = localStorage.getItem('userPrincipal');
    const organizations = JSON.parse(localStorage.getItem('registeredOrganizations')) || [];
    let loggedInOrg = organizations.find(org => org.principal === userPrincipal);
    setOrgData(loggedInOrg);

    // Load donation goal if previously set.
    const storedGoal = localStorage.getItem('donationGoal');
    if (storedGoal) {
      setDonationGoal(Number(storedGoal));
    }

    if (loggedInOrg) {
      fetchDonationStatsForOrg(loggedInOrg.principal)
        .then(stats => {
          const { totalTokens, donorCount, orgDonations } = stats;
          const progressPercentage = donationGoal > 0 ? (totalTokens / donationGoal) * 100 : 0;
          setDonationStats({
            totalTokens,
            donorCount,
            progress: progressPercentage,
            orgDonations,
          });
        })
        .catch(err => console.error("Error fetching donation stats:", err));
    }
  }, [donationGoal]);

  // Handle donation goal update.
  const handleGoalUpdate = (e) => {
    e.preventDefault();
    const newGoal = Number(goalInput);
    if (isNaN(newGoal) || newGoal <= 0) {
      alert("Please enter a valid donation goal.");
      return;
    }
    setDonationGoal(newGoal);
    localStorage.setItem('donationGoal', newGoal);
    setGoalInput("");
  };

  // Aggregate donation by location for the bar chart.
  const aggregateDonationsByLocation = () => {
    const locationData = {};
    donationStats.orgDonations.forEach(record => {
      const loc = record.location || "Unknown";
      locationData[loc] = (locationData[loc] || 0) + Number(record.amount);
    });
    return locationData;
  };

  const donationByLocation = aggregateDonationsByLocation();
  const barData = {
    labels: Object.keys(donationByLocation),
    datasets: [
      {
        label: 'Tokens Received',
        data: Object.values(donationByLocation),
        backgroundColor: 'rgba(62, 152, 199, 0.7)',
      },
    ],
  };

  const barOptions = {
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="org-dashboard">
      <div className="dashboard-header">
        <h1>Organization Dashboard</h1>
      </div>
      <div>
        {orgData ? (
          <div className="dashboard-content">
            <div className="org-info-card">
              <h2>Welcome, {orgData.orgName}</h2>
              <p>{orgData.location}</p>
            </div>
            <div className="stats-cards">
              <div className="progress-card card">
                <h3>Donation Progress</h3>
                <div className="progress-circle">
                  <CircularProgressbar 
                    value={donationStats.progress} 
                    text={`${Math.round(donationStats.progress)}%`}
                    styles={buildStyles({
                      textSize: '16px',
                      pathColor: '#3e98c7',
                      textColor: '#333',
                      trailColor: '#d6d6d6',
                    })}
                  />
                </div>
                <p><strong>{donationStats.totalTokens}</strong> Tokens Collected</p>
                <p>Goal: <strong>{donationGoal}</strong> Tokens</p>
                <form onSubmit={handleGoalUpdate} className="goal-form">
                  <input
                    type="number"
                    placeholder="Set new goal"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                  />
                  <button type="submit">Update Goal</button>
                </form>
              </div>
              <div className="donor-card card">
                <h3>Donors</h3>
                <p><strong>{donationStats.donorCount}</strong> People Donated</p>
              </div>
            </div>
            <div className="chart-card card">
              <h3>Donations by Location</h3>
              {Object.keys(donationByLocation).length > 0 ? (
                <div className="bar-chart">
                  <Bar data={barData} options={barOptions} />
                </div>
              ) : (
                <p>No donation data by location yet.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="no-data">No organization data found. Please register your organization.</p>
        )}
      </div>
    </div>
  );
};

export default OrgDashboard;
