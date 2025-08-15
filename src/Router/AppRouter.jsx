// src/Router/AppRouter.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

// Pages
import HomePage from "../Pages/HomePage";
import ProfilePage from "../Pages/ProfilePage";
import InfoWebPage from "../Pages/InfoWebPage";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import SearchUser from "../Pages/SearchUser";
import CompanyPage from "../Pages/CompanyPage";

// List Pages
import SkillList from "../Components/ProfileComponents/SkillList";
import CertificateList from "../Components/ProfileComponents/CertificateList";
import ProjectList from "../Components/ProfileComponents/ProjectList";
import ExperienceList from "../Components/ProfileComponents/ExperienceList";

// Edit Pages
import EditProfilePage from "../Components/EditComponents/EditProfile";
import EditSkillPage from "../Components/EditComponents/EditSkillPage";
import EditCertificatePage from "../Components/EditComponents/EditCertificatePage";
import EditProjectPage from "../Components/EditComponents/EditProjectPage";
import EditExperiencePage from "../Components/EditComponents/EditExperiencePage";
import EditCompanyPage from "../Components/EditComponents/EditCompanyPage";
import UserPostPage from "../Components/ProfileComponents/UserPostPage";
import LanguageList from "../Components/ProfileComponents/LanguageList";
import EditLanguagePage from "../Components/EditComponents/EditLanguagePage";
import EditContactPage from "../Components/EditComponents/EditContactPage";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/webinfo" element={<InfoWebPage />} />
        <Route
          path="/login"
          element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRedirect>
              <Register />
            </AuthRedirect>
          }
        />

        {/* Private Routes */}
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <SearchUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:user_id"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:user_id"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-post"
          element={
            <PrivateRoute>
              <UserPostPage />
            </PrivateRoute>
          }
        />

        {/* Edit Pages */}
        <Route
          path="/profile/edit"
          element={
            <PrivateRoute>
              <EditProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/languages/edit"
          element={
            <PrivateRoute>
              <EditLanguagePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/contacts/edit"
          element={
            <PrivateRoute>
              <EditContactPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/Experiences/edit"
          element={
            <PrivateRoute>
              <EditExperiencePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/skills/edit"
          element={
            <PrivateRoute>
              <EditSkillPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/edit"
          element={
            <PrivateRoute>
              <EditProjectPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/company/edit"
          element={
            <PrivateRoute>
              <EditCompanyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/certificates/edit"
          element={
            <PrivateRoute>
              <EditCertificatePage />
            </PrivateRoute>
          }
        />

        {/* Catch-all 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function AuthRedirect({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}
