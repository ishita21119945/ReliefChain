// src/components/Donation.js
import React, { useState, useEffect } from "react";
import { donationActor } from "../icp/actors";

const Donation = () => {
  const [donor, setDonor] = useState("");
  const [amount, setAmount] = useState("");
  const [donations, setDonations] = useState([]);

  const donate = async () => {
    try {
      // Convert amount to number (Nat is represented as number)
      const amt = Number(amount);
      const res = await donationActor.donate(donor, amt);
      console.log("Donation response:", res);
      fetchDonations();
    } catch (err) {
      console.error("Donation error:", err);
    }
  };

  const fetchDonations = async () => {
    try {
      const res = await donationActor.getDonations();
      console.log("Donations:", res);
      setDonations(res);
    } catch (err) {
      console.error("Error fetching donations:", err);
    }
  };

  // Fetch donations when component mounts.
  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div>
      <div>Donate</div>
      <input
        type="text"
        placeholder="Your name"
        value={donor}
        onChange={(e) => setDonor(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={donate}>Donate</button>
      <div>Donation History</div>
      <ul>
        {donations.map((donation, index) => (
          <li key={index}>
            {donation.donor} donated {donation.amount} at {donation.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Donation;
