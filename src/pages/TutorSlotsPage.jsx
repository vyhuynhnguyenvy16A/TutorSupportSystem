// src/pages/TutorSlotsPage/TutorSlotsPage.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import './TutorSlotsPage.css'; 

import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiPlus, FiBell, 
  FiPlusCircle, FiEdit, FiTrash2 // Icons mới cho quản lý slots
} from 'react-icons/fi';
import dashboardPreview from '../../assets/hcmut.png';

// Dữ liệu giả cho các slots của Giảng viên
const mockTutorSlots = [
  { id: 1, subject: 'Công nghệ phần mềm', date: 'Thứ 2, 25/11/2025', time: '09:00 - 11:00', status: 'Còn trống', registered: 5, max: 20 },
  { id: 2, subject: 'Công nghệ phần mềm', date: 'Thứ 4, 27/11/2025', time: '09:00 - 11:00', status: 'Đã đầy', registered: 20, max: 20 },
  { id: 3, subject: 'Trí tuệ nhân tạo', date: 'Thứ 5, 28/11/2025', time: '13:30 - 15:30', status: 'Còn trống', registered: 10, max: 15 },
  { id: 4, subject: 'Mạng máy tính', date: 'Thứ 6, 29/11/2025', time: '15:30 - 17:30', status: 'Sắp diễn ra', registered: 0, max: 20 },
];

const TutorSlotsPage = () => {
  return (
    <div className="dashboard-page-container">
      
      {/* 1. SIDEBAR (Đã đổi NavLink, active 'Quản lý Slots') */}
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
          <h1 className="header-title">Quản lý Slots</h1>
          <div className="header-search">
            <FiSearch />
            <input type="text" placeholder="Tìm kiếm slots..." />
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

        {/* 2.2 NỘI DUNG TRANG (Bảng quản lý slots) */}
        <main className="dashboard-page-content">
          
          {/* Bỏ .stats-cards */}

          <div className="table-container">
            {/* Bỏ .tabs */}
            
            <div className="table-filters">
              <input type="text" placeholder="Tìm theo môn học..." className="filter-search" />
              {/* Nút "Thêm Slot" thay cho "Export" */}
              <button className="btn-add-slot">
                <FiPlusCircle /> Thêm Slot mới
              </button>
            </div>
            
            <table className="data-table">
              <thead>
                <tr>
                  <th>MÔN HỌC</th>
                  <th>NGÀY</th>
                  <th>THỜI GIAN</th>
                  <th>ĐÃ ĐĂNG KÝ</th>
                  <th>TRẠNG THÁI</th>
                  <th>HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody>
                {mockTutorSlots.map((slot) => (
                  <tr key={slot.id}>
                    <td>{slot.subject}</td>
                    <td>{slot.date}</td>
                    <td>{slot.time}</td>
                    <td>{`${slot.registered} / ${slot.max}`}</td>
                    <td>
                      <span className={`status ${
                        slot.status === 'Còn trống' ? 'status-success' :
                        slot.status === 'Sắp diễn ra' ? 'status-pending' :
                        slot.status === 'Đã đầy' ? 'status-failed' : ''
                      }`}>
                        {slot.status}
                      </span>
                    </td>
                    <td>
                      {/* Thêm các nút hành động */}
                      <div className="action-buttons">
                        <button className="btn-action-edit"><FiEdit /></button>
                        <button className="btn-action-delete"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
        
      </div>
    </div>
  );
};

export default TutorSlotsPage;