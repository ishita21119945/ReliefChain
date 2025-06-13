import React, { useState, useEffect } from "react";
import { resourceAllocationActor } from "../icp/actors";

const ResourceAllocation = () => {
  const [needDescription, setNeedDescription] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState(""); // Renamed from "long" to "lng"
  const [urgency, setUrgency] = useState("");
  const [needs, setNeeds] = useState([]);

  const addNeed = async () => {
    try {
      // Create a location record as a JavaScript object that matches the candid record
      const location = { lat: lat, long: lng }; // If your canister expects key "long", leave it; otherwise, update accordingly.
      // Convert urgency to number
      const urg = Number(urgency);
      const res = await resourceAllocationActor.addNeed(needDescription, location, urg);
      console.log("Add need response:", res);
      fetchNeeds();
    } catch (err) {
      console.error("Error adding need:", err);
    }
  };

  const allocateResources = async () => {
    try {
      const res = await resourceAllocationActor.allocateResources();
      console.log("Allocation result:", res);
      fetchNeeds();
    } catch (err) {
      console.error("Allocation error:", err);
    }
  };

  const fetchNeeds = async () => {
    try {
      const res = await resourceAllocationActor.getNeeds();
      console.log("Needs:", res);
      setNeeds(res);
    } catch (err) {
      console.error("Error fetching needs:", err);
    }
  };

  useEffect(() => {
    fetchNeeds();
  }, []);

  return (
    <div>
      <div>Resource Allocation</div>
      <div>
        <div>Add Need</div>
        <input
          type="text"
          placeholder="Need description"
          value={needDescription}
          onChange={(e) => setNeedDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
        <input
          type="text"
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
        />
        <input
          type="number"
          placeholder="Urgency"
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
        />
        <button onClick={addNeed}>Add Need</button>
      </div>
      <div>
        <div>Allocate Resources</div>
        <button onClick={allocateResources}>Allocate</button>
      </div>
      <div>Needs List</div>
      <ul>
        {needs.map((need, index) => (
          <li key={index}>
            {need.id}: {need.description} (Urgency: {need.urgency}) -{" "}
            {need.fulfilled ? "Fulfilled" : "Pending"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourceAllocation;
