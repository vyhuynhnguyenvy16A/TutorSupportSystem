// src/pages/TutorOverviewPage/TutorOverviewPage.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiPlus, FiBell, FiGrid, FiList, FiPlus as FiPlusCourse
} from 'react-icons/fi';
import hcmutLogo from '../../assets/hcmut.png'; 


import './TutorOverviewPage.css'; 

// Dữ liệu giả cho các khóa học của Giảng viên
const mockTutorCourses = [
  {
    tag: 'UI/UX Design',
    title: 'Lớp UI/UX Design K15 (Sáng T3)',
    date: '16 Jan 2025',
    status: 'Đang diễn ra'
  },
  {
    tag: 'Graphic Design',
    title: 'Lớp Graphic Design Masterclass (Tối T4)',
    date: '14 Jan 2025',
    status: 'Đang diễn ra'
  },
  {
    tag: 'Animation',
    title: 'Lớp 2D Animation cơ bản (Sáng T5)',
    date: '13 Jan 2025',
    status: 'Đã kết thúc'
  },
];


const TutorOverviewPage = () => {
  return (
    <div className="dashboard-page-container">
      
      {/* 1. SIDEBAR (Đã đổi NavLink) */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img src={hcmutLogo} alt="Logo" />
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
          <h1 className="header-title">Tổng quan (Giảng viên)</h1>
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
          
          <div className="notification-bar">
            <span>Bạn có <strong>3 lịch</strong> chờ xác nhận trong tuần này. <a>Xem ngay</a></span>
            <button>&times;</button>
          </div>

          <div className="overview-header">
            <div className="overview-header-left">
              <h2>Các lớp bạn đang dạy</h2>
              <p>Quản lý các lớp học và sinh viên.</p>
            </div>
            <button className="btn-new-course">
              <FiPlusCourse /> Tạo lớp mới
            </button>
          </div>

          <div className="course-navigation">
            <div className="course-tabs">
              <button className="course-tab active">Tất cả</button>
              <button className="course-tab">UI/UX Design</button>
              <button className="course-tab">Graphic Design</button>
              <button className="course-tab">Animation</button>
            </div>
            <div className="view-toggles">
              <button className="toggle-btn active"><FiGrid /></button>
              <button className="toggle-btn"><FiList /></button>
            </div>
          </div>

          {/* Lưới các khóa học */}
          <div className="course-grid">
            {mockTutorCourses.map((course, index) => (
              <div className="course-card" key={index}>
                <div className="card-image-placeholder">
                  <span className="card-tag">{course.tag}</span>
                </div>
                <div className="card-content">
                  <h4 className="card-title">{course.title}</h4>
                  <div className="card-meta">
                    <div>
                      <label>Ngày tạo</label>
                      <span>{course.date}</span>
                    </div>
                    <div>
                      <label>Trạng thái</label>
                      {/* Sử dụng các lớp status chung từ SchedulePage.css
                        status-success (xanh lá), status-pending (vàng), status-failed (đỏ) 
                      */}
                      <span className={`status ${
                        course.status === 'Đang diễn ra' ? 'status-success' : 'status-pending'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default TutorOverviewPage;