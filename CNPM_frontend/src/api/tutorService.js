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

export const updateTutorLinhvuc = async (updatedData) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("No access token found");

    const response = await axios.post(`${API_URL}/tutor/fields`, updatedData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.data;
}

export const getTutorBookings = async () => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No access token found')

    const response = await axios.get(`${API_URL}/tutor/bookings`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.data
}

export const getTutorSlots = async (fieldID) => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No access token found')
    
    const response = await axios.get(`${API_URL}/tutor/me/slots`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        params: {
            search: fieldID
        }
    })

    return response.data
}

export const createSlots = async (fieldId, date, time) => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No access token found')

    const response = await axios.post(`${API_URL}/tutor/slots`, {
        mon: fieldId,
        ngay: date,
        gio: time
    }, 
    {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.data
}


export const deleteSlots = async (slotID) => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No access token found')

    const response = await axios.delete(`${API_URL}/tutor/slots/${slotID}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.data
}