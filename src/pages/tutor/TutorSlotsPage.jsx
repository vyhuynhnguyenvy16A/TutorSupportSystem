// TutorSlotsPage.jsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './TutorSlotsPage.css'; 
import './TutorOverviewPage.css'; // Kế thừa styles Modal và Notification

import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiPlus, FiBell, 
  FiPlusCircle, FiEdit, FiTrash2, FiX, FiLink, FiMapPin
} from 'react-icons/fi';
import dashboardPreview from '../../assets/hcmut.png';

// --- HELPER: NOTIFICATION SYSTEM (Shared Logic via LocalStorage) ---
const getNotifications = () => {
  const data = localStorage.getItem('tutor_notifications');
  return data ? JSON.parse(data) : [];
};

const addNotification = (title, message) => {
  const newNotif = {
    id: Date.now(),
    title,
    message,
    time: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
    isRead: false
  };
  const list = [newNotif, ...getNotifications()];
  localStorage.setItem('tutor_notifications', JSON.stringify(list));
  return list;
};

const markAsRead = (id) => {
  const list = getNotifications().map(n => n.id === id ? { ...n, isRead: true } : n);
  localStorage.setItem('tutor_notifications', JSON.stringify(list));
  return list;
};

const formatDateVN = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

// --- MOCK DATA CẬP NHẬT ---
// Dữ liệu lớp học có sẵn từ Overview (Giả lập)
const availableClasses = [
  { id: 'C01', name: 'Lớp UI/UX Design K15', subject: 'UI/UX Design' },
  { id: 'C02', name: 'Graphic Design Masterclass', subject: 'Graphic Design' },
  { id: 'C03', name: 'Lớp Toán 12A1', subject: 'Toán Học' }, 
  { id: 'C04', name: 'Lớp Lập Trình Web', subject: 'Web Development' },
];

const initialSlots = [
  { 
    id: 1, 
    className: 'Lớp UI/UX Design K15', // Tên lớp
    subject: 'UI/UX Design', // Môn học
    date: '2025-11-25', 
    start: '09:00', end: '11:00', type: 'Offline', room: 'Phòng A204, Tòa H6', link: '', 
    status: 'Còn trống', registered: 5, max: 20 
  },
  { 
    id: 2, 
    className: 'Graphic Design Masterclass',
    subject: 'Graphic Design',
    date: '2025-11-28', 
    start: '13:30', end: '15:30', type: 'Online', room: '', link: 'https://meet.google.com/abc-xyz', 
    status: 'Còn trống', registered: 10, max: 15 
  },
];

