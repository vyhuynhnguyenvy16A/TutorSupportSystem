import axios from 'axios';

const API_URL = 'http://localhost:3069';

export const getStudentProfile = async () => {
  const token = localStorage.getItem('token');
  
  // Kiểm tra nếu chưa có token thì báo lỗi hoặc xử lý redirect (tùy logic)
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await axios.get(`${API_URL}/student/profile`, {
    headers: {
      Authorization: `Bearer ${token}` 
    }
  });

  return response.data;
};

export const updateStudentProfile = async (updatedData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("No access token found");

  // updatedData cần đúng format: { hoTen, ngaySinh, gioiTinh, soCMND, soDienThoai, lichranh }
  const response = await axios.put(`${API_URL}/student/profile`, updatedData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
};

export const submitRegistration = async (data) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("No access token found");

  // data gồm: { dotId, linhVucId, nhuCauHoTro, thanhTich }
  const response = await axios.post(`${API_URL}/student/applications`, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};