import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ onInputDataClick, onLeaderboardClick, onChallengesClick, onReportClick }) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar w-48 bg-gray-800 text-white h-full" style={{ marginTop: '60px', height: '650px' }}>
      <h2 className="text-lg font-bold p-4">Admin Menu</h2>
      <ul className="flex flex-col p-4">
        <li className="mb-2">
          <button onClick={() => navigate("/admin/inputdata")} className="hover:underline">
            Input Data
          </button>
        </li>
        <li className="mb-2">
          <button onClick={onChallengesClick} className="hover:underline">
            Challenges
          </button>
        </li>
        <li className="mb-2">
          <button onClick={onLeaderboardClick} className="hover:underline">
            Leaderboard
          </button>
        </li>
        <li className="mb-2">
          <button onClick={() => navigate("/admin/reports")} className="hover:underline">
            Report
          </button>
        </li>
        <li className="mb-2">
          <Link to="/admin/analytics" className="hover:underline">
            Analytics
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/admin/settings" className="hover:underline">
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;