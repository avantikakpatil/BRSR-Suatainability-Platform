import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser,FaFilePdf, FaChartPie } from "react-icons/fa"; // Import FaChartPie for the Dashboard icon

const HeadquarterSidebar = ({ onHeadquarterDashboard, onCreatePO, onListPO,onReportClick }) => {
  const navigate = useNavigate();

  return (
    <div
      className="sidebar text-white w-64 h-full h-[calc(100vh-2rem)] m-4 p-4 rounded-xl shadow-lg flex flex-col"
      style={{
        background: 'rgba(0, 0, 0, 0)', // Set background to fully transparent
        height: '670px', // Set the height to 670px or adjust as needed
      }}
    >
      <div
        className="sidebar bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white w-64 h-full p-4 rounded-xl shadow-lg flex flex-col"
        style={{
          position: 'fixed', // Make the sidebar fixed on the page
          top: '0', // Stick it to the top
          left: '0', // Stick it to the left
          width: '17%',
          height: '100vh', // Ensure the sidebar takes up the full height of the viewport
          zIndex: '1000', // Ensure the sidebar is above other content
        }}
      >
        <h2 className="text-xl font-bold mb-8 text-center">Admin Panel</h2>

        <ul className="space-y-3">
          {/* New Dashboard Button */}
          <li>
            <button
              onClick={onHeadquarterDashboard}
              className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
            >
              <FaChartPie className="text-lg mr-3" /> {/* Dashboard Icon */}
              <span>Headquarter Dashboard</span>
            </button>
          </li>

          <li>
            <button
              onClick={onCreatePO}
              className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md">
              <FaUser className="text-lg mr-3" />
              <span>Create Post Office Profile</span>
            </button>
          </li>

          <li>
            <button
              onClick={onListPO}
              className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md">
              <FaUser className="text-lg mr-3" />
              <span>Post Offices List</span>
            </button>
          </li>
          <li>
            <button
              onClick={onReportClick}
              className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md">
              <FaFilePdf className="text-lg mr-3" />
              <span>Report</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/admin/dashboard")} // Navigates to the dashboard page
              className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
            >
              <FaChartPie className="text-lg mr-3" /> {/* Dashboard Icon */}
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/admin/profile")}
              className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
            >
              <FaUser className="text-lg mr-3" />
              <span>Profile</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HeadquarterSidebar;