// src/pages/TutorSettingsPage/TutorSettingsPage.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import './TutorSettingsPage.css';
import dashboardPreview from '../../assets/hcmut.png'; 
import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiPlus, FiBell
} from 'react-icons/fi';

const TutorSettingsPage = () => {
  // Dữ liệu giả cho hồ sơ Giảng viên
  const tutorProfile = {
    photo: dashboardPreview,
    name: 'Jane Doe',
    age: 35,
    msgv: 'GV10293', // Mã số giảng viên
    cccd: '012345678910',
    dob: '10 March 1990',
    gender: 'Female',
    mobile: '+84 909123456',
    email: 'jane.doe@hcmut.edu.vn',
    nationality: 'Vietnamese',
    address: '123, Đường ABC, Phường XYZ, Quận 1, TP.HCM',
    city: 'Hồ Chí Minh',
    pincode: '700000',
  };

  return (
    <div className="dashboard-page-container">
      
      {/* 1. SIDEBAR (Đã đổi NavLink, active 'Cài đặt') */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img src={dashboardPreview} alt="Logo" />
          <span>Hệ thống Lịch</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/app/tutor/overview" className="nav-link">
            <FiHome />
            <span>Tổng quan</span>
          </NavLink>
          <NavLink to="/app/tutor/schedule" className="nav-link">
            <FiCalendar />
            <span>Lịch dạy</span>
          </NavLink>
          <NavLink to="/app/tutor/slots" className="nav-link">
            <FiPlusSquare />
            <span>Quản lý Slots</span>
          </NavLink>
          <NavLink to="/app/tutor/settings" className="nav-link">
            <FiSettings />
            <span>Cài đặt</span>
          </NavLink>
        </nav>
      </aside>

      {/* 2. KHU VỰC NỘI DUNG CHÍNH (BÊN PHẢI) */}
      <div className="dashboard-main-content">
        
        {/* 2.1 HEADER (Đã đổi tiêu đề) */}
        <header className="dashboard-header">
          <h1 className="header-title">Hồ Sơ Giảng viên</h1>
          
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
                <span>Jane Doe (GV)</span>
                <small>Lecturer</small>
              </div>
            </div>
          </div>
        </header>

        {/* 2.2 NỘI DUNG TRANG */}
        <main className="dashboard-page-content">
          
          {/* Nội dung trang Cài đặt (dùng layout của SettingsPage.css) */}
          <div className="settings-content-grid">
            
            {/* CỘT BÊN TRÁI (Thông tin cá nhân) */}
            <div className="profile-details-column">
              <div className="profile-section">
                <h3 className="section-title">Personal Details</h3>
                <div className="avatar-section">
                  <span>Photo:</span>
                  <img src={tutorProfile.photo} alt="Tutor Avatar" />
                </div>
                <div className="form-field-row">
                  <label>Name:</label>
                  <div className="field-value">{tutorProfile.name}</div>
                </div>
                <div className="form-field-row">
                  <label>MSGV (Mã số giảng viên):</label>
                  <div className="field-value">{tutorProfile.msgv}</div>
                </div>
                <div className="form-field-row">
                  <label>CCCD (Căn cước công dân):</label>
                  <div className="field-value">{tutorProfile.cccd}</div>
                </div>
                <div className="form-field-row">
                  <label>Age:</label>
                  <div className="field-value">{tutorProfile.age}</div>
                </div>
                <div className="form-field-row">
                  <label>Date of Birth:</label>
                  <div className="field-value">{tutorProfile.dob}</div>
                </div>
                <div className="form-field-row">
                  <label>Gender:</label>
                  <div className="field-value">{tutorProfile.gender}</div>
                </div>
              </div>
              <div className="profile-section">
                <h3 className="section-title">Contact Details</h3>
                <div className="form-field-row">
                  <label>Mobile Number:</label>
                  <div className="field-value">{tutorProfile.mobile}</div>
                </div>
                <div className="form-field-row">
                  <label>Email Address:</label>
                  <div className="field-value">{tutorProfile.email}</div>
                </div>
                <div className="form-field-row">
                  <label>Nationality:</label>
                  <div className="field-value">{tutorProfile.nationality}</div>
                </div>
                <div className="form-field-row-full">
                  <label>Permanent Address:</label>
                  <div className="field-value">{tutorProfile.address}</div>
                </div>
                <div className="form-field-row">
                  <label>City:</label>
                  <div className="field-value">{tutorProfile.city}</div>
                </div>
                <div className="form-field-row">
                  <label>Pincode:</label>
                  <div className="field-value">{tutorProfile.pincode}</div>
                </div>
              </div>
            </div>

            {/* CỘT BÊN PHẢI (Trống, giống file gốc) */}
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default TutorSettingsPage;