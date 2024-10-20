import React from "react";
import { useRoutes, useLocation, useNavigate } from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Header from "./components/header/index.jsx";
import Home from "./components/home/index.jsx";
import Sidebar from "./components/sidebar/Sidebar";
import Leaderboard from "./components/home/admin/leaderboard";
import Challenges from "./components/home/admin/challenges"; // Ensure correct import path
import Report from "./components/home/admin/report"; // Import the Report component
import AdminPanel from "./components/home/admin/AdminPanel"; // Import AdminPanel
import BaselineParametersForm from "./components/home/admin/BaselineParametersForm"; // Import Baseline component
import AdminForm from "./components/home/admin/AdminForm"; // Import AdminForm


import { AuthProvider, useAuth } from "./contexts/authContext";

function App() {
  const location = useLocation();
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();

  const routesArray = [
    { path: "*", element: <Login /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/home", element: <Home /> },
    { path: "/admin/leaderboard", element: <Leaderboard /> },
    { path: "/admin/challenges", element: <Challenges /> },
    { path: "/admin/inputdata", element: <AdminPanel /> },
    { path: "/admin/baseline", element: <BaselineParametersForm /> }, // Add route for Baseline
    { path: "/admin/profile", element: <AdminForm /> }, // Add route for AdminForm
    {path: "/admin/report",element:<Report/>}
  ];

  let routesElement = useRoutes(routesArray);

  return (
    <div className="admin-panel flex">
      {/* Render Header unless on login or register pages */}
      {!["/login", "/register"].includes(location.pathname) && <Header />}

      {/* Show Sidebar if user is logged in and not on login/register pages */}
      {userLoggedIn && !["/login", "/register"].includes(location.pathname) && (
        <Sidebar
          onLeaderboardClick={() => navigate("/admin/leaderboard")}
          onChallengesClick={() => navigate("/admin/challenges")}
          onInputDataClick={() => navigate("/admin/inputdata")}
          onBaselineClick={() => navigate("/admin/baseline")} 
          onProfileClick={() => navigate("/admin/profile")} 
          onReportClick={()=>navigate('/admin/report')}
        />
      )}

      {/* Main content area */}
      <div
        className={`content flex-grow p-4 ${
          ["/login", "/register"].includes(location.pathname) ? "mt-0" : "mt-16"
        }`}
      >
        {routesElement}
      </div>
    </div>
  );
}

const AppWrapper = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default AppWrapper;