import axios from "axios"
import { configs } from "eslint-plugin-react-refresh"
import { data } from "react-router-dom"

const API_URL = "http://localhost:3069"

export const getPairing = async (batchID) => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error("No access token found")
    
    const response = await axios.get(`${API_URL}/admin/pairings`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }, 
        params: {
            batch_id: batchID
        }
    })

    return response.data
}

export const matchAI = async (batchID) => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No access token found')
    
    const response = await axios.post(`${API_URL}/admin/pairings/run-ai`, {
        batchId: batchID
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.data
}

export const editPairings = async (GHEPCAPID, tutorID) => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No access token found')
    
    const response = await axios.put(`${API_URL}/admin/pairings/${GHEPCAPID}`, {
        TUTORID: tutorID
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.data
}

export const approvePairing = async (GHEPCAPID) => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No access token found')

    const response = await axios.post(`${API_URL}/admin/pairings/${GHEPCAPID}/approve`,{}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.data
}

export const rejectPairing = async (GHEPCAPID) => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No access token found')

    const response = await axios.post(`${API_URL}/admin/pairings/${GHEPCAPID}/reject`,{}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.data
}

export const getApplyForm = async (batchID) => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No access token found')

    const response = await axios.get(`${API_URL}/admin/forms/${batchID}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.data
}