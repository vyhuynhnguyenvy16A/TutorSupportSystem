import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './SettingsPage.css'; 
import './SchedulePage.css'; 
import dashboardPreview from '../../assets/hcmut.png'; 
import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiPlus, FiBell, 
  FiEdit2, FiSave, FiX 
} from 'react-icons/fi';
import { getStudentProfile, updateStudentProfile } from '../../api/studentService.js';

const SettingsPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // State Profile
  const [profile, setProfile] = useState({
    photo: dashboardPreview,
    name: "Loading..",
    age: '',
    mssv: '',
    cccd: '',
    dob: '',       // Hiển thị (DD/MM/YYYY)
    rawDob: '',    // Value cho input date (YYYY-MM-DD)
    gender: '',
    mobile: '',
    email: '',
    nationality: '',
    city: '',
    trangthai: '',
    lichranh: '',
    address: ''
  });

  // --- HELPERS (Safe Checks to avoid Crash) ---
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return isNaN(date.getTime()) ? '' : date.toLocaleDateString('vi-VN'); 
  };
  
  const formatInputDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
  };

  const calculateAge = (isoString) => {
    if (!isoString) return '';
    const birthDate = new Date(isoString);
    if (isNaN(birthDate.getTime())) return '';
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getStudentProfile();
        
        // Check kỹ structure để tránh lỗi undefined
        if(response && response.meta && response.meta.studentInfo) {
          const data = response.meta.studentInfo;
          setProfile(prev => ({
            ...prev,
            name: data.fullname || '',
            mssv: data.mssv || '',
            email: data.email || '',
            mobile: data.phone || '',
            dob: formatDate(data.birthday),
            rawDob: formatInputDate(data.birthday),
            age: calculateAge(data.birthday),
            address: data.address || '',
            cccd: data.cccd || '',
            gender: data.gender || 'Nam',
            trangthai: data.tinhtrang || '',
            nationality: data.nationality || 'Vietnam',
            city: data.city || 'Ho Chi Minh',
            lichranh: data.lichranh || "",
          }));
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const payload = {
        hoTen: profile.name,
        ngaySinh: profile.rawDob, // YYYY-MM-DD
        gioiTinh: profile.gender,
        soCMND: profile.cccd,
        soDienThoai: profile.mobile,
        lichranh: profile.lichranh
      };

      await updateStudentProfile(payload);
      
      // Update lại UI sau khi save thành công
      setProfile(prev => ({
        ...prev,
        dob: formatDate(prev.rawDob),
        age: calculateAge(prev.rawDob)
      }));

      alert("Cập nhật thành công!");
      setIsEditing(false);
    } catch (err) {
      console.error("Update Error:", err);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dashboard-page-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img src={dashboardPreview} alt="Logo" />
          <span>Hệ thống Lịch</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/app/overview" className="nav-link"><FiHome /><span>Tổng quan</span></NavLink>
          <NavLink to="/app/schedule" className="nav-link"><FiCalendar /><span>Lịch</span></NavLink>
          <NavLink to="/app/settings" className="nav-link"><FiSettings /><span>Cài đặt</span></NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main-content">
        <header className="dashboard-header">
          <h1 className="header-title">Hồ Sơ & Cài Đặt</h1>
          <div className="header-search"><FiSearch /><input type="text" placeholder="Tìm kiếm..." /></div>
          <div className="header-actions">
            <button className="btn-icon btn-plus"><FiPlus /></button>
            <div className="user-profile">
              <img src={profile.photo} alt="Avatar" />
              <div className="user-info"><span>{profile.name}</span><small>Student</small></div>
            </div>
          </div>
        </header>

        <main className="dashboard-page-content">
          {isLoading ? <p>Đang tải dữ liệu...</p> : (
            <div className="settings-content-grid">
              <div className="profile-details-column">
                <div className="profile-section">
                  
                  {/* Header Section: Title & Buttons */}
                  <div className="section-title" style={{display:'flex', justifyContent:'space-between'}}>
                    <h3 style={{margin:0}}>Thông tin cá nhân</h3>
                    <div className="action-buttons">
                      {!isEditing ? (
                        <button className="btn-edit" onClick={() => setIsEditing(true)}>
                          <FiEdit2 /> Chỉnh sửa
                        </button>
                      ) : (
                        <div style={{display:'flex', gap:'10px'}}>
                          <button className="btn-save" onClick={handleSave} disabled={isSaving}>
                            <FiSave /> Lưu
                          </button>
                          <button className="btn-cancel" onClick={() => setIsEditing(false)} disabled={isSaving}>
                            <FiX /> Hủy
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="avatar-section">
                    <span>Photo:</span>
                    <img src={profile.photo} alt="Avatar" />
                  </div>

                  {/* FORM FIELDS */}
                  <div className="form-field-row">
                    <label>Họ và tên:</label>
                    {isEditing ? (
                      <input className="input-field" name="name" value={profile.name} onChange={handleChange} />
                    ) : <div className="field-value">{profile.name}</div>}
                  </div>

                  <div className="form-field-row">
                    <label>MSSV (Không thể sửa):</label>
                    <div className="field-value" style={{background: '#f3f4f6', color:'#888'}}>{profile.mssv}</div>
                  </div>

                  <div className="form-field-row">
                    <label>CCCD / CMND:</label>
                    {isEditing ? (
                      <input className="input-field" name="cccd" value={profile.cccd} onChange={handleChange} />
                    ) : <div className="field-value">{profile.cccd}</div>}
                  </div>

                  <div className="form-field-row">
                    <label>Tuổi:</label>
                    <div className="field-value" style={{background: '#f3f4f6'}}>{profile.age}</div>
                  </div>

                  <div className="form-field-row">
                    <label>Ngày sinh:</label>
                    {isEditing ? (
                      <input type="date" className="input-field" name="rawDob" value={profile.rawDob} onChange={handleChange} />
                    ) : <div className="field-value">{profile.dob}</div>}
                  </div>

                  <div className="form-field-row">
                    <label>Giới tính:</label>
                    {isEditing ? (
                      <select className="input-field" name="gender" value={profile.gender} onChange={handleChange}>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    ) : <div className="field-value">{profile.gender}</div>}
                  </div>
                </div>

                {/* Contact Section */}
                <div className="profile-section">
                  <h3 className="section-title">Thông tin liên hệ</h3>
                  
                  <div className="form-field-row">
                    <label>Số điện thoại:</label>
                    {isEditing ? (
                      <input className="input-field" name="mobile" value={profile.mobile} onChange={handleChange} />
                    ) : <div className="field-value">{profile.mobile}</div>}
                  </div>

                  <div className="form-field-row">
                    <label>Email (Không thể sửa):</label>
                    <div className="field-value" style={{background: '#f3f4f6', color:'#888'}}>{profile.email}</div>
                  </div>

                  <div className="form-field-row-full">
                    <label>Lịch rảnh:</label>
                    {isEditing ? (
                      <input className="input-field" name="lichranh" value={profile.lichranh} onChange={handleChange} placeholder="VD: Tối thứ 2-4-6" />
                    ) : <div className="field-value">{profile.lichranh || "Chưa thiết lập"}</div>}
                  </div>
                  
                  <div className="form-field-row">
                    <label>Trạng thái tìm Tutor:</label>
                    <div className="field-value">{profile.trangthai}</div>
                  </div>

                  <div className="form-field-row">
                    <label>Thành phố:</label>
                    <div className="field-value">{profile.city}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;