import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { db, auth } from '../../../firebaseConfig';
import { ref, get, child } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

const PostOffices = () => {
  const [profileData, setProfileData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchText, setSearchText] = useState("");

  const postOffices = [
    {
      id: 1,
      postOffice: "Post Office 1",
      city: "Mumbai",
      address: "123 Main St.",
      state: "Maharashtra",
      pincode: "400001",
      year: 2023,
    },
    {
      id: 2,
      postOffice: "Post Office 2",
      city: "Delhi",
      address: "456 Central Rd.",
      state: "Delhi",
      pincode: "110001",
      year: 2022,
    },
    {
      id: 3,
      postOffice: "Post Office 3",
      city: "Chennai",
      address: "789 South St.",
      state: "Tamil Nadu",
      pincode: "600002",
      year: 2023,
    },
    {
      id: 4,
      postOffice: "Post Office 4",
      city: "Kolkata",
      address: "101 East St.",
      state: "West Bengal",
      pincode: "700001",
      year: 2021,
    },
    {
      id: 5,
      postOffice: "Post Office 5",
      city: "Bangalore",
      address: "234 North St.",
      state: "Karnataka",
      pincode: "560001",
      year: 2022,
    },
    {
      id: 6,
      postOffice: "Post Office 6",
      city: "Hyderabad",
      address: "567 West St.",
      state: "Telangana",
      pincode: "500001",
      year: 2023,
    },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const sanitizedEmail = user.email.replace(/\./g, '_').replace(/@/g, '_');
        fetchProfileData(sanitizedEmail);
      } else {
        console.log('No user is signed in.');
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProfileData = async (sanitizedEmail) => {
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, `PostalManager/profile/${sanitizedEmail}`));
      if (snapshot.exists()) {
        setProfileData(snapshot.val());
      } else {
        console.log("No profile data available");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const filteredPostOffices = searchText
    ? postOffices.filter((office) => {
        const searchLower = searchText.toLowerCase();
        return (
          String(office.year).toLowerCase().includes(searchLower) ||
          office.postOffice.toLowerCase().includes(searchLower) ||
          office.city.toLowerCase().includes(searchLower)
        );
      })
    : postOffices;

  const generatePDF = (postOffice, isForView = false) => {
    const doc = new jsPDF();

    // Title and Post Office Info
    doc.setFontSize(18);
    doc.text("Business Responsibility and Sustainability Report", 14, 22);
    doc.setFontSize(14);
    doc.text(`Post Office Name: ${postOffice.postOffice}`, 14, 30);
    doc.text(
      `Address: ${postOffice.address}, ${postOffice.city}, ${postOffice.state} - ${postOffice.pincode}`,
      14,
      36
    );

    // Section A: General Disclosures (Using Admin Form Data)
    doc.setFontSize(16);
    doc.text("SECTION A: GENERAL DISCLOSURES", 14, 46);

    autoTable(doc, {
      startY: 52,
      head: [["Details", "Information"]],
      body: [
        ["CIN", profileData?.cin || "Not provided"],
        ["Name of the Listed Entity", profileData?.name || postOffice.postOffice],
        ["Year of Incorporation", profileData?.yearOfIncorporation || "Not provided"],
        ["Registered Office Address", profileData?.registeredOffice || postOffice.address],
        ["Corporate Address", profileData?.corporateAddress || postOffice.address],
        ["Email", profileData?.email || "Not provided"],
        ["Telephone", profileData?.telephone || "Not provided"],
        ["Website", profileData?.website || "Not provided"],
        ["Financial Year", profileData?.financialYear || "Not provided"],
        ["Stock Exchange", profileData?.stockExchange || "Not provided"],
        ["Paid-up Capital", profileData?.paidUpCapital || "Not provided"],
        ["Contact Person Name", profileData?.contactName || "Not provided"],
        ["Contact Details", profileData?.contactDetails || "Not provided"],
        ["Reporting Boundary", profileData?.reportingBoundary || "Not provided"]
      ],
    });

    // Section B: Sustainability Information
    doc.setFontSize(16);
    doc.text(
      "SECTION B: SUSTAINABILITY INFORMATION",
      14,
      doc.lastAutoTable.finalY + 10
    );

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Metric", "Details"]],
      body: [
        ["CSR Activities", "Clean Energy Projects, Education Programs"],
        ["Energy Consumption", "2000 KWh per year"],
        ["Water Usage", "5000 liters per month"],
        ["Waste Management", "Recycling and proper disposal of hazardous materials"],
        ["Employee Health & Safety", "100% Health Coverage, Regular Safety Audits"],
      ],
    });

    // Final touches for official formatting
    doc.setFontSize(12);
    doc.text(
      `Report Generated by ${profileData?.name || postOffice.postOffice}`,
      14,
      doc.lastAutoTable.finalY + 20
    );
    doc.text(
      `Contact Information: ${profileData?.email || "N/A"} | ${profileData?.telephone || "N/A"}`,
      14,
      doc.lastAutoTable.finalY + 26
    );

    if (isForView) {
      const string = doc.output("bloburl");
      window.open(string);
    } else {
      doc.save(`${postOffice.postOffice}_BRSR_Report.pdf`);
    }
  };

  return (
    <div className="post-office-container" style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
        Post Office Yearly Reports
      </h1>
      {!profileData && (
        <div className="alert alert-warning" style={{ fontSize: '16px', marginBottom: '20px' }}>
          Please complete your profile information in the Admin Form before generating reports.
        </div>
      )}
      <div className="search-bar" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by year, post office, or city"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            padding: '10px',
            width: '100%',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        />
      </div>
      <div className="table-container" style={{ marginTop: '20px' }}>
        <Table striped bordered hover style={{ fontSize: '16px' }}>
          <thead style={{ backgroundColor: '#f8f9fa', color: '#495057' }}>
            <tr>
              <th>Sr No.</th>
              <th>Post Office</th>
              <th>City</th>
              <th>Year</th>
              <th>View</th>
              <th>Download PDF</th>
            </tr>
          </thead>
          <tbody>
            {filteredPostOffices.map((postOffice, index) => (
              <tr key={postOffice.id}>
                <td>{index + 1}</td>
                <td>{postOffice.postOffice}</td>
                <td>{postOffice.city}</td>
                <td>{postOffice.year}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => generatePDF(postOffice, true)}
                    style={{
                      backgroundColor: "#3d89da",
                      borderRadius: '5px',
                      padding: '8px 15px',
                      fontSize: '16px',
                    }}
                  >
                    View
                  </Button>
                </td>
                <td>
                  <Button
                    variant="success"
                    onClick={() => generatePDF(postOffice)}
                    style={{
                      backgroundColor: "#28a745",
                      borderRadius: '5px',
                      padding: '8px 15px',
                      fontSize: '16px',
                    }}
                  >
                    Download PDF
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

export default PostOffices;
