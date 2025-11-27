import axios from 'axios';

const API_URL = 'http://localhost:3069';

export const getTutorProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("No access token found");

    const response = await axios.get(`${API_URL}/tutor/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return response.data;
}

export const updateTutorProfile = async (updatedData) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("No access token found");

    const response  = await axios.put(`${API_URL}/tutor/profile`, updatedData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.data;
}