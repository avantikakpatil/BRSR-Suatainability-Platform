import React, { useState, useEffect } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { db, auth } from "../../../firebaseConfig";
import { ref, onValue, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import FinalReport from "./finalreport";
import "./VerifyReport.css";

const VerifyReport = () => {
  const [postOffices, setPostOffices] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Fetch data from the headquarter/postOffices node
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        console.log("No user is signed in.");
      }
    });

    const postOfficesRef = ref(db, "headquarter/postOffices");
    const postOfficesListener = onValue(postOfficesRef, (snapshot) => {
      if (snapshot.exists()) {
        const postOfficesData = [];
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();

          // Check if 'details' and 'address' fields exist before accessing them
          const details = data.details || {};
          const address = details.address || {};

          postOfficesData.push({
            id: childSnapshot.key,
            postOffice: details.name || "N/A", // Default to "N/A" if name doesn't exist
            city: address.city || "N/A", // Default to "N/A" if city doesn't exist
            type: data.type || "Unknown", // Default to "Unknown" if type doesn't exist
            year: new Date().getFullYear(),
            isVerified: data.isVerified || false,
            suggestion: data.suggestion || "",
          });
        });
        setPostOffices(postOfficesData);
      }
    });

    return () => {
      unsubscribe();
      postOfficesListener();
    };
  }, []);

  const filteredPostOffices = searchText
    ? postOffices.filter((office) => {
        const searchLower = searchText.toLowerCase();
        return (
          String(office.year).toLowerCase().includes(searchLower) ||
          office.postOffice.toLowerCase().includes(searchLower) ||
          office.city.toLowerCase().includes(searchLower) ||
          office.type.toLowerCase().includes(searchLower)
        );
      })
    : postOffices;

  const verifyReport = async (postOfficeId) => {
    try {
      await update(ref(db, `headquarter/postOffices/${postOfficeId}`), {
        isVerified: true,
      });
      setPostOffices((prev) =>
        prev.map((office) =>
          office.id === postOfficeId ? { ...office, isVerified: true } : office
        )
      );
      alert("Report verified successfully!");
    } catch (error) {
      console.error("Error verifying report:", error);
    }
  };

  const handleSuggestionChange = async (postOfficeId, suggestion) => {
    try {
      await update(ref(db, `headquarter/postOffices/${postOfficeId}`), { suggestion });
      setPostOffices((prev) =>
        prev.map((office) =>
          office.id === postOfficeId ? { ...office, suggestion } : office
        )
      );
      alert("Suggestion updated successfully!");
    } catch (error) {
      console.error("Error updating suggestion:", error);
    }
  };

  return (
    <div>
      <div className="table-container">
        <Table striped bordered hover responsive="lg">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Post Office</th>
              <th>City</th>
              <th>Type</th>
              <th>Year</th>
              <th>Verified</th>
              <th>View</th>
              <th>Download</th>
              <th>Verify</th>
              <th>Suggestion</th>
            </tr>
          </thead>
          <tbody>
            {filteredPostOffices.map((postOffice, index) => (
              <tr key={postOffice.id}>
                <td>{index + 1}</td>
                <td>{postOffice.postOffice}</td>
                <td>{postOffice.city}</td>
                <td>{postOffice.type}</td>
                <td>{postOffice.year}</td>
                <td>{postOffice.isVerified ? "Yes" : "No"}</td>
                <td>
                  <FinalReport postOffice={postOffice} previewOnly={true} />
                </td>
                <td>
                  <FinalReport postOffice={postOffice} previewOnly={false} />
                </td>
                <td>
                  {!postOffice.isVerified && (
                    <Button onClick={() => verifyReport(postOffice.id)} style={{ color: "black" }}>
                      Verify
                    </Button>
                  )}
                </td>
                <td>
                  <Form.Select
                    value={postOffice.suggestion}
                    onChange={(e) =>
                      handleSuggestionChange(postOffice.id, e.target.value)
                    }
                  >
                    <option value="">Select suggestion</option>
                    <option value="All good">All good</option>
                    <option value="Re-check energy data">Re-check Energy data</option>
                    <option value="Re-check Water details">Re-check Water data</option>
                    <option value="Re-check waste details">Re-check Waste data</option>
                    <option value="Re-check address details">Re-check Address data</option>
                    <option value="Re-check financial records">Re-check financial records</option>
                    <option value="Incomplete data submission">Incomplete data submission</option>
                  </Form.Select>
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
