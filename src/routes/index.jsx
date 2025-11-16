// src/routes/index.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage/RegisterPage.jsx';
// Đảm bảo các đường dẫn import này là CHÍNH XÁC
import HomePage from '../pages/user_homepage/HomePage.jsx';
import LoginPage from '../pages/Login/LoginPage.jsx';

// (Import các trang khác nếu có, ví dụ: RegisterPage)

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
      {/* (Thêm các route cho trang khác ở đây) */}
      {/* <Route path="/register" element={<RegisterPage />} /> */}
    </Routes>
  );
};

export default AppRoutes;