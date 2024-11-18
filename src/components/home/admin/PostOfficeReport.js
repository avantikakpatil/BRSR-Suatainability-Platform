import React, { useState } from "react";

const PostOfficeReport = ({ onSubmitReport }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitReport) {
      onSubmitReport(reportData); // Pass the report data to the parent component or API
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
          Upload Report File
        </label>
        <input
          type="file"
          name="reportFile"
          id="reportFile"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
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
