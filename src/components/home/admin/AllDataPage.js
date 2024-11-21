import React, { useEffect, useState } from "react";
import { db, auth } from "../../../firebaseConfig"; 
import { ref, get, child } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { jsPDF } from "jspdf"; 
import "jspdf-autotable"; 

// Helper function to generate and download the PDF report
const downloadPDF = (profileData, formData) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text("Business Responsibility and Sustainability Report", 14, 20);

  let yPosition = 30;

  // Add Profile Data Section
  doc.setFontSize(14);
  doc.text("Profile Data", 14, yPosition);
  yPosition += 10;

  // Format Profile Data in a table
  const profileTableData = Object.entries(profileData || {}).map(([key, value]) => [
    key,
    value || "Not provided",
  ]);

  doc.autoTable({
    head: [["Label", "Value"]],
    body: profileTableData,
    startY: yPosition,
    theme: "grid",
    headStyles: { fillColor: [72, 133, 237], textColor: [255, 255, 255] },
  });

  // Update yPosition after profile data table
  yPosition = doc.lastAutoTable.finalY + 10;

  // Add Input Data Sections for each parameter
  if (formData) {
    Object.entries(formData).forEach(([formName, data]) => {
      doc.text(`${formName} Data:`, 14, yPosition);
      yPosition += 10;

      // Format form data in a table
      const formDataTable = Array.isArray(data)
        ? data.map((item, index) => [index + 1, JSON.stringify(item)])
        : Object.entries(data || {}).map(([key, value]) => [
            key,
            value || "Not provided",
          ]);

      doc.autoTable({
        head: [["Label", "Value"]],
        body: formDataTable,
        startY: yPosition,
        theme: "grid",
        headStyles: { fillColor: [72, 133, 237], textColor: [255, 255, 255] },
      });

      // Update yPosition after form data table
      yPosition = doc.lastAutoTable.finalY + 10;
    });
  } else {
    doc.text("No input data available.", 14, yPosition);
  }

  // Save the document as a PDF
  doc.save("Business_Responsibility_Report.pdf");
};

const AllDataPage = () => {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const sanitizeEmail = (email) => email.replace(/[.#$/[\]]/g, "_");

  const fetchAllData = async (sanitizedEmail) => {
    const dbRef = ref(db);
    setLoading(true);
    setError(null);

    try {
      const profilePath = `PostalManager/profile/${sanitizedEmail}`;
      const profileSnapshot = await get(child(dbRef, profilePath));
      const profile = profileSnapshot.exists() ? profileSnapshot.val() : null;

      const inputDataPath = `PostalManager/${sanitizedEmail}/inputData`;
      const inputDataSnapshot = await get(child(dbRef, inputDataPath));
      const inputData = inputDataSnapshot.exists() ? inputDataSnapshot.val() : null;

      setProfileData(profile);
      setFormData(inputData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderDataSection = (title, data) => (
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
              <span className="text-gray-600">
                {Array.isArray(value)
                  ? value.map((item, idx) => (
                      <span key={idx}>{JSON.stringify(item)}</span>
                    ))
                  : value || "Not provided"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No data available for {title.toLowerCase()}.</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">All Entered Data</h1>

      {error && <p className="text-red-500">{error}</p>}

      {profileData && renderDataSection("Profile Data", profileData)}

      {formData &&
        Object.entries(formData).map(([key, value]) =>
          renderDataSection(`${key} Data`, value)
        )}

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
