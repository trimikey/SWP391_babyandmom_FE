import api from '../../config/axios';

const blogApi = {
    // Lấy tất cả bài viết
    getAllPosts: async () => {
        try {
            const response = await api.get('/blogs');
            return response.data;
        } catch (error) {
            console.error('Error fetching blogs:', error);
            throw error;
        }
    },

    // Lấy bài viết theo ID
    getPostById: async (id) => {
        try {
            const response = await api.get(`/blogs/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching blog:', error);
            throw error;
        }
    },

    // Tạo bài viết mới
    createPost: async (data) => {
        try {
            const response = await api.post('/blogs', data);
            return response.data;
        } catch (error) {
            console.error('Error creating blog:', error);
            throw error;
        }
    },

    // Cập nhật bài viết
    updatePost: async (id, data) => {
        try {
            const response = await api.put(`/blogs/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating blog:', error);
            throw error;
        }
    },

    // Xóa bài viết
    deletePost: async (id) => {
        try {
            const response = await api.delete(`/blogs/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting blog:', error);
            throw error;
        }
    }
};

export default blogApi; 