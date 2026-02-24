import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const login = (email, password) =>
    axios.post(`${API_URL}/login`, {email, password})

export const getHistory = (token) =>
    axios.get(`${API_URL}/history`, { headers: { Authorization: token } });

export const saveHistory = (token, data) =>
    axios.post(`${API_URL}/history`, data, { headers: { Authorization: token } });

export const deleteHistory = (token, ids) =>
    axios.delete(`${API_URL}/history`, { headers: { Authorization: token }, data: { ids } });