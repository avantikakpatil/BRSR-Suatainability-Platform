import React, { useState } from 'react';
import './AdminForm.css';

const AdminForm = () => {
  const [formData, setFormData] = useState({
    cin: '',
    name: '',
    yearOfIncorporation: '',
    registeredOffice: '',
    corporateAddress: '',
    email: '',
    telephone: '',
    website: '',
    financialYear: '',
    stockExchange: '',
    paidUpCapital: '',
    contactName: '',
    contactDetails: '',
    reportingBoundary: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted data:', formData);
    // Add your form submission logic here, e.g., API call
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Corporate Identity Number (CIN): </label>
        <input type="text" name="cin" value={formData.cin} onChange={handleChange} required />
      </div>
      <div>
        <label>Name of the Listed Entity: </label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Year of Incorporation: </label>
        <input type="text" name="yearOfIncorporation" value={formData.yearOfIncorporation} onChange={handleChange} required />
      </div>
      <div>
        <label>Registered Office Address: </label>
        <input type="text" name="registeredOffice" value={formData.registeredOffice} onChange={handleChange} required />
      </div>
      <div>
        <label>Corporate Address: </label>
        <input type="text" name="corporateAddress" value={formData.corporateAddress} onChange={handleChange} required />
      </div>
      <div>
        <label>Email: </label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Telephone: </label>
        <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} required />
      </div>
      <div>
        <label>Website: </label>
        <input type="url" name="website" value={formData.website} onChange={handleChange} required />
      </div>
      <div>
        <label>Financial Year: </label>
        <input type="text" name="financialYear" value={formData.financialYear} onChange={handleChange} required />
      </div>
      <div>
        <label>Name of Stock Exchange(s): </label>
        <input type="text" name="stockExchange" value={formData.stockExchange} onChange={handleChange} required />
      </div>
      <div>
        <label>Paid-up Capital: </label>
        <input type="text" name="paidUpCapital" value={formData.paidUpCapital} onChange={handleChange} required />
      </div>
      <div>
        <label>Contact Name: </label>
        <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} required />
      </div>
      <div>
        <label>Contact Details (Phone/Email): </label>
        <input type="text" name="contactDetails" value={formData.contactDetails} onChange={handleChange} required />
      </div>
      <div>
        <label>Reporting Boundary (Standalone/Consolidated): </label>
        <select name="reportingBoundary" value={formData.reportingBoundary} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="standalone">Standalone</option>
          <option value="consolidated">Consolidated</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AdminForm;
