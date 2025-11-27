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