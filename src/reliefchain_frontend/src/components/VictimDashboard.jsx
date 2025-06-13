import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './VictimDashboard.css';

function VictimDashboard() {
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState(''); // New state for country
  const [population, setPopulation] = useState('');
  const [supplies, setSupplies] = useState('');
  const [disasterType, setDisasterType] = useState('');
  const [severity, setSeverity] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!location || !country || !population || !supplies || !disasterType) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const disasterReport = {
      location,
      country, // include country in report
      population: Number(population),
      supplies,
      disasterType,
      severity: Number(severity),
      timestamp: Date.now(),
    };

    // Retrieve existing reports from localStorage
    const existingReports = JSON.parse(localStorage.getItem('disasterReports')) || [];
    existingReports.push(disasterReport);
    localStorage.setItem('disasterReports', JSON.stringify(existingReports));

    toast.success('Disaster report submitted successfully!');
    // Clear form fields
    setLocation('');
    setCountry('');
    setPopulation('');
    setSupplies('');
    setDisasterType('');
    setSeverity(5);
  };

  return (
    <div className="victim-dashboard">
      <div>Victim Dashboard</div>
      <form onSubmit={handleSubmit} className="disaster-report-form">
        <label>
          Location Name:
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            placeholder="Enter location name" 
            required 
          />
        </label>
        <label>
          Country:
          <input 
            type="text" 
            value={country} 
            onChange={(e) => setCountry(e.target.value)} 
            placeholder="Enter country" 
            required 
          />
        </label>
        <label>
          Approx. Population Affected:
          <input 
            type="number" 
            value={population} 
            onChange={(e) => setPopulation(e.target.value)} 
            placeholder="Enter approximate population" 
            required 
          />
        </label>
        <label>
          Supplies Needed:
          <textarea 
            value={supplies} 
            onChange={(e) => setSupplies(e.target.value)} 
            placeholder="List supplies needed" 
            required 
          />
        </label>
        <label>
          Disaster Type:
          <select 
            value={disasterType} 
            onChange={(e) => setDisasterType(e.target.value)} 
            required
          >
            <option value="">Select disaster type</option>
            <option value="Flood">Flood</option>
            <option value="Earthquake">Earthquake</option>
            <option value="Wildfire">Wildfire</option>
            <option value="Hurricane">Hurricane</option>
            <option value="Tornado">Tornado</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label>
          Severity (1-10):
          <input 
            type="number" 
            value={severity} 
            onChange={(e) => setSeverity(e.target.value)} 
            min="1" 
            max="10" 
            required 
          />
        </label>
        <button type="submit">Submit Disaster Report</button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default VictimDashboard;
