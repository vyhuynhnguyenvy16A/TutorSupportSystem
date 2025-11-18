import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './TutorSettingsPage.css';
import dashboardPreview from '../../assets/hcmut.png'; 
import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiPlus, FiBell, FiCamera, FiEdit2, FiSave, FiX
} from 'react-icons/fi';

const TutorSettingsPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  // Mock State Profile
  const [profile, setProfile] = useState({
    photo: dashboardPreview,
    name: 'Jane Doe',
    age: 35,
    msgv: 'GV10293',
    cccd: '012345678910',
    dob: '1990-03-10', // Format YYYY-MM-DD for input date
    gender: 'Female',
    mobile: '+84 909123456',
    email: 'jane.doe@hcmut.edu.vn',
    nationality: 'Vietnamese',
    address: '123, Đường ABC, Phường XYZ, Quận 1, TP.HCM',
    city: 'Hồ Chí Minh',
    pincode: '700000',
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Handle Avatar Change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, photo: imageUrl });
    }
  };

  // Handle Save/Cancel
  const handleSave = () => setIsEditing(false);
  const handleCancel = () => setIsEditing(false); // Trong thực tế sẽ reset về state cũ

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
          <h1 className="header-title">Hồ Sơ Giảng viên</h1>
          <div className="header-search"><FiSearch /><input type="text" placeholder="Tìm kiếm..." /></div>
          <div className="header-actions">
            <button className="btn-icon btn-plus"><FiPlus /></button>
            <div className="user-profile">
              <img src={profile.photo} alt="Avatar" />
              <div className="user-info"><span>{profile.name}</span><small>Lecturer</small></div>
            </div>
          </div>
        </header>

        <main className="dashboard-page-content">
          <div className="settings-content-grid">
            <div className="profile-details-column">
              <div className="profile-section">
                <div className="section-title">
                  <h3>Thông tin cá nhân</h3>
                  {!isEditing ? (
                    <button className="tutor-btn-edit" onClick={() => setIsEditing(true)}>
                      <FiEdit2 /> Chỉnh sửa
                    </button>
                  ) : (
                    <div className="tutor-edit-actions">
                      <button className="tutor-btn-save" onClick={handleSave}><FiSave /> Lưu</button>
                      <button className="tutor-btn-cancel-sm" onClick={handleCancel}><FiX /> Hủy</button>
                    </div>
                  )}
                </div>

                <div className="avatar-section">
                  <span>Ảnh đại diện:</span>
                  <div className="tutor-avatar-wrapper">
                    <img src={profile.photo} alt="Tutor Avatar" />
                    <button className="tutor-btn-upload" onClick={() => fileInputRef.current.click()}>
                      <FiCamera />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      style={{display: 'none'}} 
                      onChange={handleAvatarChange} 
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="form-field-row">
                  <label>Họ tên:</label>
                  {isEditing ? <input className="tutor-input" name="name" value={profile.name} onChange={handleChange}/> : <div className="field-value">{profile.name}</div>}
                </div>
                <div className="form-field-row">
                  <label>MSGV:</label>
                  <div className="field-value" style={{backgroundColor: '#f3f4f6', color:'#9ca3af'}}>{profile.msgv} (Không thể sửa)</div>
                </div>
                <div className="form-field-row">
                  <label>Ngày sinh:</label>
                  {isEditing ? <input className="tutor-input" type="date" name="dob" value={profile.dob} onChange={handleChange}/> : <div className="field-value">{profile.dob}</div>}
                </div>
                
                <h3 className="section-title" style={{marginTop: '2rem'}}>Liên hệ</h3>
                
                <div className="form-field-row">
                  <label>Số điện thoại:</label>
                  {isEditing ? <input className="tutor-input" name="mobile" value={profile.mobile} onChange={handleChange}/> : <div className="field-value">{profile.mobile}</div>}
                </div>
                <div className="form-field-row">
                  <label>Email:</label>
                  {isEditing ? <input className="tutor-input" name="email" value={profile.email} onChange={handleChange}/> : <div className="field-value">{profile.email}</div>}
                </div>
                <div className="form-field-row-full">
                  <label>Địa chỉ:</label>
                  {isEditing ? <textarea className="tutor-input" rows="2" name="address" value={profile.address} onChange={handleChange}/> : <div className="field-value">{profile.address}</div>}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TutorSettingsPage;