import React, { useState, useEffect } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { db, auth } from "../../../firebaseConfig";
import { ref, onValue, update, push } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import "./VerifyReport.css";

const VerifyReport = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [regularPostOffices, setRegularPostOffices] = useState([]);
  const [emailsInput, setEmailsInput] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchRegularPostOffices(user.email);
      } else {
        console.log("No user is signed in.");
        setReports([]);
        setRegularPostOffices([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchRegularPostOffices = (email) => {
    const userKey = email.replace(/\./g, "_");

    const regularPostOfficesRef = ref(db, `report/${userKey}/regularPostOffices`);
    onValue(regularPostOfficesRef, (snapshot) => {
      if (snapshot.exists()) {
        const emails = [];
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          if (data.emails) {
            emails.push(...data.emails);
          }
        });
        setRegularPostOffices(emails);
        fetchReportsByEmails(emails);
      } else {
        setRegularPostOffices([]);
        setReports([]);
      }
    });
  };

  const fetchReportsByEmails = (emails) => {
    const fetchedReports = [];

    emails.forEach((email) => {
      const emailKey = email.replace(/\./g, "_");
      const reportRef = ref(db, `reports/${emailKey}`);

      onValue(reportRef, async (snapshot) => {
        if (snapshot.exists()) {
          const reportData = snapshot.val();
          if (reportData.reportFileUrl) {
            try {
              const storage = getStorage();
              const fileRef = storageRef(storage, reportData.reportFileUrl);
              const fileUrl = await getDownloadURL(fileRef);

              fetchedReports.push({
                email,
                ...reportData,
                pdfUrl: fileUrl,
              });
            } catch (error) {
              console.error("Error fetching file URL: ", error);
            }
          } else {
            fetchedReports.push({ email, ...reportData });
          }
        }

        if (fetchedReports.length === emails.length) {
          setReports(fetchedReports);
        }
      });
    });
  };

  const saveRegularPostOffices = async () => {
    if (!currentUser) {
      alert("Please log in to save regular post offices.");
      return;
    }

    const emails = emailsInput
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");

    if (emails.length === 0) {
      alert("Please enter at least one valid email address.");
      return;
    }

    const userKey = currentUser.email.replace(/\./g, "_");
    const userReportRef = ref(db, `report/${userKey}/regularPostOffices`);

    try {
      const newEmailsRef = push(userReportRef);
      await update(newEmailsRef, {
        emails,
        timestamp: new Date().toISOString(),
      });

      setRegularPostOffices((prev) => [...prev, ...emails]);
      setEmailsInput("");
      alert("Regular post offices saved successfully!");
    } catch (error) {
      console.error("Error saving regular post offices:", error);
      alert("Failed to save post offices. Please try again.");
    }
  };

  const handleVerify = (email) => {
    const emailKey = email.replace(/\./g, "_");
    const reportRef = ref(db, `reports/${emailKey}`);

    update(reportRef, { verified: true })
      .then(() => alert("Report marked as verified!"))
      .catch((error) => console.error("Error verifying report:", error));
  };

  const handleSuggestionsChange = (email, suggestions) => {
    const emailKey = email.replace(/\./g, "_");
    const reportRef = ref(db, `reports/${emailKey}`);

    update(reportRef, { suggestions })
      .then(() => console.log("Suggestions saved!"))
      .catch((error) => console.error("Error saving suggestions:", error));
  };

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
    <div>
      <div className="add-post-office-container">
        <input
          style={{
            height: "50px",
            marginBottom: "10px",
            width: "400px",
          }}
          type="text"
          placeholder="Enter regular post office emails (comma-separated)"
          value={emailsInput}
          onChange={(e) => setEmailsInput(e.target.value)}
          className="email-input"
        />
        <Button onClick={saveRegularPostOffices} style={{ marginLeft: "10px" }}>
          Save Emails
        </Button>
      </div>

      <div className="table-container">
        <input
          style={{ height: "50px", marginBottom: "10px", width: "400px" }}
          type="text"
          placeholder="Search by Post Office, Branch, or PIN Code"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />
        <Table striped bordered hover responsive="lg">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Email</th>
              <th>Post Office Name</th>
              <th>Branch</th>
              <th>PIN Code</th>
              <th>Timestamp</th>
              <th>PDF Report</th>
              <th>Verify</th>
              <th>Suggestions</th>
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
                <td>{new Date(report.timestamp).toLocaleString()}</td>
                <td>
                  {report.pdfUrl ? (
                    <a href={report.pdfUrl} target="_blank" rel="noopener noreferrer">
                      View PDF
                    </a>
                  ) : (
                    "No PDF Available"
                  )}
                </td>
                <td>
                  <Button
                    variant="success"
                    onClick={() => handleVerify(report.email)}
                  >
                    Verify
                  </Button>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    placeholder="Enter suggestions"
                    defaultValue={report.suggestions || ""}
                    onChange={(e) =>
                      handleSuggestionsChange(report.email, e.target.value)
                    }
                  />
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
