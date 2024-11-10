import React from 'react';
import { useNavigate } from 'react-router-dom';

const Rdb = () => {
  const navigate = useNavigate();

  const handleSetBaseline = () => {
    navigate('/admin/ResourceUsageForm');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-200 to-blue-200 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-xl p-8">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-6">
          Welcome! To Your Office
        </h1>
        <p className="text-lg text-center text-gray-600 mb-8">
          Comprehensive Overview of Branch Operations
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Post Office Info */}
          <div className="bg-green-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Branch Information</h2>
            <ul className="text-gray-700">
              <li><strong>Post Office Name:</strong> Main Post Office</li>
              <li><strong>Location:</strong> City Center, District</li>
              <li><strong>Postal Zone:</strong> North Zone</li>
              <li><strong>Contact:</strong> +123-456-7890</li>
            </ul>
          </div>

          {/* Operational Metrics */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Operational Metrics</h2>
            <ul className="text-gray-700">
              <li><strong>Number of Employees:</strong> 45</li>
              <li><strong>Daily Transactions:</strong> 350 on average</li>
              <li><strong>Monthly Revenue:</strong> $50,000</li>
              <li><strong>Postal Deliveries Per Day:</strong> 1,200</li>
            </ul>
          </div>

          {/* Infrastructure Details */}
          <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-yellow-700 mb-4">Infrastructure</h2>
            <ul className="text-gray-700">
              <li><strong>Counters:</strong> 5</li>
              <li><strong>Sorting Machines:</strong> 3</li>
              <li><strong>Key Services:</strong> Speed Post, Registered Post, Savings Account, Insurance</li>
            </ul>
          </div>

          {/* Additional Services */}
          <div className="bg-red-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-red-700 mb-4">Services Offered</h2>
            <ul className="text-gray-700">
              <li><strong>Financial Services:</strong> Postal Savings, Insurance</li>
              <li><strong>Mail Services:</strong> Speed Post, Registered Post</li>
              <li><strong>Parcel Services:</strong> National and International</li>
              <li><strong>Utility Payments:</strong> Bill Collection</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSetBaseline}
            className="bg-green-600 text-white text-lg px-8 py-4 rounded-lg hover:bg-green-500 shadow-lg transition duration-300"
          >
            Set Baseline
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rdb;
