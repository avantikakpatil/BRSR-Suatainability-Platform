import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const PostOfficeReport = () => {
  const [reportData, setReportData] = useState({
    postOfficeName: "",
    branch: "",
    pinCode: "",
    reportFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setReportData((prevData) => ({
      ...prevData,
      reportFile: e.target.files[0], // Store the uploaded file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Firebase Authentication to get the logged-in user's email
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const email = user.email.replace(/\./g, "_"); // Replace "." in email with "_" to avoid Firebase key issues

      // Firebase Realtime Database reference
      const db = getDatabase();
      const reportRef = ref(db, `reports/${email}`); // Node: reports/{email}

      const reportFile = reportData.reportFile;

      if (!reportFile) {
        alert("Please upload a report file.");
        return;
      }

      // Convert the file to a Base64 string (or you could use a file path in a different node)
      const reader = new FileReader();
      reader.onloadend = async () => {
        const fileBase64 = reader.result;

        // Data to be saved in Realtime Database
        const dataToSave = {
          postOfficeName: reportData.postOfficeName,
          branch: reportData.branch,
          pinCode: reportData.pinCode,
          reportFileBase64: fileBase64, // Save the Base64 encoded file
          timestamp: new Date().toISOString(), // Add a timestamp
        };

        try {
          // Save data to Firebase Realtime Database
          await set(reportRef, dataToSave);
          alert("Report submitted successfully!");
          setReportData({
            postOfficeName: "",
            branch: "",
            pinCode: "",
            reportFile: null,
          }); // Reset form
        } catch (error) {
          console.error("Error saving data to Firebase: ", error);
          alert("Failed to save the report data. Please try again.");
        }
      };

      // Read the file as Base64
      reader.readAsDataURL(reportFile);
    } else {
      alert("You must be logged in to submit a report.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Submit Post Office Report</h2>

      {/* Name of Post Office */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="postOfficeName">
          Name of Post Office
        </label>
        <input
          type="text"
          name="postOfficeName"
          id="postOfficeName"
          value={reportData.postOfficeName}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
          required
        />
      </div>

      {/* Branch */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="branch">
          Branch
        </label>
        <input
          type="text"
          name="branch"
          id="branch"
          value={reportData.branch}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
          required
        />
      </div>

      {/* PIN Code */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="pinCode">
          PIN Code
        </label>
        <input
          type="text"
          name="pinCode"
          id="pinCode"
          value={reportData.pinCode}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
          required
        />
      </div>

      {/* File Upload */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="reportFile">
          Upload Report File (PDF)
        </label>
        <input
          type="file"
          name="reportFile"
          id="reportFile"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
          accept=".pdf"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Submit Report
      </button>
    </form>
  );
};

export default PostOfficeReport;
