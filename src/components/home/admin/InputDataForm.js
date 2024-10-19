import React, { useState } from "react";
import { db } from "../../../firebaseConfig"; // Import your db instance
import { ref, set } from "firebase/database"; // Import Realtime Database functions
import { getAuth } from "firebase/auth"; // Import Firebase Auth to get the current user's email
import "../../../style.css"; // Import the CSS file

const InputDataForm = () => {
  const [formData, setFormData] = useState({
    energyConsumption: "",
    fuelUsage: "",
    wasteGeneration: "",
    communityEngagement: "",
  });

  const auth = getAuth(); // Get the authentication instance
  const user = auth.currentUser; // Get the currently logged-in user

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the user is logged in
    if (!user) {
      console.error("User is not logged in!");
      return;
    }

    // Get the user's email and sanitize it (replace '.' with '_')
    const userEmail = user.email;
    const sanitizedEmail = userEmail.replace(/\./g, "_");

    console.log("Form data:", formData); // Debugging: Check form data

    try {
      // Create a reference for the user's data under their email node
      const userRef = ref(db, `postOfficeData/${sanitizedEmail}`);

      // Save the form data under the user's email node in Firebase
      await set(userRef, formData);
      console.log("Data stored successfully under email node:", sanitizedEmail);

      // Reset the form data
      setFormData({
        energyConsumption: "",
        fuelUsage: "",
        wasteGeneration: "",
        communityEngagement: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-data-form">
      <div>
        <label>Energy Consumption:</label>
        <input
          type="text"
          name="energyConsumption"
          value={formData.energyConsumption}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Fuel Usage:</label>
        <input
          type="text"
          name="fuelUsage"
          value={formData.fuelUsage}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Waste Generation:</label>
        <input
          type="text"
          name="wasteGeneration"
          value={formData.wasteGeneration}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Community Engagement:</label>
        <input
          type="text"
          name="communityEngagement"
          value={formData.communityEngagement}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default InputDataForm;
