import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './TutorSettingsPage.css';
import dashboardPreview from '../../assets/hcmut.png'; 
import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiPlus, FiBell, FiCamera, FiEdit2, FiSave, FiX
} from 'react-icons/fi';
import { set } from 'react-hook-form';
import { getTutorProfile, updateTutorLinhvuc, updateTutorProfile } from '../../api/tutorService';
import { meta } from '@eslint/js';
import axios from 'axios';
import { getFields } from '../../api/publicService';
const TutorSettingsPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fields, setFields] = useState([]);
  const fileInputRef = useRef(null);

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

  const formatGender = (gender) => {
    switch (gender) {
      case 'Nam':
        return 'Nam';
      case 'N_':
        return 'Nữ';
      case 'Kh_c':
        return 'Khác';
      default:
        return '';
    }
  }
  // Mock State Profile
  const [profile, setProfile] = useState({
      photo: dashboardPreview,
      name: "Loading..",
      age: '',
      msgv: '',
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
      address: '',
      bomon: '',
      bangcap: '',
      linhvuc: '',
      linhvucid: []
    });
  const [tempProfile, setTempProfile] = useState(profile);
  // Fetch Data:
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const [response, fieldRes] = await Promise.all([
          getTutorProfile(),
          getFields()
        ]);

        if(response && response.meta && response.meta.tutorInfo) {
          const data = response.meta.tutorInfo;
          setProfile(prev => ({
            ...prev,
            name: data.hoten || '',
            msgv: data.msgv || '',
            email: data.email || '',
            mobile: data.SDT || '',
            dob: formatDate(data.NGAYSINH) || '',
            rawDob: formatInputDate(data.NGAYSINH) || '',
            trangthai: data.TRANGTHAI || '',
            lichranh: data.LICHRANH || '',
            bangcap: data.BANGCAP || '',
            bomon: data.BOMON || '',
            gender: formatGender(data.GIOITINH) || '',
            cccd: data.CMND || '',
            linhvuc: data.LINHVUC || []
          }))
        }

        // Xử lý Lĩnh vực
        if (fieldRes && fieldRes.meta && fieldRes.meta.fieldList) {
          const mappedFields = fieldRes.meta.fieldList.map(item => ({
            id: item.LINHVUCID, // <--- LƯU Ý: Backend nên trả về ID thật
            name: item.TENLINHVUC
          }));
          setFields(mappedFields);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);
  // Handle Input Change
  const handleChange = (e) => {
    // Lưu tạm vào một tempProfile cho trang web.
    const { name, value } = e.target;
    setTempProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLinhVucChange = (e) => {
    const {name, value}  = e.target;
    setTempProfile(prev => ({
      ...prev,
      [name]: value,
      linhvucid: fields.filter(f => f.name === value).map(f => f.id)
    }));
  }
  // Handle Avatar Change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, photo: imageUrl });
    }
  };

  const handleEditClick = () => {
    setTempProfile({...profile});
    setIsEditing(true);
  }
  // Handle Save/Cancel
  const handleSave = async () => {
    try {
      setIsSaving(true);

      if(tempProfile.cccd.length < 12) {
        alert("CMND phải có đúng 12 số!");
        throw "err";
      }

      if(tempProfile.mobile.lenght < 10) {
        alert("Số điện thoại phải có 10 chữ số!");
        throw "err";
      }

      const payload_profile = {
        hoTen: tempProfile.name,
        ngaySinh: formatInputDate(tempProfile.rawDob),
        gioiTinh: tempProfile.gender,
        soCMND: tempProfile.cccd,
        soDienThoai : tempProfile.mobile,
        BOMON: tempProfile.bomon,
        BANGCAP: tempProfile.bangcap,
        TRANGTHAI: tempProfile.trangthai,
        LICHRANH_TEXT: tempProfile.lichranh
      }
      const payload_linhvuc = {
        fieldIds: [ tempProfile.linhvucid ]
      }
      await Promise.all([
        updateTutorProfile(payload_profile),
        updateTutorLinhvuc(payload_linhvuc)
      ]);

      setProfile(tempProfile);

      alert("Cập nhật thành công!");
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:" , err);
      alert("Cập nhật thất bại!. Vui lòng thử lại.",err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    setIsEditing(false); // Trong thực tế sẽ reset về state cũ
  }

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
                    <button className="tutor-btn-edit" onClick={handleEditClick}>
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
                <h3 className="section-title" style={{marginTop: '2rem'}}>Thông tin cơ bản</h3>
                
                <div className="form-field-row">
                  <label>Họ tên:</label>
                  {isEditing ? <input className="tutor-input" name="name" value={tempProfile.name} onChange={handleChange}/> : <div className="field-value">{profile.name}</div>}
                </div>
                <div className="form-field-row">
                  <label>Ngày sinh:</label>
                  {isEditing ? <input className="tutor-input" type="date" name="rawDob" value={tempProfile.rawDob} onChange={handleChange}/> : <div className="field-value">{formatDate(profile.rawDob)}</div>}
                </div>
                <div className="form-field-row">
                  <label>Giới tính:</label>
                  {isEditing ? (
                    <select
                      className="tutor-input"
                      name="gender"
                      value={tempProfile.gender} // Dùng biến tạm (tempProfile)
                      onChange={handleChange}
                    >
                      {/* Tùy chọn mặc định nếu dữ liệu trống (tùy bạn có muốn giữ hay không) */}
                      
                      <option value="Nam">Nam</option>
                      <option value="N_">Nữ</option>
                      <option value="Kh_c">Khác</option>
                    </select>
                  ) : (
                    <div className="field-value">
                      {formatGender(profile.gender)}
                    </div>
                  )}
                </div>
                <div className="form-field-row">
                  <label>CMND:</label>
                  {isEditing ? <input className="tutor-input" name="cccd" value={tempProfile.cccd} onChange={handleChange}/> : <div className="field-value">{profile.cccd}</div>}
                </div>

                <h3 className="section-title" style={{marginTop: '2rem'}}>Liên hệ</h3>
                
                <div className="form-field-row">
                  <label>Số điện thoại:</label>
                  {isEditing ? <input className="tutor-input" name="mobile" value={tempProfile.mobile} onChange={handleChange}/> : <div className="field-value">{profile.mobile}</div>}
                </div>
                <div className="form-field-row">
                  <label>Email:</label>
                  <div className="field-value" style={{backgroundColor: '#f3f4f6', color:'#9ca3af'}}>{profile.email}</div>
                </div>
                <div className="form-field-row-full">
                  <label>Lĩnh vực</label>
                  {isEditing ? (
                    <select
                      className="tutor-input"
                      name="linhvuc"
                      value={tempProfile.linhvuc}
                      onChange={handleLinhVucChange}
                    >
                      <option value="">-- Chọn lĩnh vực --</option>
                      {fields.map(f => (
                        <option key={f.id} value={f.name}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="field-value">
                      {profile.linhvuc || "Chưa cập nhật"}
                    </div>
                  )}
                </div>
                <div className="form-field-row-full">
                  <label>Bộ môn</label>
                  {isEditing ? <textarea className="tutor-input" rows="2" name="bomon" value={tempProfile.bomon} onChange={handleChange}/> : <div className="field-value">{profile.bomon}</div>}
                </div>
                <div className="form-field-row-full">
                  <label>Bằng cấp</label>
                  {isEditing ? <textarea className="tutor-input" rows="2" name="bangcap" value={tempProfile.bangcap} onChange={handleChange}/> : <div className="field-value">{profile.bangcap}</div>}
                </div>
                <div className="form-field-row-full">
                  <label>Lịch rảnh</label>
                  {isEditing ? <textarea className="tutor-input" rows="2" name="lichranh" value={tempProfile.lichranh} onChange={handleChange}/> : <div className="field-value">{profile.lichranh}</div>}
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
