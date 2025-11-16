// src/pages/OverviewPage/OverviewPage.jsx

import React from 'react';
// <-- THÊM MỚI: Imports cho Sidebar/Header
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiPlus, FiBell 
} from 'react-icons/fi';
import hcmutLogo from '../assets/hcmut.png'; 

// <-- THÊM MỚI: Icons cho trang Courses
import { FiGrid, FiList, FiPlus as FiPlusCourse } from 'react-icons/fi';

// <-- THÊM MỚI: Import CẢ HAI file CSS
// 1. CSS cho layout (sidebar, header)
import './SchedulePage.css'; 
// 2. CSS cho nội dung (các thẻ courses)
import './OverviewPage.css'; 

// <-- THÊM MỚI: Dữ liệu giả cho các khóa học
const mockCourses = [
  {
    tag: 'UI/UX Design',
    title: 'UI/UX Design Level Up with Prototyping',
    date: '16 Jan 2025',
   
    status: 'Unknown'
  },
  {
    tag: 'Graphic Design',
    title: 'Graphic Design Masterclass using Adobe Illustration',
    date: '14 Jan 2025',
   
    status: 'Unknown'
  },
  {
    tag: 'Animation',
    title: 'Fundamental 2D Animation Using Jitter',
    date: '13 Jan 2025',
  
    status: 'Unknown'
  },
];


const OverviewPage = () => {
  return (
    <div className="dashboard-page-container">
      
      {/* 1. THANH BÊN TRÁI (SIDEBAR) - (Giữ nguyên) */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img src={hcmutLogo} alt="Logo" />
          <span>Hệ thống Lịch</span>
        </div>
        <nav className="sidebar-nav">
          {/* Link này sẽ tự động active */}
          <NavLink to="/app/overview" className="nav-link">
            <FiHome />
            <span>Tổng quan</span>
          </NavLink>
          <NavLink to="/app/schedule" className="nav-link">
            <FiCalendar />
            <span>Lịch</span>
          </NavLink>
          <NavLink to="/app/register-schedule" className="nav-link">
            <FiPlusSquare />
            <span>Đăng kí lịch</span>
          </NavLink>
          <NavLink to="/app/settings" className="nav-link">
            <FiSettings />
            <span>Cài đặt</span>
          </NavLink>
        </nav>
      </aside>

      {/* 2. KHU VỰC NỘI DUNG CHÍNH (BÊN PHẢI) */}
      <div className="dashboard-main-content">
        
        {/* 2.1 HEADER (Giữ nguyên) */}
        <header className="dashboard-header">
          {/* <-- SỬA ĐỔI: Đổi tiêu đề --> */}
          <h1 className="header-title">Tổng quan</h1>
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

        {/* 2.2 NỘI DUNG TRANG (Đã thay đổi) */}
        <main className="dashboard-page-content">
          
          {/* <-- THÊM MỚI: Thanh thông báo (Màu hồng) --> */}
          <div className="notification-bar">
            <span>You have <strong>30 days</strong> to join Software Engineer Class <a>Join Now</a></span>
            <button>&times;</button>
          </div>

          {/* <-- THÊM MỚI: Header của trang Courses --> */}
          <div className="overview-header">
            <div className="overview-header-left">
              <h2>Courses</h2>
              <p>Create and manage courses in your school.</p>
            </div>
            <button className="btn-new-course">
              <FiPlusCourse /> New Course
            </button>
          </div>

          {/* <-- THÊM MỚI: Thanh Tabs (Category) --> */}
          <div className="course-navigation">
            <div className="course-tabs">
              <button className="course-tab active">All Category</button>
              <button className="course-tab">UI/UX Design</button>
              <button className="course-tab">Graphic Design</button>
              <button className="course-tab">Animation</button>
              <button className="course-tab">Web Development</button>
            </div>
            <div className="view-toggles">
              <button className="toggle-btn active"><FiGrid /></button>
              <button className="toggle-btn"><FiList /></button>
            </div>
          </div>

          {/* <-- THÊM MỚI: Lưới các khóa học --> */}
          <div className="course-grid">
            {mockCourses.map((course, index) => (
              <div className="course-card" key={index}>
                <div className="card-image-placeholder">
                  {/* (Đây là nơi bạn đặt ảnh illustration) */}
                  <span className="card-tag">{course.tag}</span>
                </div>
                <div className="card-content">
                  <h4 className="card-title">{course.title}</h4>
                  <div className="card-meta">
                    <div>
                      <label>Creation Date</label>
                      <span>{course.date}</span>
                    </div>
                    
                    <div>
                      <label>Status</label>
                      <span className={`status ${course.status === 'Ready' ? 'Not-ready' : 'Unknown'}`}>
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

export default OverviewPage;