const TutorSlotsPage = () => {
  const [slots, setSlots] = useState(initialSlots);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // State Notification
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  // Load notifications
  useEffect(() => {
    setNotifications(getNotifications());
  }, []);

  // Handlers Notification
  const toggleNotifDropdown = () => setShowNotifDropdown(!showNotifDropdown);
  const handleNotifClick = (notif) => {
    const updatedList = markAsRead(notif.id);
    setNotifications(updatedList);
    setSelectedNotif(notif);
    setShowNotifDropdown(false);
  };
  
  // State form
  const [formData, setFormData] = useState({
    id: null,
    className: '',
    subject: '',
    date: '',
    start: '',
    end: '',
    type: 'Online',
    link: '',
    room: '',
    max: 20,
    note: ''
  });

  const handleOpenCreate = () => {
    setIsEditMode(false);
    // Mặc định chọn lớp đầu tiên
    const defaultClass = availableClasses[0];
    setFormData({ 
      id: null, 
      className: defaultClass.name, 
      subject: defaultClass.subject, 
      date: '', start: '', end: '', type: 'Online', link: '', room: '', max: 20, note: '' 
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slot) => {
    setIsEditMode(true);
    setFormData({ ...slot, note: slot.note || '' }); 
    setIsModalOpen(true);
  };

  // --- LOGIC CHỌN LỚP -> TỰ ĐỘNG CẬP NHẬT MÔN ---
  const handleClassChange = (e) => {
    const selectedName = e.target.value;
    const foundClass = availableClasses.find(c => c.name === selectedName);
    setFormData({
      ...formData,
      className: selectedName,
      subject: foundClass ? foundClass.subject : '' // Auto-fill Subject
    });
  };

  const handleSave = () => {
    const cleanData = {
      ...formData,
      link: formData.type === 'Online' ? formData.link : '',
      room: formData.type === 'Offline' ? formData.room : ''
    };

    if (isEditMode) {
      setSlots(slots.map(s => s.id === formData.id ? { ...cleanData, registered: s.registered, status: s.status } : s));
      const updated = addNotification('Cập nhật Slot', `Đã cập nhật slot cho lớp ${cleanData.className}`);
      setNotifications(updated);
    } else {
      const newSlot = {
        ...cleanData,
        id: Date.now(),
        status: 'Còn trống',
        registered: 0
      };
      setSlots([...slots, newSlot]);
      const updated = addNotification('Thêm Slot thành công', `Đã thêm lịch dạy mới cho môn ${cleanData.subject} (${cleanData.className})`);
      setNotifications(updated);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa slot này?")) {
      setSlots(slots.filter(s => s.id !== id));
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
          <div className="header-search" style={{marginLeft: '2rem', width: '300px'}}>
             <FiSearch /><input type="text" placeholder="Tìm kiếm slots..." />
          </div>
          <div className="header-actions">
            <button className="btn-icon btn-plus" onClick={handleOpenCreate}><FiPlus /></button>
            
            {/* --- NOTIFICATION ICON --- */}
            <div className="notification-wrapper">
              <button className="btn-icon" onClick={toggleNotifDropdown}>
                <FiBell />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </button>
              {showNotifDropdown && (
                <div className="notification-dropdown">
                  <div className="notif-header">Thông báo</div>
                  <div className="notif-list">
                    {notifications.length === 0 ? <p className="notif-empty">Không có thông báo</p> : 
                      notifications.map(n => (
                        <div key={n.id} className={`notif-item ${!n.isRead ? 'unread' : ''}`} onClick={() => handleNotifClick(n)}>
                          <div className="notif-title">{n.title}</div>
                          <div className="notif-time">{n.time}</div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>

            <div className="user-profile"><img src="https://via.placeholder.com/40" alt="Avatar" /><span>Jane Doe</span></div>
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
                  <th>LỚP & MÔN HỌC</th>
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
                    <td>
                      {/* HIỂN THỊ RÕ LỚP VÀ MÔN */}
                      <div style={{fontWeight: 600, color: '#111827'}}>{slot.className}</div>
                      <small style={{color: '#6b7280', fontSize: '0.85rem'}}>Môn: {slot.subject}</small>
                    </td>
                    <td>
                      <div style={{fontWeight: 500}}>{formatDateVN(slot.date)}</div>
                      <small style={{color:'#6b7280'}}>{slot.start} - {slot.end}</small>
                    </td>
                    <td>
                      <div style={{fontWeight: '500', marginBottom: '4px'}}>{slot.type}</div>
                      {slot.type === 'Online' ? (
                        <div className="slot-location-info online">
                          <FiLink /> 
                          {slot.link ? <a href={slot.link} target="_blank" rel="noopener noreferrer">Vào lớp</a> : <span style={{color:'#9ca3af'}}>Chưa có link</span>}
                        </div>
                      ) : (
                        <div className="slot-location-info offline">
                          <FiMapPin /> <span>{slot.room || 'Chưa có phòng'}</span>
                        </div>
                      )}
                    </td>
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
                <button className="btn-close-square" onClick={() => setIsModalOpen(false)}><FiX /></button>
              </div>
              <div className="tutor-modal-body">
                
                {/* --- CHỌN LỚP -> TỰ ĐỘNG GỢI Ý MÔN --- */}
                <div className="tutor-form-group">
                  <label>Chọn Lớp</label>
                  <select value={formData.className} onChange={handleClassChange}>
                    {availableClasses.map((cls) => (
                      <option key={cls.id} value={cls.name}>{cls.name}</option>
                    ))}
                  </select>
                </div>

                <div className="tutor-form-group">
                  <label>Môn học (Tự động theo lớp)</label>
                  <select value={formData.subject} disabled style={{backgroundColor: '#f3f4f6'}}>
                    {/* Hiển thị tất cả môn để select có value đúng, nhưng bị disable */}
                    {availableClasses.map((cls) => (
                      <option key={cls.id} value={cls.subject}>{cls.subject}</option>
                    ))}
                  </select>
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

                <div style={{display: 'flex', gap: '1rem'}}>
                   <div className="tutor-form-group" style={{flex: 1}}>
                    <label>Hình thức</label>
                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
                  <div className="tutor-form-group" style={{flex: 1}}>
                    <label>Số slot</label>
                    <input type="number" min="1" value={formData.max} onChange={(e) => setFormData({...formData, max: parseInt(e.target.value) || 0})} />
                  </div>
                </div>

                {formData.type === 'Online' ? (
                  <div className="tutor-form-group">
                    <label>Link học Online</label>
                    <input type="text" placeholder="https://..." value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} />
                  </div>
                ) : (
                  <div className="tutor-form-group">
                    <label>Phòng học</label>
                    <input type="text" placeholder="VD: A101" value={formData.room} onChange={(e) => setFormData({...formData, room: e.target.value})} />
                  </div>
                )}

                <div className="tutor-form-group">
                   <label>Ghi chú</label>
                   <textarea rows="2" value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} />
                </div>
              </div>
              <div className="tutor-modal-footer">
                <button className="tutor-btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button className="tutor-btn-submit" onClick={handleSave}>Lưu</button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL CHI TIẾT THÔNG BÁO --- */}
        {selectedNotif && (
          <div className="tutor-modal-overlay">
             <div className="confirm-modal-box" style={{width: '500px'}}>
               <div className="confirm-modal-header">
                 <h3>Chi tiết thông báo</h3>
                 <button className="btn-close-square" onClick={() => setSelectedNotif(null)}><FiX /></button>
               </div>
               <div className="tutor-modal-body">
                 <h4 style={{marginTop:0}}>{selectedNotif.title}</h4>
                 <p style={{color: '#6b7280', fontSize: '0.9rem'}}>{selectedNotif.time}</p>
                 <hr style={{border: '0', borderTop: '1px solid #e5e7eb', margin: '1rem 0'}}/>
                 <p>{selectedNotif.message}</p>
               </div>
               <div className="confirm-modal-actions">
                 <button className="tutor-btn-submit" onClick={() => setSelectedNotif(null)}>Đóng</button>
               </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TutorSlotsPage;
