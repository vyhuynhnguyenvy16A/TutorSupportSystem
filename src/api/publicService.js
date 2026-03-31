import axios from 'axios';

const API_URL = 'http://localhost:3069';

// ... (Các hàm cũ getStudentProfile, updateStudentProfile giữ nguyên)

// 1. Lấy danh sách đợt đăng ký (Public)
export const getPairingBatches = async () => {
  const response = await axios.get(`${API_URL}/public/pairing-batches`);
  return response.data;
};

// 2. Lấy danh sách lĩnh vực (Public)
export const getFields = async () => {
  const response = await axios.get(`${API_URL}/public/fields`);
  return response.data;
};