import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { ref, onValue } from 'firebase/database';

const ListPO = () => {
  const [postOffices, setPostOffices] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const postOfficeRef = ref(db, 'postOffices');
    onValue(postOfficeRef, (snapshot) => {
      const data = snapshot.val();
      const postOfficeArray = [];
      for (const key in data) {
        postOfficeArray.push({ ...data[key], id: key });
      }
      setPostOffices(postOfficeArray);
    });
  }, []);

  const filteredPosts = postOffices.filter(po => {
    if (filter === 'all') {
      return true;
    } else {
      return po.type === filter;
    }
  });

  return (
    <div>
      <h2><b>List of Post Offices</b></h2>
      <div style={{width:'25%'}}>
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="regular">Regular</option>
        <option value="divisional">Divisional</option>
      </select>
      </div>

      <table style={{fontSize:'13px'}}>
        <thead>
          <tr>
            <th>CIN</th>
            <th>Name</th>
            <th>Type</th>
            <th>Address</th>
            <th>Telephone</th>
            <th>Website</th>
            <th>Contact Number</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((po) => (
            <tr key={po.id}>
              <td>{po.details.cin}</td>
              <td>{po.details.name}</td>
              <td>{po.type}</td>
              <td>
                {po.details.address.country}, {po.details.address.state}, {po.details.address.city}, {po.details.address.pincode}
              </td>
              <td>{po.details.telephone}</td>
              <td>{po.details.website}</td>
              <td>{po.details.contactNumber}</td>
              <td>{po.details.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListPO;