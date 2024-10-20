import React, { useState } from "react";
import { useRoutes, useLocation, useNavigate } from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Header from "./components/header/index.jsx";
import Home from "./components/home/index.jsx";
import InputDataForm from "./components/home/admin/InputDataForm";
import Sidebar from "./components/sidebar/Sidebar";
import Leaderboard from "./components/home/admin/leaderboard";
import Challenges from "./components/home/admin/challenges"; // Ensure correct import path
import Report from "./components/home/admin/report"; // Import the Report component
import { AuthProvider, useAuth } from "./contexts/authContext";

function App() {
  const location = useLocation();
  const { userLoggedIn } = useAuth();
  const [showInputForm, setShowInputForm] = useState(false);
  const navigate = useNavigate();

  const routesArray = [
    { path: "*", element: <Login /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/home", element: <Home /> },
    { path: "/admin/leaderboard", element: <Leaderboard /> },
    { path: "/admin/challenges", element: <Challenges /> },
    { path: "/admin/reports", element: <Report /> } // Add the Report route
  ];

  let routesElement = useRoutes(routesArray);

  return (
    <div className="admin-panel flex">
      {!["/login", "/register"].includes(location.pathname) && <Header />}
      {userLoggedIn && !["/login", "/register"].includes(location.pathname) && (
        <Sidebar
          onInputDataClick={() => setShowInputForm(true)}
          onLeaderboardClick={() => navigate("/admin/leaderboard")}
          onChallengesClick={() => navigate("/admin/challenges")}
          onReportClick={() => navigate("/admin/reports")} // Add onReportClick handler
        />
      )}
      <div
        className={`content flex-grow p-4 ${
          ["/login", "/register"].includes(location.pathname) ? "mt-0" : "mt-16"
        }`}
      >
        {routesElement}
        {showInputForm && <InputDataForm />}
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