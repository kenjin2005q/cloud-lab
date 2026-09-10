import axios from 'axios';

// Cấu hình API URL
// Sử dụng localhost nếu chạy cùng máy, hoặc URL Codespaces nếu chạy trên cloud
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Tạo axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============ API Functions ============

// Lấy danh sách sinh viên
export const getStudents = async () => {
    try {
        const response = await api.get('/students');
        return response;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};

// Tạo sinh viên mới
export const createStudent = async (studentData) => {
    try {
        const response = await api.post('/students', studentData);
        return response;
    } catch (error) {
        console.error('Error creating student:', error);
        throw error;
    }
};

// Cập nhật sinh viên
export const updateStudent = async (id, studentData) => {
    try {
        const response = await api.put(`/students/${id}`, studentData);
        return response;
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
};

// Xóa sinh viên
export const deleteStudent = async (id) => {
    try {
        const response = await api.delete(`/students/${id}`);
        return response;
    } catch (error) {
        console.error('Error deleting student:', error);
        throw error;
    }
};

// Lấy sinh viên theo ID
export const getStudentById = async (id) => {
    try {
        const response = await api.get(`/students/${id}`);
        return response;
    } catch (error) {
        console.error('Error fetching student:', error);
        throw error;
    }
};

export default api;