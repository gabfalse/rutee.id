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
import UserPostPage from "../Components/ProfileComponents/UserPostPage";
import LanguageList from "../Components/ProfileComponents/LanguageList";
import EditProfile from "../Components/ProfileComponents/EditProfile";

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
        // Untuk lihat semua skill user lain
        <Route
          path="/skills/:user_id"
          element={
            <PrivateRoute>
              <SkillList readOnly />
            </PrivateRoute>
          }
        />
        <Route
          path="/experiences/:user_id"
          element={
            <PrivateRoute>
              <ExperienceList readOnly />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:user_id"
          element={
            <PrivateRoute>
              <ProjectList readOnly />
            </PrivateRoute>
          }
        />
        <Route
          path="/languages/:user_id"
          element={
            <PrivateRoute>
              <LanguageList readOnly />
            </PrivateRoute>
          }
        />
        <Route
          path="/certificates/:user_id"
          element={
            <PrivateRoute>
              <CertificateList readOnly />
            </PrivateRoute>
          }
        />
        // Untuk edit skill (owner)
        <Route
          path="/edit-skills"
          element={
            <PrivateRoute>
              <SkillList /> {/* tanpa readOnly, jadi owner bisa edit */}
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-projects"
          element={
            <PrivateRoute>
              <ProjectList /> {/* tanpa readOnly, jadi owner bisa edit */}
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-experiences"
          element={
            <PrivateRoute>
              <ExperienceList /> {/* tanpa readOnly, jadi owner bisa edit */}
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-languages"
          element={
            <PrivateRoute>
              <LanguageList /> {/* tanpa readOnly, jadi owner bisa edit */}
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-certificates"
          element={
            <PrivateRoute>
              <CertificateList /> {/* tanpa readOnly, jadi owner bisa edit */}
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <PrivateRoute>
              <EditProfile /> {/* tanpa readOnly, jadi owner bisa edit */}
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
