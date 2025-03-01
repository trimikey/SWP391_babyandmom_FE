import api from '../../config/axios';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

const pregnancyProfileApi = {
    // Lấy danh sách pregnancy profile
    getAllProfiles: async () => {
        try {
            const response = await api.get('/pregnancy-profile', getAuthHeader());
            return response.data;
        } catch (error) {
            console.error('Error fetching profiles:', error);
            throw error;
        }
    },

    // Tạo mới pregnancy profile
    createProfile: async (data) => {
        try {
            const response = await api.post('/pregnancy-profile', data, getAuthHeader());
            console.log('Create profile response:', response); // Debug log
            return response.data;
        } catch (error) {
       ; // Debug log
            throw error;
        }
    },

    // Cập nhật pregnancy profile
    updateProfile: async (id, data) => {
        try {
            const response = await api.put(`/pregnancy-profile/${id}`, data, getAuthHeader());
            return response.data;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    // Xóa pregnancy profile
    deleteProfile: async (id) => {
        try {
            const response = await api.delete(`/pregnancy-profile/${id}`, getAuthHeader());
            return response.data;
        } catch (error) {
            console.error('Error deleting profile:', error);
            throw error;
        }
    }
};

export default pregnancyProfileApi; 