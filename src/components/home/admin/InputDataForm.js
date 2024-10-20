import React, { useState } from "react";
import { db, storage } from "../../../firebaseConfig";
import { ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { ref as storageRef, uploadBytes } from "firebase/storage";
import "../../../style.css";

const InputDataForm = ({ selectedOption }) => {
  const [formData, setFormData] = useState({
    parameter: "", // General form parameter (Energy, Waste, Water)
    bill: null,
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error("User is not logged in!");
      return;
    }

    const userEmail = user.email;
    const sanitizedEmail = userEmail.replace(/\./g, "_");

    try {
      const userRef = ref(db, `postOfficeData/${sanitizedEmail}`);
      await set(userRef, {
        ...formData,
        parameter: selectedOption, // Store the selected option (Energy, Waste, Water)
      });

      const fileRef = storageRef(storage, `bills/${sanitizedEmail}/${selectedOption}`);
      await uploadBytes(fileRef, formData.bill);

      setFormData({ parameter: "", bill: null });
      console.log("Data stored successfully");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-data-form">
      <div className="form-group">
        <label>{selectedOption} Consumption:</label>
        <input
          type="text"
          name="parameter"
          value={formData.parameter}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="bill"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default InputDataForm;
