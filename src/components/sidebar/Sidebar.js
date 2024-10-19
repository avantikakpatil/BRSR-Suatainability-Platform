import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ onInputDataClick, onLeaderboardClick, onChallengesClick }) => { // Include onChallengesClick as a prop
  return (
    <div className="sidebar w-64 bg-gray-800 text-white h-full" style={{ marginTop: '60px', height: '650px' }}>
      <h2 className="text-lg font-bold p-4">Admin Menu</h2>
      <ul className="flex flex-col p-4">
        <li className="mb-2">
          <button onClick={onInputDataClick} className="hover:underline">
            Input Data
          </button>
        </li>
        <li className="mb-2">
          <button onClick={onChallengesClick} className="hover:underline"> {/* Use the prop here */}
            Challenges
          </button>
        </li>
        <li className="mb-2">
          <button onClick={onLeaderboardClick} className="hover:underline">
            Leaderboard
          </button>
        </li>
        <li className="mb-2">
          <Link to="/admin/reports" className="hover:underline">
            Reports
          </Link>
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
