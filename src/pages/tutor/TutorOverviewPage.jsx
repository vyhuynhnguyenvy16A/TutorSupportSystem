// TutorOverviewPage.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiBell, FiPlus as FiPlusCourse, FiX, FiUsers, FiClock, FiAlertCircle, FiInfo 
} from 'react-icons/fi';
import hcmutLogo from '../../assets/hcmut.png'; 
import './TutorOverviewPage.css'; 

// --- HELPER: NOTIFICATION SYSTEM (Local Storage) ---
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

// Mock Data ban đầu
const initialCourses = [
  { 
    id: 1, 
    tag: 'UI/UX Design', // Subject
    title: 'Lớp UI/UX Design K15', 
    date: '16/01/2025', 
    status: 'Đang diễn ra',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?auto=format&fit=crop&q=80&w=300&h=200',
    description: 'Học tư duy thiết kế và sử dụng Figma căn bản.',
    count: 25,
    time: 'Sáng T3 (08:00 - 11:00)'
  },
  { 
    id: 2, 
    tag: 'Graphic Design', 
    title: 'Graphic Design Masterclass', 
    date: '14/01/2025', 
    status: 'Đang diễn ra',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799312c95d?auto=format&fit=crop&q=80&w=300&h=200',
    description: 'Thành thạo Photoshop & Illustrator trong 4 tuần.',
    count: 18,
    time: 'Tối T4 (18:00 - 21:00)'
  },
];

const TutorOverviewPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(initialCourses);
  
  // State Modal
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, courseId: null, courseTitle: '' });

  // State Notification
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null); // Cho modal chi tiết thông báo
  
  // State Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // State Form Create (Expanded)
  const [newCourse, setNewCourse] = useState({
    title: '',
    tag: '', // Subject
    customTag: '', // Cho phép nhập môn mới
    maxStudents: 30,
    description: '',
    image: '', 
    time: ''   
  });

  // Load notifications on mount
  useEffect(() => {
    setNotifications(getNotifications());
  }, []);

  // --- HANDLERS NOTIFICATION ---
  const toggleNotifDropdown = () => setShowNotifDropdown(!showNotifDropdown);
  
  const handleNotifClick = (notif) => {
    const updatedList = markAsRead(notif.id);
    setNotifications(updatedList);
    setSelectedNotif(notif);
    setShowNotifDropdown(false);
  };

  // --- HANDLERS CREATE COURSE ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewCourse({ ...newCourse, image: imageUrl });
    }
  };

  const handleCreateCourse = () => {
    // Xác định môn học: nếu chọn "Khác" thì lấy customTag, ngược lại lấy tag
    const finalSubject = newCourse.tag === 'Other' ? newCourse.customTag : newCourse.tag;
    
    if (!newCourse.title || !finalSubject) {
      alert("Vui lòng nhập tên lớp và môn học!");
      return;
    }

    const createdCourse = {
      id: courses.length + 1,
      tag: finalSubject,
      title: newCourse.title,
      date: new Date().toLocaleDateString('en-GB'), 
      status: 'Sắp diễn ra',
      image: newCourse.image || 'https://via.placeholder.com/300x200?text=No+Image',
      description: newCourse.description || 'Chưa có mô tả',
      count: 0,
      time: 'Chưa xếp lịch'
    };

    setCourses([createdCourse, ...courses]);
    
    // Tạo thông báo
    const updatedNotifs = addNotification('Tạo lớp thành công', `Bạn đã tạo lớp mới: ${newCourse.title} (${finalSubject})`);
    setNotifications(updatedNotifs);

    setShowModal(false);
    setNewCourse({ title: '', tag: '', customTag: '', maxStudents: 30, description: '', image: '', time: '' });
  };

  // --- HANDLERS NAVIGATION ---
  const handleCardClick = (course) => {
    setConfirmModal({ isOpen: true, courseId: course.id, courseTitle: course.title });
  };

  const handleConfirmNavigation = () => {
    if (confirmModal.courseId) navigate('/app/tutor/schedule');
    setConfirmModal({ isOpen: false, courseId: null, courseTitle: '' });
  };

  // Logic lọc danh sách
  const filteredCourses = courses.filter(course => {
    const matchSubject = filterSubject === 'All' || course.tag === filterSubject;
    const matchStatus = filterStatus === 'All' || course.status === filterStatus;
    const matchSearch = searchTerm === '' || course.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSubject && matchStatus && matchSearch;
  });

  // Helper Search Suggestion
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 0) {
      setSuggestions(courses.filter(c => c.title.toLowerCase().includes(e.target.value.toLowerCase())));
    } else setSuggestions([]);
  };

  // Đếm thông báo chưa đọc
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="dashboard-page-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img src={hcmutLogo} alt="Logo" />
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
          <h1 className="header-title">Tổng quan</h1>
          
          <div className="header-search-wrapper">
            <div className="header-search">
              <FiSearch /><input type="text" placeholder="Tìm lớp học..." value={searchTerm} onChange={handleSearchChange}/>
            </div>
            {suggestions.length > 0 && (
              <ul className="search-suggestions">
                {suggestions.map(s => <li key={s.id} onClick={() => { setSearchTerm(s.title); setSuggestions([]); }}>{s.title}</li>)}
              </ul>
            )}
          </div>

          <div className="header-actions">
            <button className="btn-icon btn-plus" onClick={() => setShowModal(true)}><FiPlusCourse /></button>
            
            {/* --- NOTIFICATION ICON & DROPDOWN --- */}
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

            <div className="user-profile">
              <img src="https://via.placeholder.com/40" alt="Avatar" />
              <div className="user-info"><span>Jane Doe</span><small>Giảng viên</small></div>
            </div>
          </div>
        </header>

        <main className="dashboard-page-content">
          <div className="overview-header">
            <div className="overview-header-left">
              <h2>Các lớp đang phụ trách</h2>
              <p>Quản lý thông tin và tiến độ giảng dạy.</p>
            </div>
            <button className="btn-new-course" onClick={() => setShowModal(true)}>
              <FiPlusCourse /> Tạo lớp mới
            </button>
          </div>

          <div className="tutor-filter-section">
            <select className="tutor-filter-select" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
              <option value="All">Tất cả môn học</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Graphic Design">Graphic Design</option>
            </select>
            <select className="tutor-filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">Tất cả trạng thái</option>
              <option value="Đang diễn ra">Đang diễn ra</option>
              <option value="Sắp diễn ra">Sắp diễn ra</option>
            </select>
          </div>

          <div className="course-grid">
            {filteredCourses.map((course) => (
              <div className="course-card-modern" key={course.id} onClick={() => handleCardClick(course)}>
                <div className="card-image-cover">
                  <img src={course.image} alt={course.title} />
                  <span className={`status-badge ${course.status === 'Đang diễn ra' ? 'badge-success' : 'badge-gray'}`}>{course.status}</span>
                </div>
                <div className="card-body">
                  <span className="card-category">Môn: {course.tag}</span>
                  <h4 className="card-title">{course.title}</h4>
                  <p className="card-desc">{course.description}</p>
                  <div className="card-footer-info">
                    <div className="info-item"><FiUsers /> <span>{course.count} HV</span></div>
                    <div className="info-item"><FiClock /> <span>{course.time}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* --- MODAL TẠO LỚP --- */}
        {showModal && (
          <div className="tutor-modal-overlay">
            <div className="tutor-modal">
              <div className="tutor-modal-header">
                <h3>Tạo lớp học mới</h3>
                <button className="btn-close-square" onClick={() => setShowModal(false)}><FiX /></button>
              </div>
              <div className="tutor-modal-body">
                <div className="tutor-form-group">
                  <label>Tên lớp học (Tự do)</label>
                  <input type="text" value={newCourse.title} onChange={(e) => setNewCourse({...newCourse, title: e.target.value})} placeholder="VD: Lớp Toán Cao Cấp A1..." />
                </div>
                
                {/* --- MỞ RỘNG: CHỌN HOẶC NHẬP MÔN HỌC --- */}
                <div className="tutor-form-group">
                  <label>Môn học</label>
                  <select 
                    value={newCourse.tag} 
                    onChange={(e) => setNewCourse({...newCourse, tag: e.target.value})}
                    style={{marginBottom: newCourse.tag === 'Other' ? '0.5rem' : '0'}}
                  >
                    <option value="">-- Chọn môn học --</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Other">Nhập môn khác...</option>
                  </select>
                  {newCourse.tag === 'Other' && (
                    <input 
                      type="text" 
                      placeholder="Nhập tên môn học mới..." 
                      value={newCourse.customTag}
                      onChange={(e) => setNewCourse({...newCourse, customTag: e.target.value})}
                    />
                  )}
                </div>

                <div className="tutor-form-group">
                  <label>Hình ảnh lớp</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
                <div className="tutor-form-group">
                  <label>Mô tả ngắn</label>
                  <textarea rows="2" value={newCourse.description} onChange={(e) => setNewCourse({...newCourse, description: e.target.value})} />
                </div>
              </div>
              <div className="tutor-modal-footer">
                <button className="tutor-btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                <button className="tutor-btn-submit" onClick={handleCreateCourse}>Tạo mới</button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL XÁC NHẬN --- */}
        {confirmModal.isOpen && (
          <div className="tutor-modal-overlay">
            <div className="confirm-modal-box">
              <div className="confirm-modal-header">
                <h3>Xác nhận chuyển trang</h3>
                <button className="btn-close-square" onClick={() => setConfirmModal({...confirmModal, isOpen: false})}><FiX /></button>
              </div>
              <div className="confirm-modal-content">
                <FiAlertCircle size={40} color="#4f46e5" style={{marginBottom: '1rem'}}/>
                <p>Chuyển tới lịch lớp <strong>{confirmModal.courseTitle}</strong>?</p>
              </div>
              <div className="confirm-modal-actions">
                <button className="tutor-btn-cancel" onClick={() => setConfirmModal({...confirmModal, isOpen: false})}>Hủy</button>
                <button className="tutor-btn-submit" onClick={handleConfirmNavigation}>Xác nhận</button>
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

export default TutorOverviewPage;
