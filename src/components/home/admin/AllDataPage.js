import React, { useEffect, useState } from "react";
import { db, auth } from "../../../firebaseConfig"; // Ensure this import matches your Firebase configuration
import { ref, get, child } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { jsPDF } from "jspdf"; // Import jsPDF library
import "jspdf-autotable"; // Import the jsPDF autoTable plugin

// Helper function to generate and download the PDF report
const downloadPDF = (profileData, formData) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text("Data Report", 14, 20);

  let yPosition = 30;

  // Add Profile Data Section (using table format)
  doc.setFontSize(12);
  doc.text("Profile Data:", 14, yPosition);
  yPosition += 10;

  // Create a table for profile data
  const profileTableData = Object.entries(profileData || {}).map(([key, value]) => ({
    label: key,
    value: value || "Not provided",
  }));

  doc.autoTable({
    head: [["Label", "Value"]],
    body: profileTableData.map(item => [item.label, item.value]),
    startY: yPosition,
    theme: 'grid',
    headStyles: { fillColor: [72, 133, 237], textColor: [255, 255, 255] },
    margin: { top: 10 },
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Add Input Data Section (using table format)
  doc.text("Input Data:", 14, yPosition);
  yPosition += 10;

  for (const [formName, data] of Object.entries(formData || {})) {
    doc.text(`${formName} Data:`, 14, yPosition);
    yPosition += 10;

    const formDataTable = Object.entries(data || {}).map(([key, value]) => ({
      label: key,
      value: value || "Not provided",
    }));

    doc.autoTable({
      head: [["Label", "Value"]],
      body: formDataTable.map(item => [item.label, item.value]),
      startY: yPosition,
      theme: 'grid',
      headStyles: { fillColor: [72, 133, 237], textColor: [255, 255, 255] },
      margin: { top: 10 },
    });

    yPosition = doc.lastAutoTable.finalY + 10; // Update position for next form's data
  }

  // Save the document as a PDF
  doc.save("report.pdf");
};

const AllDataPage = () => {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state to handle async behavior

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const sanitizedEmail = sanitizeEmail(user.email);
        fetchAllData(sanitizedEmail);
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe();
  }, []);

  const sanitizeEmail = (email) => email.replace(/\./g, "_").replace(/@/g, "_");

  const fetchAllData = async (sanitizedEmail) => {
    const dbRef = ref(db);
    setLoading(true); // Start loading when fetching data

    try {
      // Fetch profile data
      const profileSnapshot = await get(
        child(dbRef, `PostalManager/profile/${sanitizedEmail}`)
      );
      const profile = profileSnapshot.exists() ? profileSnapshot.val() : null;
      console.log("Profile Data: ", profile); // Log the profile data

      // Fetch input forms data
      const inputDataSnapshot = await get(
        child(dbRef, `PostalManager/${sanitizedEmail}/inputData`)
      );
      const inputData = inputDataSnapshot.exists() ? inputDataSnapshot.val() : null;
      console.log("Input Data: ", inputData); // Log the input data

      setProfileData(profile);
      setFormData(inputData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  const renderDataSection = (title, data) => {
    console.log("Rendering data for:", title, data); // Debugging the data being rendered

    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
        {data ? (
          <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-md">
            {Object.entries(data).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center bg-gray-50 p-4 rounded border shadow-sm"
              >
                <span className="font-semibold text-gray-700">{key}:</span>
                <span className="text-gray-600">{value || "Not provided"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No data available.</p>
        )}
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching data
  }

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">All Entered Data</h1>

      {/* Render Profile Data */}
      {profileData && renderDataSection("Profile Data", profileData)}

      {/* Render Input Data */}
      {formData ? (
        Object.entries(formData).map(([formName, data]) =>
          renderDataSection(`${formName} Data`, data)
        )
      ) : (
        <p className="text-gray-600">No input data available.</p>
      )}

      {/* Message when no data is available */}
      {!profileData && !formData && (
        <p className="text-gray-600">No data available or loading error occurred.</p>
      )}

      {/* Download Report Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => downloadPDF(profileData, formData)}
          className="bg-green-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-green-600"
        >
          Download Report (PDF)
        </button>
      </div>
    </div>
  );
};

export default AllDataPage;
