import React, { useState } from "react";
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
import HeadquarterDashboard from "./components/home/admin/HeadquarterDashboard.js";
import CreatePO from "./components/home/admin/CreatePO.js";
import ResourceUsageForm from "./components/home/admin/ResourceUsageForm.js";
import ListPO from "./components/home/admin/ListPO";
import PostOfficeReport from "./components/home/admin/PostOfficeReport"; // Import the new file
import { AuthProvider, useAuth } from "./contexts/authContext";
import CumulativeExpenditure from "./components/home/admin/CumulativeExpenditure.js";
import VerifyReport from "./components/home/admin/verifyReport";
import Baselinenew from "./components/home/admin/Baselinenew.js";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const routesArray = [
    { path: "*", element: <Login /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/home", element: <Home /> },
    { path: "/admin/leaderboard", element: <Leaderboard /> },
    { path: "/admin/challenges", element: <Challenges /> },
    { path: "/admin/inputdata", element: <AdminPanel /> },
    { path: "/admin/baseline", element: <BaselineParametersForm /> },
    { path: "/admin/profile", element: <AdminForm /> },
    { path: "/admin/report", element: <Report /> },
    { path: "/admin/headquarterdashboard", element: <HeadquarterDashboard /> },
    { path: "/admin/createpo", element: <CreatePO /> },
    { path: "/admin/ResourceUsageForm", element: <ResourceUsageForm setFormData={setFormData} /> },
    { path: "/admin/CumulativeExpenditure", element: <CumulativeExpenditure formData={formData} /> },
    { path: "/admin/listpo", element: <ListPO /> },
    { path: "/admin/VerifyReport", element: <VerifyReport /> },
    { path: "/admin/baselinenew", element: <Baselinenew /> },
    { path: "/admin/postofficereport", element: <PostOfficeReport /> }, // Add the route for PostOfficeReport
  ];

  const { userLoggedIn } = useAuth();
  let routesElement = useRoutes(routesArray);

  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="admin-panel flex">
      {!isAuthPage && <Header />}
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
          onVerifyReport={() => navigate("/admin/verifyreport")}
          onPostOfficeReport={() => navigate("/admin/postofficereport")} // Add this callback for navigation
        />
      )}
      <div className={`content flex-grow p-4 ${isAuthPage ? "mt-0" : "mt-16"}`}>
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
