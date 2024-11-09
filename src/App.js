import React from "react";
import { useRoutes, useLocation, useNavigate } from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Header from "./components/header/index.jsx";
import Home from "./components/home/index.jsx";
import Sidebar from "./components/sidebar/Sidebar";
import Leaderboard from "./components/home/admin/leaderboard";
import Challenges from "./components/home/admin/challenges";
import Report from "./components/home/admin/report";
import AdminPanel from "./components/home/admin/AdminPanel";
import BaselineParametersForm from "./components/home/admin/BaselineParametersForm";
import AdminForm from "./components/home/admin/AdminForm";
import HeadquarterDashboard from "./components/home/admin/HeadquarterDashboard";
import CreatePO from "./components/home/admin/CreatePO";
import ListPO from "./components/home/admin/ListPO";
import { AuthProvider, useAuth } from "./contexts/authContext";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

// Define routes
const routesArray = [
  { path: "*", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/home", element: <Home /> },
  { path: "/admin/leaderboard", element: <Leaderboard /> },
  { path: "/admin/challenges", element: <Challenges /> },
  { path: "/admin/inputdata", element: <AdminPanel /> },
  { path: "/admin/baseline", element: <BaselineParametersForm /> },
  { path: "/admin/profile", element: <AdminForm /> }, // Profile page route
  { path: "/admin/report", element: <Report /> },
  { path: "/admin/headquarterdashboard", element: <HeadquarterDashboard /> },
  { path: "/admin/createpo", element: <CreatePO /> },
  { path: "/admin/listpo", element: <ListPO /> },
];


  let routesElement = useRoutes(routesArray);

  // Conditionally render the Header and Sidebar
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="admin-panel flex">
      {/* Render Header unless on login or register pages */}
      {!isAuthPage && <Header />}

      {/* Show Sidebar if user is logged in and not on login/register pages */}
      {userLoggedIn && !isAuthPage && (
        <Sidebar
          onLeaderboardClick={() => navigate("/admin/leaderboard")}
          onChallengesClick={() => navigate("/admin/challenges")}
          onInputDataClick={() => navigate("/admin/inputdata")}
          onBaselineClick={() => navigate("/admin/baseline")}
          onProfileClick={() => navigate("/admin/profile")}
          onReportClick={() => navigate("/admin/report")}
          onHeadquarterDashboard={() => navigate("/admin/headquarterdashboard")}
          onCreatePO={() => navigate("/admin/createpo")}
          onListPO={() => navigate("/admin/listpo")}
        />
      )}

      {/* Main content area with dynamic margin-top based on route */}
      <div
        className={`content flex-grow p-4 ${
          isAuthPage ? "mt-0" : "mt-16"
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
