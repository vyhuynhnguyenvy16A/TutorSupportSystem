// src/routes/index.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Thêm Navigate
import RegisterPage from '../pages/RegisterPage/RegisterPage.jsx';
import HomePage from '../pages/user_homepage/HomePage.jsx';
import LoginPage from '../pages/Login/LoginPage.jsx';

// Student & Tutor Pages import (giữ nguyên các import cũ của bạn)...
import SettingsPage from '../pages/student/SettingsPage.jsx';
import OverviewPage from '../pages/student/OverviewPage.jsx';
import TutorOverviewPage from '../pages/tutor/TutorOverviewPage.jsx';
import TutorSchedulePage from '../pages/tutor/TutorSchedulePage.jsx';
import TutorSlotsPage from '../pages/tutor/TutorSlotsPage.jsx';
import TutorSettingsPage from '../pages/tutor/TutorSettingsPage.jsx';
import CalendarPage from '../pages/student/CalendarPage.jsx';
import ProtectedRoute from './protectedRoute.jsx';

// --- IMPORT ADMIN PAGES MỚI ---
import AdminBatchesPage from '../pages/admin/AdminBatchesPage.jsx';
import AdminPairingsPage from '../pages/admin/AdminPairingsPage.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* STUDENT ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
        <Route path="/app/overview" element={<OverviewPage />} />
        <Route path="/app/schedule" element={<CalendarPage />} />
        <Route path="/app/settings" element={<SettingsPage />} />
      </Route>

      {/* TUTOR ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={["TUTOR"]} />}>
        <Route path="/app/tutor/overview" element={<TutorOverviewPage />} />
        <Route path="/app/tutor/schedule" element={<TutorSchedulePage />} />
        <Route path="/app/tutor/slots" element={<TutorSlotsPage />} />
        <Route path="/app/tutor/settings" element={<TutorSettingsPage />} />
      </Route>

      {/* --- ADMIN ROUTES --- */}
      {/* Giả sử role của admin trong DB là "ADMIN" hoặc "SUPER_ADMIN" */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<Navigate to="/admin/batches" replace />} />
        
        <Route path="/admin/batches" element={<AdminBatchesPage />} />
        <Route path="/admin/pairings" element={<AdminPairingsPage />} />
      </Route>

    </Routes>
  );
};

export default AppRoutes;