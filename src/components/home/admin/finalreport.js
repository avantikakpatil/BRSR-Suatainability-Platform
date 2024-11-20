import jsPDF from 'jspdf';

const finalreport = ({ postOffice, previewOnly = false }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Post Office Yearly Report", 14, 22);

    doc.setFontSize(12);
    doc.text(`Post Office: ${postOffice.postOffice}`, 14, 40);
    doc.text(`City: ${postOffice.city}`, 14, 50);
    doc.text(`Type: ${postOffice.type}`, 14, 60);
    doc.text(`Year: ${postOffice.year}`, 14, 70);
    doc.text(`State: ${postOffice.state}`, 14, 80);
    doc.text(`Pincode: ${postOffice.pincode}`, 14, 90);

    if (previewOnly) {
      // Preview PDF in a new tab
      const pdfDataUri = doc.output("datauristring");
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(
          `<iframe src="${pdfDataUri}" width="100%" height="100%"></iframe>`
        );
      }
    } else {
      // Download PDF
      doc.save(`${postOffice.postOffice}-Report.pdf`);
    }
  };

  return (
    <button onClick={generatePDF}>
      {previewOnly ? "View Report" : "Download Report"}
    </button>
  );
};

export default finalreport;
