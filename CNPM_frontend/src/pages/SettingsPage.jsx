// src/pages/SettingsPage/SettingsPage.jsx

import React from 'react';
// <-- THÊM MỚI: File CSS riêng cho trang Cài đặt
import './SettingsPage.css'; 
import { NavLink } from 'react-router-dom';
// <-- THÊM MỚI: Dùng avatar mẫu, bạn có thể thay bằng logo hcmut
import dashboardPreview from '../assets/hcmut.png'; 
// <-- THÊM MỚI: Icon cho cảnh báo

import './SchedulePage.css'; 
import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiPlus, FiBell, FiAlertOctagon
} from 'react-icons/fi';
const SettingsPage = () => {
  // Dữ liệu giả cho hồ sơ sinh viên (bạn sẽ thay bằng API sau)
  const studentProfile = {
    photo: dashboardPreview,
    name: 'Gorde Omkar',
    age: 22,
    mssv: '2311044',
    cccd: '046205009192',
    dob: '1 January 2022',
    gender: 'Male',
    mobile: '+91 9876543210',
    email: 'omkargorde1005@gmail.com',
    nationality: 'Indian',
    address: '254, Nurshina Co. Society, L.B.S. marg, Bhandup...',
    city: 'Mumbai',
    pincode: '400078',
  };

 

  return (
    <div className="dashboard-page-container">
      
      {/* 1. THANH BÊN TRÁI (SIDEBAR) */}
      <aside className="dashboard-sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <img src={dashboardPreview} alt="Logo" />
          <span>Hệ thống Lịch</span>
        </div>

        {/* 4 mục điều hướng */}
        <nav className="sidebar-nav">
          <NavLink to="/app/overview" className="nav-link">
            <FiHome />
            <span>Tổng quan</span>
          </NavLink>
         
          <NavLink to="/app/schedule" className="nav-link">
            <FiPlusSquare />
            <span>lịch</span>
          </NavLink>
          {/* Link này sẽ tự động active vì URL là /app/settings */}
          <NavLink to="/app/settings" className="nav-link">
            <FiSettings />
            <span>Cài đặt</span>
          </NavLink>
        </nav>
      </aside>

      {/* 2. KHU VỰC NỘI DUNG CHÍNH (BÊN PHẢI) */}
      <div className="dashboard-main-content">
        
        {/* 2.1 HEADER (Thanh ngang trên cùng) */}
        <header className="dashboard-header">
          {/* <-- SỬA ĐỔI: Đổi tiêu đề cho trang Cài đặt --> */}
          <h1 className="header-title">Hồ Sơ & Cài Đặt</h1>
          
          <div className="header-search">
            <FiSearch />
            <input type="text" placeholder="Tìm kiếm..." />
          </div>
          <div className="header-actions">
            <button className="btn-icon btn-plus"><FiPlus /></button>
            <button className="btn-icon"><FiBell /></button>
            <div className="user-profile">
              <img src="https://via.placeholder.com/40" alt="Avatar" />
              <div className="user-info">
                <span>Darrell Steward</span>
                <small>Super Admin</small>
              </div>
            </div>
          </div>
        </header>

        {/* 2.2 NỘI DUNG TRANG */}
        <main className="dashboard-page-content">
          
          {/* <-- SỬA ĐỔI: Đây là nội dung trang Cài đặt (cũ) của bạn --> */}
          <div className="settings-content-grid">
            
            {/* CỘT BÊN TRÁI (Thông tin cá nhân) */}
            <div className="profile-details-column">
              <div className="profile-section">
                <h3 className="section-title">Personal Details</h3>
                <div className="avatar-section">
                  <span>Photo:</span>
                  <img src={studentProfile.photo} alt="Student Avatar" />
                </div>
                <div className="form-field-row">
                  <label>Name:</label>
                  <div className="field-value">{studentProfile.name}</div>
                </div>
                <div className="form-field-row">
                  <label>MSSV (Mã số sinh viên):</label>
                  <div className="field-value">{studentProfile.mssv}</div>
                </div>
                <div className="form-field-row">
                  <label>CCCD (Căn cước công dân):</label>
                  <div className="field-value">{studentProfile.cccd}</div>
                </div>
                <div className="form-field-row">
                  <label>Age:</label>
                  <div className="field-value">{studentProfile.age}</div>
                </div>
                <div className="form-field-row">
                  <label>Date of Birth:</label>
                  <div className="field-value">{studentProfile.dob}</div>
                </div>
                <div className="form-field-row">
                  <label>Gender:</label>
                  <div className="field-value">{studentProfile.gender}</div>
                </div>
              </div>
              <div className="profile-section">
                <h3 className="section-title">Contact Details</h3>
                <div className="form-field-row">
                  <label>Mobile Number:</label>
                  <div className="field-value">{studentProfile.mobile}</div>
                </div>
                <div className="form-field-row">
                  <label>Email Address:</label>
                  <div className="field-value">{studentProfile.email}</div>
                </div>
                <div className="form-field-row">
                  <label>Nationality:</label>
                  <div className="field-value">{studentProfile.nationality}</div>
                </div>
                <div className="form-field-row-full">
                  <label>Permanent Address:</label>
                  <div className="field-value">{studentProfile.address}</div>
                </div>
                <div className="form-field-row">
                  <label>City:</label>
                  <div className="field-value">{studentProfile.city}</div>
                </div>
                <div className="form-field-row">
                  <label>Pincode:</label>
                  <div className="field-value">{studentProfile.pincode}</div>
                </div>
              </div>
            </div>

            {/* CỘT BÊN PHẢI (Trạng thái học phí) */}
            
          </div>
          {/* <-- Kết thúc nội dung trang Cài đặt --> */}

        </main>
      </div>
    </div>
  );
};

export default SettingsPage;