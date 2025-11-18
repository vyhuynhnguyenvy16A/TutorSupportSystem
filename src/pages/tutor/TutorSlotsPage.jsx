import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './TutorSlotsPage.css'; 
// Tái sử dụng CSS modal từ Overview để tránh trùng lặp code hoặc import file chung
import './TutorOverviewPage.css'; 

import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiPlus, FiBell, 
  FiPlusCircle, FiEdit, FiTrash2, FiX 
} from 'react-icons/fi';
import dashboardPreview from '../../assets/hcmut.png';

// Mock Data ban đầu
const initialSlots = [
  { id: 1, subject: 'Công nghệ phần mềm', date: '2025-11-25', start: '09:00', end: '11:00', type: 'Offline', status: 'Còn trống', registered: 5, max: 20 },
  { id: 2, subject: 'Trí tuệ nhân tạo', date: '2025-11-28', start: '13:30', end: '15:30', type: 'Online', status: 'Còn trống', registered: 10, max: 15 },
];

const TutorSlotsPage = () => {
  const [slots, setSlots] = useState(initialSlots);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // State form
  const [formData, setFormData] = useState({
    id: null,
    subject: '',
    date: '',
    start: '',
    end: '',
    type: 'Online',
    max: 20,
    note: ''
  });

  // Mở modal tạo mới
  const handleOpenCreate = () => {
    setIsEditMode(false);
    setFormData({ id: null, subject: '', date: '', start: '', end: '', type: 'Online', max: 20, note: '' });
    setIsModalOpen(true);
  };

  // Mở modal edit
  const handleOpenEdit = (slot) => {
    setIsEditMode(true);
    setFormData({ ...slot, note: '' }); // Mock note nếu chưa có
    setIsModalOpen(true);
  };

  // Lưu (Tạo hoặc Cập nhật)
  const handleSave = () => {
    if (isEditMode) {
      // Update
      setSlots(slots.map(s => s.id === formData.id ? { ...formData, registered: s.registered, status: s.status } : s));
    } else {
      // Create
      const newSlot = {
        ...formData,
        id: Date.now(),
        status: 'Còn trống',
        registered: 0
      };
      setSlots([...slots, newSlot]);
    }
    setIsModalOpen(false);
  };

  // Xóa slot
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa slot này?")) {
      setSlots(slots.filter(s => s.id !== id));
    }
  };

  return (
    <div className="dashboard-page-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img src={dashboardPreview} alt="Logo" />
          <span>Hệ thống Lịch</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/app/tutor/overview" className="nav-link"><FiHome /><span>Tổng quan</span></NavLink>
          <NavLink to="/app/tutor/schedule" className="nav-link"><FiCalendar /><span>Lịch dạy</span></NavLink>
          <NavLink to="/app/tutor/slots" className="nav-link"><FiPlusSquare /><span>Quản lý Slots</span></NavLink>
          <NavLink to="/app/tutor/settings" className="nav-link"><FiSettings /><span>Cài đặt</span></NavLink>
        </nav>
      </aside>

      <div className="dashboard-main-content">
        <header className="dashboard-header">
          <h1 className="header-title">Quản lý Slots</h1>
          <div className="header-search"><FiSearch /><input type="text" placeholder="Tìm kiếm slots..." /></div>
          <div className="header-actions">
            <button className="btn-icon btn-plus"><FiPlus /></button>
            <div className="user-profile"><img src="https://via.placeholder.com/40" alt="Avatar" /><span>Jane Doe (GV)</span></div>
          </div>
        </header>

        <main className="dashboard-page-content">
          <div className="table-container">
            <div className="table-filters">
              <input type="text" placeholder="Tìm theo môn học..." className="filter-search" />
              <button className="btn-add-slot" onClick={handleOpenCreate}>
                <FiPlusCircle /> Thêm Slot mới
              </button>
            </div>
            
            <table className="data-table">
              <thead>
                <tr>
                  <th>MÔN HỌC</th>
                  <th>NGÀY - GIỜ</th>
                  <th>HÌNH THỨC</th>
                  <th>ĐĂNG KÝ</th>
                  <th>TRẠNG THÁI</th>
                  <th>HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.id}>
                    <td>{slot.subject}</td>
                    <td>
                      <div>{slot.date}</div>
                      <small style={{color:'#6b7280'}}>{slot.start} - {slot.end}</small>
                    </td>
                    <td>{slot.type}</td>
                    <td>{`${slot.registered} / ${slot.max}`}</td>
                    <td>
                      <span className={`status ${slot.status === 'Còn trống' ? 'status-success' : 'status-failed'}`}>
                        {slot.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action-edit" onClick={() => handleOpenEdit(slot)}><FiEdit /></button>
                        <button className="btn-action-delete" onClick={() => handleDelete(slot.id)}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {/* MODAL FORM */}
        {isModalOpen && (
          <div className="tutor-modal-overlay">
            <div className="tutor-modal">
              <div className="tutor-modal-header">
                <h3>{isEditMode ? 'Chỉnh sửa Slot' : 'Tạo Slot mới'}</h3>
                <button onClick={() => setIsModalOpen(false)}><FiX /></button>
              </div>
              <div className="tutor-modal-body">
                <div className="tutor-form-group">
                  <label>Môn học</label>
                  <input type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                </div>
                <div className="tutor-form-group">
                  <label>Ngày</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
                <div style={{display: 'flex', gap: '1rem'}}>
                  <div className="tutor-form-group" style={{flex: 1}}>
                    <label>Bắt đầu</label>
                    <input type="time" value={formData.start} onChange={(e) => setFormData({...formData, start: e.target.value})} />
                  </div>
                  <div className="tutor-form-group" style={{flex: 1}}>
                    <label>Kết thúc</label>
                    <input type="time" value={formData.end} onChange={(e) => setFormData({...formData, end: e.target.value})} />
                  </div>
                </div>
                <div className="tutor-form-group">
                  <label>Hình thức</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                <div className="tutor-form-group">
                   <label>Ghi chú</label>
                   <textarea rows="2" value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} placeholder="Phòng học, link meet..." />
                </div>
              </div>
              <div className="tutor-modal-footer">
                <button className="tutor-btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button className="tutor-btn-submit" onClick={handleSave}>Lưu</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorSlotsPage;
