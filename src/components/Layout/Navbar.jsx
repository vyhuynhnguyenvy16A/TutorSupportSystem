// src/components/Navbar/Navbar.jsx

import React from 'react';
import './Navbar.css'; // File CSS riêng cho Navbar
// Hoặc dùng CSS Modules: import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';
import dashboardPreview from '../../assets/hcmut.png';
const Navbar = () => {
  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <a href="/" className="navbar-logo">
          {/* Thay thế chữ "Obliq" bằng thẻ <img> */}
          <img src={dashboardPreview} alt="HCMUT Logo" className="navbar-logo-img" />
        </a>
        <nav className="navbar-links">
          {/* ... các link khác */}
          <a href="/course">Về chúng tôi</a>
          <a href="/solutions">Lĩnh vực</a>
          <a href="/resources">Nhận xét</a>
         
        </nav>
      </div>
      <div className="navbar-right">
        {/* <-- SỬA ĐỔI: Thay <button> bằng <Link> và thêm prop 'to' */}
        <Link to="/register" className="btn btn-secondary">
          Đăng ký
        </Link>
        {/* <-- SỬA ĐỔI: Thay <button> bằng <Link> và thêm prop 'to' */}
        <Link to="/login" className="btn btn-primary">
          Đăng nhập
        </Link>
      </div>
    </header>
  );
};

export default Navbar;