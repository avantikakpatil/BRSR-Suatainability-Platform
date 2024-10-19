import React, { useState } from "react";
import { db, storage } from "../../../firebaseConfig";
import { ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { ref as storageRef, uploadBytes } from "firebase/storage"; // Import for file upload
import { FaBolt, FaGasPump, FaRecycle, FaPeopleCarry } from "react-icons/fa"; // Import FontAwesome icons
import "../../../style.css";

const InputDataForm = () => {
  const [formData, setFormData] = useState({
    energyConsumption: "",
    fuelUsage: "",
    wasteGeneration: "",
    communityEngagement: "",
  });

  const [files, setFiles] = useState({
    energyBill: null,
    fuelBill: null,
    wasteBill: null,
    communityEngagementBill: null,
  });

  const auth = getAuth();
  const user = auth.currentUser;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prevFiles) => ({
      ...prevFiles,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error("User is not logged in!");
      return;
    }

    // Get the user's email and sanitize it
    const userEmail = user.email;
    const sanitizedEmail = userEmail.replace(/\./g, "_"); // Correct definition of sanitizedEmail

    try {
      // Save form data to Firebase Database
      const userRef = ref(db, `postOfficeData/${sanitizedEmail}`);
      await set(userRef, formData);

      // Upload files to Firebase Storage
      for (const key in files) {
        if (files[key]) {
          const fileRef = storageRef(storage, `bills/${sanitizedEmail}/${key}`);
          await uploadBytes(fileRef, files[key]);
        }
      }

      setFormData({
        energyConsumption: "",
        fuelUsage: "",
        wasteGeneration: "",
        communityEngagement: "",
      });
      setFiles({
        energyBill: null,
        fuelBill: null,
        wasteBill: null,
        communityEngagementBill: null,
      });
      console.log("Data stored successfully");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="input-data-form">
        <div className="form-group">
          <label>
            <FaBolt /> Energy Consumption:
          </label>
          <input
            type="text"
            name="energyConsumption"
            value={formData.energyConsumption}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="energyBill"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <FaGasPump /> Fuel Usage:
          </label>
          <input
            type="text"
            name="fuelUsage"
            value={formData.fuelUsage}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="fuelBill"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <FaRecycle /> Waste Generation:
          </label>
          <input
            type="text"
            name="wasteGeneration"
            value={formData.wasteGeneration}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="wasteBill"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <FaPeopleCarry /> Community Engagement:
          </label>
          <input
            type="text"
            name="communityEngagement"
            value={formData.communityEngagement}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="communityEngagementBill"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default InputDataForm;
