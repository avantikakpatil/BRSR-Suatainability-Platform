import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { db } from "../../../firebaseConfig"; // Replace with your Firebase config path
import { ref, onValue, remove, update } from "firebase/database";
import "./VerifyReport.css";

const VerifyReport = () => {
  const [reports, setReports] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState({}); // Tracks suggestions for each report

  // Fetch reports from Firebase
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

  // Handle verifying a report
  const handleVerify = (email) => {
    const emailKey = email.replace(/\./g, "_"); // Convert email back to Firebase-safe key
    const reportRef = ref(db, `reports/${emailKey}`);
    update(reportRef, { verified: true })
      .then(() => alert("Report marked as verified."))
      .catch((error) => alert("Error verifying report: " + error.message));
  };

  // Handle deleting a report
  const handleDelete = (email) => {
    const emailKey = email.replace(/\./g, "_"); // Convert email back to Firebase-safe key
    const reportRef = ref(db, `reports/${emailKey}`);
    remove(reportRef)
      .then(() => alert("Report deleted successfully."))
      .catch((error) => alert("Error deleting report: " + error.message));
  };

  // Handle saving a suggestion
  const handleSaveSuggestion = (email) => {
    const emailKey = email.replace(/\./g, "_"); // Convert email back to Firebase-safe key
    const reportRef = ref(db, `reports/${emailKey}`);
    const suggestion = suggestions[email] || "";
    update(reportRef, { suggestion })
      .then(() => alert("Suggestion saved successfully."))
      .catch((error) => alert("Error saving suggestion: " + error.message));
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
              <th>Suggestion</th>
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
                    style={{background:"grey"}}
                  >
                    View Report
                  </Button>{" "}
                  <Button
                    variant="success"
                    onClick={() => handleVerify(report.email)}
                    style={{background:"blue"}}
                  >
                    Verify
                  </Button>{" "}
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(report.email)}
                    style={{background:"red"}}
                  >
                    Delete
                  </Button>
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Enter suggestion"
                    value={suggestions[report.email] || ""}
                    onChange={(e) =>
                      setSuggestions({
                        ...suggestions,
                        [report.email]: e.target.value,
                      })
                    }
                  />
                  <Button
                    variant="info"
                    onClick={() => handleSaveSuggestion(report.email)}
                    style={{ marginTop: "5px" }}
                  >
                    Save
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