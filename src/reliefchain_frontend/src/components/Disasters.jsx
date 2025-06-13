// src/components/Disasters.js
import React, { useState, useEffect } from 'react';
import GlobalMap from './GlobalMap';
import './Disasters.css';

function Disasters() {
  const [viewMode, setViewMode] = useState('map');
  const [searchQuery, setSearchQuery] = useState('');
  // Set default filters only to "disaster" markers.
  const [selectedFilters, setSelectedFilters] = useState(["disaster"]);
  const [disasterReports, setDisasterReports] = useState([]);

  // Load disaster reports from localStorage on mount.
  useEffect(() => {
    const reports = JSON.parse(localStorage.getItem('disasterReports')) || [];
    setDisasterReports(reports);
  }, []);

  // (Optional) Filter toggling function, if needed later.
  const toggleFilter = (type) => {
    setSelectedFilters(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="disasters-page">
      {/* Disasters Page Header */}
      <header className="disasters-header">
        <h1>Disasters Map</h1>
        <div className="view-toggle">
          <button 
            className={viewMode === 'map' ? 'active' : ''} 
            onClick={() => setViewMode('map')}
          >
            Map View
          </button>
          <button 
            className={viewMode === 'list' ? 'active' : ''} 
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
        </div>
      </header>

      {viewMode === 'map' && (
        <>
          {/* Search Control */}
          <div className="map-controls">
            <input
              type="text"
              placeholder="Search disasters by location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="map-search-input"
            />
          </div>
          {/* Pass the disasterReports to GlobalMap so it renders only disaster markers */}
          <GlobalMap 
            filterTypes={selectedFilters} 
            searchQuery={searchQuery} 
            disasterReports={disasterReports} 
          />
        </>
      )}

      {viewMode === 'list' && (
        <div className="disasters-list">
          {disasterReports.length === 0 ? (
            <p>No disaster reports yet.</p>
          ) : (
            disasterReports.map((report, index) => (
              <div key={index} className="disaster-card">
                <div className="disaster-header">
                  <span className={`severity ${
                    report.severity >= 8 ? "high" : report.severity >= 5 ? "medium" : "low"
                  }`}>
                    {report.severity} Severity
                  </span>
                  <div>
                    {report.disasterType} in {report.location}
                    {report.country ? `, ${report.country}` : ""}
                  </div>
                </div>
                <div className="disaster-details">
                  <p>
                    <strong>Location:</strong> {report.location}
                    {report.country ? `, ${report.country}` : ""}
                  </p>
                  <p><strong>Population Affected:</strong> {report.population}</p>
                  <p><strong>Supplies Needed:</strong> {report.supplies}</p>
                  <p><strong>Reported:</strong> {new Date(report.timestamp).toLocaleString()}</p>
                </div>
                <button className="view-details-btn">View Details</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Disasters;
