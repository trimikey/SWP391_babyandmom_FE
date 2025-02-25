import api from '../../config/axios';

const userApi = {
    // Get all users
    getAllUsers: () => {
        return api.get('/users');
    },

    // Get user by ID
    getUserById: (id) => {
        return api.get(`/users/${id}`);
    },

    // Login
    login: (data) => {
        return api.post('/auth/login', data);
    },

    // Register
    register: (data) => {
        return api.post('/auth/register', data);
    },

    // Get user profile
    getProfile: () => {
        return api.get('/users/profile');
    },

    // Update user profile
    updateProfile: (data) => {
        return api.put('/users/profile', data);
    },

    // Change password
    changePassword: (data) => {
        return api.post('/users/change-password', data);
    },

    // Update user (admin)
    updateUser: (id, data) => {
        return api.put(`/users/${id}`, data);
    },

    // Delete user (admin)
    deleteUser: (id) => {
        return api.delete(`/users/${id}`);
    }
};

export default userApi; 