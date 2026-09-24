// src/routes/AppRouter.jsx
//
// Implements the flow in doc section 13:
// unauthenticated -> login/register
// authenticated + onboarding incomplete -> onboarding
// authenticated + onboarding complete -> home

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import OnboardingPage from "../pages/OnboardingPage";
import HomePage from "../pages/HomePage";
import TimetablePage from "../pages/TimetablePage";
import AcademicCalendarPage from "../pages/AcademicCalendarPage";
import AttendancePage from "../pages/AttendancePage";

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function RequireOnboarding({ children }) {
  const { onboardingComplete, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return onboardingComplete ? children : <Navigate to="/onboarding" replace />;
}

function RootRedirect() {
  const { isAuthenticated, onboardingComplete, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={onboardingComplete ? "/home" : "/onboarding"} replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/onboarding"
          element={
            <RequireAuth>
              <OnboardingPage />
            </RequireAuth>
          }
        />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <RequireOnboarding>
                <HomePage />
              </RequireOnboarding>
            </RequireAuth>
          }
        />
        <Route path="/timetable" element={<RequireAuth><RequireOnboarding><TimetablePage /></RequireOnboarding></RequireAuth>} />
        <Route path="/calendar" element={<RequireAuth><RequireOnboarding><AcademicCalendarPage /></RequireOnboarding></RequireAuth>} />
        <Route path="/attendance" element={<RequireAuth><RequireOnboarding><AttendancePage /></RequireOnboarding></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}
