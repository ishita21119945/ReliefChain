import React, { useState, useEffect } from "react";
import { identityVerificationActor } from "../icp/actors";

function IdentityVerification() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [details, setDetails] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [userId, setUserId] = useState("");

  const registerUser = async () => {
    try {
      const res = await identityVerificationActor.registerUser(name, role, details);
      console.log("Register response:", res);
      fetchProfiles();
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const verifyUser = async () => {
    try {
      const id = Number(userId);
      const res = await identityVerificationActor.verifyUser(id);
      console.log("Verify response:", res);
      fetchProfiles();
    } catch (err) {
      console.error("Verification error:", err);
    }
  };

  const fetchProfiles = async () => {
    try {
      const res = await identityVerificationActor.getProfiles();
      console.log("Profiles:", res);
      setProfiles(res);
    } catch (err) {
      console.error("Error fetching profiles:", err);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <div>
      <div>Identity Verification</div>
      <div>
        <h2>Register User</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <input
          type="text"
          placeholder="Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <button onClick={registerUser}>Register</button>
      </div>
      <div>
        <h2>Verify User</h2>
        <input
          type="number"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={verifyUser}>Verify</button>
      </div>
      <div>
        <h2>User Profiles</h2>
        <ul>
          {profiles.map((profile, index) => (
            <li key={index}>
              {profile.id}: {profile.name} - {profile.role} -{" "}
              {profile.verified ? "Verified" : "Not Verified"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default IdentityVerification;
