import api from '../config/axios';

const faqApi = {
    // Lấy tất cả FAQ
    getAllFAQs: async () => {
        try {
            const response = await api.get('/faqs');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy FAQ theo ID
    getFAQById: async (id) => {
        try {
            const response = await api.get(`/faqs/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Tạo FAQ mới
    createFAQ: async (faqData) => {
        try {
            const response = await api.post('/faqs', faqData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật FAQ
    updateFAQ: async (id, faqData) => {
        try {
            const response = await api.put(`/faqs/${id}`, faqData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Xóa FAQ
    deleteFAQ: async (id) => {
        try {
            const response = await api.delete(`/faqs/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy FAQ đang active
    getActiveFAQs: async () => {
        try {
            const response = await api.get('/faqs');
            // Lọc và sắp xếp FAQ theo displayOrder
            return response.data
                .filter(faq => faq.isActive)
                .sort((a, b) => a.displayOrder - b.displayOrder);
        } catch (error) {
            throw error;
        }
    }
};

export default faqApi;
