import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiPlus, FiBell, FiGrid, FiList, FiPlus as FiPlusCourse, FiX 
} from 'react-icons/fi';
import hcmutLogo from '../../assets/hcmut.png'; 
import './TutorOverviewPage.css'; 

// Mock Data ban đầu
const initialCourses = [
  { id: 1, tag: 'UI/UX Design', title: 'Lớp UI/UX Design K15 (Sáng T3)', date: '16 Jan 2025', status: 'Đang diễn ra' },
  { id: 2, tag: 'Graphic Design', title: 'Lớp Graphic Design Masterclass (Tối T4)', date: '14 Jan 2025', status: 'Đang diễn ra' },
  { id: 3, tag: 'Animation', title: 'Lớp 2D Animation cơ bản (Sáng T5)', date: '13 Jan 2025', status: 'Đã kết thúc' },
];

const TutorOverviewPage = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [showModal, setShowModal] = useState(false);
  
  // State cho bộ lọc
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // State cho form tạo mới
  const [newCourse, setNewCourse] = useState({
    title: '',
    tag: 'UI/UX Design', // Default
    maxStudents: 30,
    description: ''
  });

  // Xử lý tạo lớp mới
  const handleCreateCourse = () => {
    const createdCourse = {
      id: courses.length + 1,
      tag: newCourse.tag,
      title: newCourse.title,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Sắp diễn ra' // Mặc định
    };
    setCourses([createdCourse, ...courses]);
    setShowModal(false);
    // Reset form
    setNewCourse({ title: '', tag: 'UI/UX Design', maxStudents: 30, description: '' });
  };

  // Xử lý lọc danh sách
  const filteredCourses = courses.filter(course => {
    const matchSubject = filterSubject === 'All' || course.tag === filterSubject;
    const matchStatus = filterStatus === 'All' || course.status === filterStatus;
    return matchSubject && matchStatus;
  });

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
          <h1 className="header-title">Tổng quan (Giảng viên)</h1>
          <div className="header-search"><FiSearch /><input type="text" placeholder="Tìm kiếm..." /></div>
          <div className="header-actions">
            <button className="btn-icon btn-plus"><FiPlus /></button>
            <button className="btn-icon"><FiBell /></button>
            <div className="user-profile">
              <img src="https://via.placeholder.com/40" alt="Avatar" />
              <div className="user-info"><span>Jane Doe (GV)</span><small>Lecturer</small></div>
            </div>
          </div>
        </header>

        <main className="dashboard-page-content">
          <div className="notification-bar">
            <span>Chào mừng! Bạn đang quản lý <strong>{courses.length}</strong> lớp học. <a>Xem chi tiết</a></span>
            <button>&times;</button>
          </div>

          <div className="overview-header">
            <div className="overview-header-left">
              <h2>Các lớp bạn đang dạy</h2>
              <p>Quản lý các lớp học và sinh viên.</p>
            </div>
            <button className="btn-new-course" onClick={() => setShowModal(true)}>
              <FiPlusCourse /> Tạo lớp mới
            </button>
          </div>

          {/* BỘ LỌC MỚI */}
          <div className="tutor-filter-section">
            <select 
              className="tutor-filter-select" 
              value={filterSubject} 
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="All">Tất cả môn học</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="Animation">Animation</option>
            </select>

            <select 
              className="tutor-filter-select" 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Đang diễn ra">Đang diễn ra</option>
              <option value="Sắp diễn ra">Sắp diễn ra</option>
              <option value="Đã kết thúc">Đã kết thúc</option>
            </select>
          </div>

          <div className="course-navigation">
            <div className="course-tabs">
              <button className="course-tab active">Danh sách lớp</button>
            </div>
            <div className="view-toggles">
              <button className="toggle-btn active"><FiGrid /></button>
              <button className="toggle-btn"><FiList /></button>
            </div>
          </div>

          <div className="course-grid">
            {filteredCourses.map((course) => (
              <div className="course-card" key={course.id}>
                <div className="card-image-placeholder">
                  <span className="card-tag">{course.tag}</span>
                </div>
                <div className="card-content">
                  <h4 className="card-title">{course.title}</h4>
                  <div className="card-meta">
                    <div><label>Ngày tạo</label><span>{course.date}</span></div>
                    <div>
                      <label>Trạng thái</label>
                      <span className={`status ${
                        course.status === 'Đang diễn ra' ? 'status-success' : 
                        course.status === 'Đã kết thúc' ? 'status-failed' : 'status-pending'
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

        {/* MODAL TẠO LỚP */}
        {showModal && (
          <div className="tutor-modal-overlay">
            <div className="tutor-modal">
              <div className="tutor-modal-header">
                <h3>Tạo lớp học mới</h3>
                <button onClick={() => setShowModal(false)}><FiX /></button>
              </div>
              <div className="tutor-modal-body">
                <div className="tutor-form-group">
                  <label>Tên lớp học</label>
                  <input type="text" value={newCourse.title} onChange={(e) => setNewCourse({...newCourse, title: e.target.value})} placeholder="VD: UI/UX K15..." />
                </div>
                <div className="tutor-form-group">
                  <label>Môn học</label>
                  <select value={newCourse.tag} onChange={(e) => setNewCourse({...newCourse, tag: e.target.value})}>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Animation">Animation</option>
                  </select>
                </div>
                <div className="tutor-form-group">
                  <label>Số lượng SV tối đa</label>
                  <input type="number" value={newCourse.maxStudents} onChange={(e) => setNewCourse({...newCourse, maxStudents: e.target.value})} />
                </div>
                <div className="tutor-form-group">
                  <label>Mô tả</label>
                  <textarea rows="3" value={newCourse.description} onChange={(e) => setNewCourse({...newCourse, description: e.target.value})} />
                </div>
              </div>
              <div className="tutor-modal-footer">
                <button className="tutor-btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                <button className="tutor-btn-submit" onClick={handleCreateCourse}>Tạo mới</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorOverviewPage;