import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './TutorSlotsPage.css';
import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiTrash2, FiPlus, FiClock, FiVideo, FiMapPin, FiX
} from 'react-icons/fi';
import dashboardPreview from '../../assets/hcmut.png';

// API Imports
import { getTutorProfile, getTutorSlots, createSlots, deleteSlots } from '../../api/tutorService';
import { getFields } from '../../api/publicService';

const TutorSlotsPage = () => {
  // State Data
  const [myFields, setMyFields] = useState([]); // Danh sách môn của Tutor
  const [selectedFieldId, setSelectedFieldId] = useState(''); // ID môn đang chọn
  const [slots, setSlots] = useState([]); // Danh sách slots
  
  // State UI
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State Form Create
  const [newSlot, setNewSlot] = useState({
    date: '',
    time: ''
  });

  // --- 1. KHỞI TẠO: LẤY DANH SÁCH MÔN HỌC ---
  useEffect(() => {
    const initData = async () => {
      try {
        const [profileRes, publicFieldsRes] = await Promise.all([
          getTutorProfile(),
          getFields()
        ]);

        const tutorFieldIds = profileRes.meta.tutorInfo.LINHVUC; 
        const allFields = publicFieldsRes.meta.fieldList; 

        // Lọc và map tên môn học
        const availableFields = allFields
          .filter(f => tutorFieldIds.includes(f.LINHVUCID))
          .map(f => ({
            id: f.LINHVUCID,
            name: f.TENLINHVUC
          }));

        console.log(availableFields)

        setMyFields(availableFields);

        if (availableFields.length > 0) {
          setSelectedFieldId(availableFields[0].id);
        }
      } catch (error) {
        console.error("Lỗi khởi tạo:", error);
      }
    };
    initData();
  }, []);

  // --- 2. FETCH SLOTS KHI ĐỔI MÔN ---
  useEffect(() => {
    if (!selectedFieldId) return;
    fetchSlots();
  }, [selectedFieldId]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      console.log(selectedFieldId)
      const res = await getTutorSlots(selectedFieldId);
      console.log(res.meta)
      setSlots(res.meta); 
    } catch (error) {
      console.error("Lỗi lấy slots:", error);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. XỬ LÝ TẠO SLOT ---
  const handleCreateSlot = async () => {
    if (!newSlot.date || !newSlot.time) {
      alert("Vui lòng chọn đầy đủ ngày và giờ!");
      return;
    }

    try {
      // Gọi API createSlots(fieldId, date, time)
      await createSlots(selectedFieldId, newSlot.date, newSlot.time);
      
      alert("Tạo lịch thành công!");
      setIsModalOpen(false);
      setNewSlot({ date: '', time: '' }); // Reset form
      fetchSlots(); // Reload danh sách
    } catch (error) {
      console.error("Lỗi tạo slot:", error);
      alert("Không thể tạo slot. Vui lòng thử lại.");
    }
  };

  // --- 4. XỬ LÝ XÓA SLOT ---
  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lịch này không?")) return;

    try {
      await deleteSlots(slotId);
      fetchSlots(); // Reload sau khi xóa
    } catch (error) {
      console.error("Lỗi xóa slot:", error);
      alert("Xóa thất bại.");
    }
  };

  // --- HELPERS FORMAT ---
  const formatTimeDisplay = (isoString) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDateDisplay = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric'});
  };

  return (
    <div className="dashboard-page-container">
      {/* SIDEBAR (Giữ nguyên) */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img src={dashboardPreview} alt="Logo" />
          <span>Hệ thống Lịch</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/app/tutor/overview" className="nav-link"><FiHome /><span>Tổng quan</span></NavLink>
          <NavLink to="/app/tutor/schedule" className="nav-link"><FiCalendar /><span>Lịch dạy</span></NavLink>
          <NavLink to="/app/tutor/slots" className="nav-link active"><FiPlusSquare /><span>Quản lý Slots</span></NavLink>
          <NavLink to="/app/tutor/settings" className="nav-link"><FiSettings /><span>Cài đặt</span></NavLink>
        </nav>
      </aside>

      <div className="dashboard-main-content">
        <header className="dashboard-header">
          <h1 className="header-title">Quản lý Lịch rảnh</h1>
          <div className="header-actions">
            <div className="user-profile">
               <img src="https://via.placeholder.com/40" alt="Avatar" />
               <div className="user-info"><span>Giảng viên</span></div>
            </div>
          </div>
        </header>

        <main className="dashboard-page-content slots-page-content">
          
          {/* 1. DROPDOWN CHỌN LĨNH VỰC */}
          <div className="field-selector-container">
            <label>Chọn môn giảng dạy:</label>
            <select 
              className="field-dropdown"
              value={selectedFieldId}
              onChange={(e) => setSelectedFieldId(e.target.value)}
            >
              {myFields.length === 0 && <option value="">Đang tải môn học...</option>}
              {myFields.map(field => (
                <option key={field.id} value={field.id}>{field.name}</option>
              ))}
            </select>
          </div>

          {/* 2. DANH SÁCH SLOTS */}
          <div className="slots-list-container">
            {loading ? (
              <p className="loading-text">Đang tải danh sách...</p>
            ) : slots.length > 0 ? (
              slots.map((slot, index) => (
                <div key={slot.ID || index} className="slot-card">
                  <div className="slot-info">
                    <h4 className="slot-title">{slot.mon}</h4>
                    <div className="slot-meta">
                      <span className="slot-time">
                        <FiClock /> {<p>Ngày: {slot.ngay} - Giờ: {slot.gio}</p>}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="btn-delete-slot" 
                    onClick={() => handleDeleteSlot(slot.ID)}
                    title="Xóa lịch này"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-slots">Chưa có lịch nào cho môn này.</div>
            )}
          </div>

          {/* 3. NÚT TẠO MỚI (TRÒN Ở GIỮA) */}
          <div className="add-button-container">
            <button className="btn-circle-add" onClick={() => setIsModalOpen(true)}>
              <FiPlus />
            </button>
            <p className="add-hint">Tạo lịch mới</p>
          </div>

        </main>

        {/* 4. MODAL TẠO LỊCH */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content slot-modal">
              <div className="modal-header">
                <h3>Tạo lịch mới: {myFields.find(f => f.id == selectedFieldId)?.name}</h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}><FiX /></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Ngày diễn ra</label>
                  <input 
                    type="date" 
                    value={newSlot.date}
                    onChange={(e) => setNewSlot({...newSlot, date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Giờ bắt đầu</label>
                  <input 
                    type="time" 
                    value={newSlot.time}
                    onChange={(e) => setNewSlot({...newSlot, time: e.target.value})}
                  />
                </div>
                <button className="btn-submit-slot" onClick={handleCreateSlot}>
                  Xác nhận tạo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorSlotsPage;