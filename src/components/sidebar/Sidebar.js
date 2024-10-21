import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaChartLine, FaTasks, FaTrophy, FaDatabase, FaFilePdf } from "react-icons/fa";

const Sidebar = ({ onLeaderboardClick, onChallengesClick, onInputDataClick, onReportClick }) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar bg-blue-80 text-white w-60 h-full flex flex-col p-4" style={{ marginTop: '60px', height: '1000px',backgroundColor:'#5fa6f2' }}>
      <h2 className="text-xl font-bold mb-6 text-center">Admin Panel</h2>

      <ul className="flex flex-col space-y-4" >
        <li>
          <button style={{backgroundColor:'#5fa6f2'}}
            onClick={() => navigate("/admin/profile")} // Navigate to AdminForm
            className="flex items-center space-x-2 p-3 w-full text-left bg-gray-800 rounded-lg hover:bg-gray-700 transition-all"
          >
            <FaUser className="text-lg" />
            <span>Profile</span>
          </button>
        </li>

        <li>
          <button style={{backgroundColor:'#5fa6f2'}}
            onClick={() => navigate("/admin/baseline")}
            className="flex items-center space-x-2 p-3 w-full text-left bg-gray-800 rounded-lg hover:bg-gray-700 transition-all"
          >
            <FaChartLine className="text-lg" />
            <span>Baseline Parameters</span>
          </button>
        </li>

        <li>
          <button style={{backgroundColor:'#5fa6f2'}}
            onClick={onInputDataClick}
            className="flex items-center space-x-2 p-3 w-full text-left bg-gray-800 rounded-lg hover:bg-gray-700 transition-all"
          >
            <FaDatabase className="text-lg" />
            <span>Input Data</span>
          </button>
        </li>

        <li>
          <button style={{backgroundColor:'#5fa6f2'}}
            onClick={onChallengesClick}
            className="flex items-center space-x-2 p-3 w-full text-left bg-gray-800 rounded-lg hover:bg-gray-700 transition-all"
          >
            <FaTasks className="text-lg" />
            <span>Challenges</span>
          </button>
        </li>

        <li>
          <button style={{backgroundColor:'#5fa6f2'}}
            onClick={onLeaderboardClick}
            className="flex items-center space-x-2 p-3 w-full text-left bg-gray-800 rounded-lg hover:bg-gray-700 transition-all"
          >
            <FaTrophy className="text-lg" />
            <span>Leaderboard</span>
          </button>
        </li>

        <li>
          <button style={{backgroundColor:'#5fa6f2'}}
            onClick={onReportClick}
            className="flex items-center space-x-2 p-3 w-full text-left bg-gray-800 rounded-lg hover:bg-gray-700 transition-all"
          >
            <FaFilePdf className="text-lg" />
            <span>Report</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;