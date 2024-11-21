import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaChartLine, FaTasks, FaTrophy, FaDatabase, FaFilePdf, FaChartPie } from "react-icons/fa";
import { getDatabase, ref, child, get } from "firebase/database";
import { getAuth } from "firebase/auth";

const Sidebar = ({
  onLeaderboardClick,
  onChallengesClick,
  onInputDataClick,
  onReportClick,
  onHeadquarterDashboard,
  onCreatePO,
  onListPO,
  onSetDeadline,
  onVerifyReport,
  onPostOfficeReport,
  onAllDataPageClick,
}) => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const userRef = ref(db, 'users/' + user.uid);
      
      // Fetch user data (role and profile completion status) from Firebase
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            console.log("Fetched user data:", userData);  // Debugging line
            setUserRole(userData.role);  // Set role from fetched data
          } else {
            console.log("No data available");
            setUserRole(null);  // Reset if no data
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setUserRole(null);  // In case of error, reset the role
        });
    } else {
      console.log("No user is logged in.");
    }
  }, [user]);  // Only run when the user changes

  // If no role is found, return loading state
  if (userRole === null) {
    return <div>Loading...</div>;  // Show loading until role is fetched
  }

  // Debugging output for current user role
  console.log("Current user role:", userRole);

  return (
    <div
      className="sidebar text-white w-64 h-full h-[calc(100vh-2rem)] m-4 p-4 rounded-xl shadow-lg flex flex-col"
      style={{
        background: "rgba(0, 0, 0, 0)", // Fully transparent background
        height: "670px", // Sidebar height adjustment
      }}
    >
      <div
        className="sidebar bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white w-64 h-full p-4 rounded-xl shadow-lg flex flex-col overflow-y-auto"
        style={{
          position: "fixed", // Fix sidebar on the page
          top: "0", // Stick to top
          left: "0", // Stick to left
          width: "17%",
          height: "100vh", // Full viewport height
          zIndex: "1000", // Stay above other content
        }}
      >
        <h2 className="text-xl font-bold mb-8 text-center">Admin Panel</h2>

        <ul className="space-y-3">
          

          {/* Profile */}
          <li>
            <button
              onClick={() => navigate("/admin/profile")}
              className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
            >
              <FaUser className="text-lg mr-3" />
              <span>Profile</span>
            </button>
          </li>

          {/* DoP Headquarters Role */}
          {userRole === "DoP Headquarters" && (
            <>
              {/* Dashboard */}
              <li>
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
                >
                  <FaChartPie className="text-lg mr-3" />
                  <span>Dashboard</span>
                </button>
              </li>

              {/* Create Post Office Profile */}
              <li>
                <button
                  onClick={onCreatePO}
                  className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
                >
                  <FaUser className="text-lg mr-3" />
                  <span>Create Post Office Profile</span>
                </button>
              </li>

              {/* Post Offices List */}
              <li>
                <button
                  onClick={onListPO}
                  className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
                >
                  <FaUser className="text-lg mr-3" />
                  <span>Post Offices List</span>
                </button>
              </li>

              {/* Leaderboard */}
              <li>
                <button
                  onClick={onLeaderboardClick}
                  className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
                >
                  <FaTrophy className="text-lg mr-3" />
                  <span>Leaderboard</span>
                </button>
              </li>
            </>
          )}

          {/* Postal Managers (Regional Managers) Role */}
          {userRole === "Postal Managers (Regional Managers)" && (
            <>
              {/* Dashboard */}
              <li>
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
                >
                  <FaChartPie className="text-lg mr-3" />
                  <span>Dashboard</span>
                </button>
              </li>

              {/* Baseline Parameters */}
              <li>
                <button
                  onClick={() => navigate("/admin/baseline")}
                  className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
                >
                  <FaChartLine className="text-lg mr-3" />
                  <span>Baseline Parameters</span>
                </button>
              </li>

              {/* Input Data */}
              <li>
                <button
                  onClick={onInputDataClick}
                  className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
                >
                  <FaDatabase className="text-lg mr-3" />
                  <span>Input Data</span>
                </button>
              </li>

              {/* Challenges */}
              <li>
                <button
                  onClick={onChallengesClick}
                  className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
                >
                  <FaTasks className="text-lg mr-3" />
                  <span>Challenges</span>
                </button>
              </li>

              {/* Leaderboard */}
              <li>
                <button
                  onClick={onLeaderboardClick}
                  className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
                >
                  <FaTrophy className="text-lg mr-3" />
                  <span>Leaderboard</span>
                </button>
              </li>

              {/* Post Office Report */}
              <li>
                <button
                  onClick={onPostOfficeReport}
                  className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
                >
                  <FaFilePdf className="text-lg mr-3" />
                  <span>Post Office Report</span>
                </button>
              </li>

              <li>
      <button
        onClick={onHeadquarterDashboard}
        className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
      >
        <FaUser className="text-lg mr-3" />
        <span>Headquarter Dashboard</span>
      </button>
    </li>
              
              <li>
            <button
              onClick={onAllDataPageClick}
              className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
            >
              <FaDatabase className="text-lg mr-3" />
              <span>All Data Page</span>
            </button>
          </li>
            </>
          )}

          {/* Post Office Heads Role */}
          {userRole === "Post Office Heads" && (
            <>
              {/* Dashboard */}
              <li>
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
                >
                  <FaChartPie className="text-lg mr-3" />
                  <span>Dashboard</span>
                </button>
              </li>

              {/* Verify Report */}
              <li>
                <button
                  onClick={onVerifyReport}
                  className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
                >
                  <FaFilePdf className="text-lg mr-3" />
                  <span>Verify Report</span>
                </button>
              </li>

              {/* Set Deadline */}
              <li>
                <button
                  onClick={onSetDeadline}
                  className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
                >
                  <FaTasks className="text-lg mr-3" />
                  <span>Set Deadline</span>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;



