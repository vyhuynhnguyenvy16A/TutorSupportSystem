// src/routes/index.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage/RegisterPage.jsx';
// Đảm bảo các đường dẫn import này là CHÍNH XÁC
import HomePage from '../pages/user_homepage/HomePage.jsx';
import LoginPage from '../pages/Login/LoginPage.jsx';
import ForgotPasswordPage from '../pages/ForgotPassword.jsx';
import SchedulePage from '../pages/SchedulePage.jsx';
// (Import các trang khác nếu có, ví dụ: RegisterPage)
import SettingsPage from '../pages/SettingsPage.jsx';
import OverviewPage from '../pages/OverviewPage.jsx';

import TutorOverviewPage from '../pages/tutor/TutorOverviewPage.jsx';
import TutorSchedulePage from '../pages/tutor/TutorSchedulePage.jsx';
import TutorSlotsPage from '../pages/tutor/TutorSlotsPage.jsx';
import TutorSettingsPage from '../pages/tutor/TutorSettingsPage.jsx';
const AppRoutes = () => {
  return (
    <Routes>
      {/* ĐÂY LÀ GIAO DIỆN CHÍNH
        URL: http://localhost:5173/ 
      */}
      <Route path="/" element={<HomePage />} />

      {/* ĐÂY LÀ TRANG ĐĂNG NHẬP
        URL: http://localhost:5173/login 
      */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      {/* (Lưu ý: chúng ta dùng /app/schedule để khớp với NavLink) */}
      <Route path="/app/schedule" element={<SchedulePage />} />

      {/* <-- THÊM MỚI: Thêm các route khác cho sidebar --> */}
      <Route path="/app/overview" element={<OverviewPage />} />
      <Route path="/app/register-schedule" element={<div>Trang Đăng Kí Lịch</div>} />
      <Route path="/app/settings" element={<SettingsPage />} />
      {/* (Thêm các route cho trang khác ở đây) */}
      {/* <Route path="/register" element={<RegisterPage />} /> */}

      {/* 4 ROUTES CHO TUTOR (GIẢNG VIÊN) VÀO ĐÂY --> */}
      <Route path="/app/tutor/overview" element={<TutorOverviewPage />} />
      <Route path="/app/tutor/schedule" element={<TutorSchedulePage />} />
      <Route path="/app/tutor/slots" element={<TutorSlotsPage />} />
      <Route path="/app/tutor/settings" element={<TutorSettingsPage />} />
    </Routes>
  );
};

export default AppRoutes;
