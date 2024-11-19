import React, { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import { ref, onValue } from "firebase/database";

const ListPO = () => {
  const [postOffices, setPostOffices] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Reference to the headquarter node in the database
    const headquarterRef = ref(db, "headquarter");

    // Listen for changes in the database
    onValue(headquarterRef, (snapshot) => {
      const data = snapshot.val();
      const postOfficeArray = [];

      // Iterate through headquarters to access post offices
      for (const hqKey in data) {
        const postOfficesData = data[hqKey]?.postOffices;
        if (postOfficesData) {
          for (const poKey in postOfficesData) {
            postOfficeArray.push({
              ...postOfficesData[poKey],
              id: poKey, // Store the unique id for each post office
            });
          }
        }
      }
      setPostOffices(postOfficeArray);
    });
  }, []);

  // Apply filter based on the selected post office type
  const filteredPosts = postOffices.filter((po) => {
    if (filter === "all") return true;
    return po.type === filter;
  });

  return (
    <div>
      <h2><b>List of Post Offices</b></h2>
      
      {/* Filter Dropdown */}
      <div style={{ width: "25%", marginBottom: "20px" }}>
        <select
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "10px", fontSize: "14px" }}
        >
          <option value="all">All</option>
          <option value="regular">Regular</option>
          <option value="divisional">Divisional</option>
        </select>
      </div>

      {/* Table to Display Post Offices */}
      <table
        style={{
          fontSize: "13px",
          width: "100%",
          borderCollapse: "collapse",
          margin: "0 auto",
        }}
      >
        <thead>
          <tr>
            <th style={styles.tableHeader}>CIN</th>
            <th style={styles.tableHeader}>Name</th>
            <th style={styles.tableHeader}>Type</th>
            <th style={styles.tableHeader}>Address</th>
            <th style={styles.tableHeader}>Telephone</th>
            <th style={styles.tableHeader}>Website</th>
            <th style={styles.tableHeader}>Contact Number</th>
            <th style={styles.tableHeader}>Email</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through filtered post offices and display them */}
          {filteredPosts.map((po) => (
            <tr key={po.id} style={styles.tableRow}>
              <td style={styles.tableCell}>{po.details?.cin || "N/A"}</td>
              <td style={styles.tableCell}>{po.details?.name || "N/A"}</td>
              <td style={styles.tableCell}>{po.type || "N/A"}</td>
              <td style={styles.tableCell}>
                {po.details?.address
                  ? `${po.details.address.country}, ${po.details.address.state}, ${po.details.address.city}, ${po.details.address.pincode}`
                  : "N/A"}
              </td>
              <td style={styles.tableCell}>{po.details?.telephone || "N/A"}</td>
              <td style={styles.tableCell}>{po.details?.website || "N/A"}</td>
              <td style={styles.tableCell}>{po.details?.contactNumber || "N/A"}</td>
              <td style={styles.tableCell}>{po.details?.email || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styling for table and form elements
const styles = {
  tableHeader: {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
    backgroundColor: "#f4f4f4",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableCell: {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
  },
};

export default ListPO;
