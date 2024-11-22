import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { db } from "../../../firebaseConfig"; // Replace with your Firebase config path
import { ref, onValue } from "firebase/database";
import "./VerifyReport.css";

const VerifyReport = () => {
  const [reports, setReports] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Fetch reports from the 'reports' node in Firebase
  const fetchReports = () => {
    const reportsRef = ref(db, "reports");

    onValue(reportsRef, (snapshot) => {
      if (snapshot.exists()) {
        const fetchedReports = [];
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          fetchedReports.push({
            email: childSnapshot.key.replace(/_/g, "."), // Convert Firebase-safe key back to email
            ...data,
          });
        });
        setReports(fetchedReports);
      } else {
        console.log("No reports found.");
      }
    });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Handle viewing the report PDF
  const handleViewReport = (base64Data) => {
    if (!base64Data) {
      alert("No report available.");
      return;
    }

    // Convert Base64 to Blob
    const byteCharacters = atob(base64Data.split(",")[1]); // Decode Base64
    const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // Generate Blob URL
    const blobUrl = URL.createObjectURL(blob);

    // Open Blob URL in a new tab
    window.open(blobUrl, "_blank");
  };

  // Filter reports based on search text
  const filteredReports = searchText
    ? reports.filter((report) => {
        const searchLower = searchText.toLowerCase();
        return (
          (report.postOfficeName || "").toLowerCase().includes(searchLower) ||
          (report.branch || "").toLowerCase().includes(searchLower) ||
          (report.pinCode || "").toLowerCase().includes(searchLower)
        );
      })
    : reports;

  return (
    <div className="verify-report-container">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          style={{ height: "50px", marginBottom: "10px", width: "400px" }}
          type="text"
          placeholder="Search by Post Office, Branch, or PIN Code"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Reports Table */}
      <div className="table-container">
        <Table striped bordered hover responsive="lg">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Email</th>
              <th>Post Office Name</th>
              <th>Branch</th>
              <th>PIN Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{report.email}</td>
                <td>{report.postOfficeName || "N/A"}</td>
                <td>{report.branch || "N/A"}</td>
                <td>{report.pinCode || "N/A"}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleViewReport(report.reportFileBase64)}
                    disabled={!report.reportFileBase64}
                  >
                    View Report
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default VerifyReport;
