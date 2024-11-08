import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaChartLine, FaTasks, FaTrophy, FaDatabase, FaFilePdf } from "react-icons/fa";

const Sidebar = ({ onLeaderboardClick, onChallengesClick, onInputDataClick, onReportClick , onHeadquarterDashboard,onCreatePO }) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white w-64 h-full h-[calc(100vh-2rem)] m-4 p-4 rounded-xl shadow-lg flex flex-col"style={{ height: '670px'}}>
      <h2 className="text-xl font-bold mb-8 text-center">Admin Panel</h2>

      <ul className="space-y-3">
        <li>
          <button
            onClick={() => navigate("/admin/profile")}
            className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
          >
            <FaUser className="text-lg mr-3" />
            <span>Profile</span>
          </button>
        </li>

        <li>
          <button
            onClick={() => navigate("/admin/baseline")}
            className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
          >
            <FaChartLine className="text-lg mr-3" />
            <span>Baseline Parameters</span>
          </button>
        </li>

        <li>
          <button
            onClick={onInputDataClick}
            className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
          >
            <FaDatabase className="text-lg mr-3" />
            <span>Input Data</span>
          </button>
        </li>

        <li>
          <button
            onClick={onChallengesClick}
            className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
          >
            <FaTasks className="text-lg mr-3" />
            <span>Challenges</span>
          </button>
        </li>

        <li>
          <button
            onClick={onLeaderboardClick}
            className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
          >
            <FaTrophy className="text-lg mr-3" />
            <span>Leaderboard</span>
          </button>
        </li>

        <li>
          <button
            onClick={onReportClick}
            className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
          >
            <FaFilePdf className="text-lg mr-3" />
            <span>Report</span>
          </button>
        </li>

        <li>
          <button style={{backgroundColor:'#5fa6f2'}}
            onClick={onHeadquarterDashboard}
            className="flex items-center space-x-2 p-3 w-full text-left bg-gray-800 rounded-lg hover:bg-gray-700 transition-all">
            <FaUser className="text-lg" />
            <span>Headquarter Dashboard</span>
          </button>
        </li>
        <li>
          <button style={{backgroundColor:'#5fa6f2'}}
            onClick={onCreatePO}
            className="flex items-center space-x-2 p-3 w-full text-left bg-gray-800 rounded-lg hover:bg-gray-700 transition-all">
            <FaUser className="text-lg" />
            <span>Create Post Office profile </span>
          </button>
        </li>
        <li>
          <button style={{backgroundColor:'#5fa6f2'}}
            onClick={onHeadquarterDashboard}
            className="flex items-center space-x-2 p-3 w-full text-left bg-gray-800 rounded-lg hover:bg-gray-700 transition-all">
            <FaUser className="text-lg" />
            <span>Assign Role to Post Office</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
