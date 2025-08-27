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
import QuizPage from "../Pages/QuizPage";

// Profile Components
import SkillList from "../Components/ProfileComponents/SkillList";
import CertificateList from "../Components/ProfileComponents/CertificateList";
import ProjectList from "../Components/ProfileComponents/ProjectList";
import ExperienceList from "../Components/ProfileComponents/ExperienceList";
import UserPostPage from "../Components/ProfileComponents/UserPostPage";
import LanguageList from "../Components/ProfileComponents/LanguageList";
import EditProfile from "../Components/ProfileComponents/EditProfile";
import Resume from "../Components/ProfileComponents/Resume";
import EducationList from "../Components/ProfileComponents/EducationList";
import ContactList from "../Components/ProfileComponents/ContactList";
import UserArticleList from "../Components/ProfileComponents/UserArticleList";

// Quiz Components
import CalculationPage from "../Components/QuizComponents/CalculationPage";
import ResultPage from "../Components/QuizComponents/ResultPage";

// Article Components
import ArticleFormPage from "../Components/ArticleComponents/ArticleFormPage";
import ArticleListPage from "../Pages/ArticleListPage";
import ArticleDetailPage from "../Components/ArticleComponents/ArticleDetailPage";
import ContactAdmin from "../Pages/ContactAdmin";
import Connections from "../Pages/Connections";

import ChatsPage from "../Pages/ChatPage";
import NewChatPage from "../Components/ChatComponents/NewChatPage";
import Notifications from "../Pages/Notifications";
import JobListPage from "../Pages/JobListPage";
import CareerRecommendations from "../Pages/CareerRecommendations";
import RuteeArticlePage from "../Pages/RuteeArticlePage";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AuthRedirect({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default function AppRouter() {
  const { loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}
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

        {/* ==================== ARTICLE ROUTES ==================== */}
        <Route path="/articles/list" element={<ArticleListPage />} />
        <Route path="/articles/rutee/list" element={<RuteeArticlePage />} />
        {/* ✅ Ubah :article_id → :slug */}
        <Route path="/articles/list/:slug" element={<ArticleDetailPage />} />

        {/* Private Article Routes */}
        <Route
          path="/articles/owned"
          element={
            <PrivateRoute>
              <UserArticleList />
            </PrivateRoute>
          }
        />
        <Route
          path="/articles/new"
          element={
            <PrivateRoute>
              <ArticleFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/articles/edit/:slug"
          element={
            <PrivateRoute>
              <ArticleFormPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />
        <Route
          path="/articles/user/:user_id"
          element={
            <PrivateRoute>
              <UserArticleList />
            </PrivateRoute>
          }
        />

        {/* ==================== PRIVATE ROUTES ==================== */}
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <SearchUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/connections/:userId"
          element={
            <PrivateRoute>
              <Connections />
            </PrivateRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <PrivateRoute>
              <QuizPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/contact-admin"
          element={
            <PrivateRoute>
              <ContactAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/calculate"
          element={
            <PrivateRoute>
              <CalculationPage />
            </PrivateRoute>
          }
        />
        <Route path="/jobs" element={<JobListPage />} />
        <Route
          path="/result"
          element={
            <PrivateRoute>
              <ResultPage />
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
          path="/resume/:user_id"
          element={
            <PrivateRoute>
              <Resume />
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

        {/* ==================== CHAT ROUTES ==================== */}
        <Route
          path="/chats"
          element={
            <PrivateRoute>
              <ChatsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/chats/new"
          element={
            <PrivateRoute>
              <NewChatPage />
            </PrivateRoute>
          }
        />

        {/* ==================== READ-ONLY PROFILE ROUTES ==================== */}
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
          path="/educations/:user_id"
          element={
            <PrivateRoute>
              <EducationList readOnly />
            </PrivateRoute>
          }
        />
        <Route
          path="/careers"
          element={
            <PrivateRoute>
              <CareerRecommendations />
            </PrivateRoute>
          }
        />
        <Route
          path="/contacts/:user_id"
          element={
            <PrivateRoute>
              <ContactList readOnly />
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

        {/* ==================== OWNER EDIT PROFILE ROUTES ==================== */}
        <Route
          path="/edit-skills"
          element={
            <PrivateRoute>
              <SkillList />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-contacts"
          element={
            <PrivateRoute>
              <ContactList />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-projects"
          element={
            <PrivateRoute>
              <ProjectList />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-experiences"
          element={
            <PrivateRoute>
              <ExperienceList />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-languages"
          element={
            <PrivateRoute>
              <LanguageList />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-educations"
          element={
            <PrivateRoute>
              <EducationList />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-certificates"
          element={
            <PrivateRoute>
              <CertificateList />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />

        {/* ==================== CATCH ALL ==================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
