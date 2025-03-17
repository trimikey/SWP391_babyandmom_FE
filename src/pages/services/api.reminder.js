import api from '../../config/axios';

const reminderApi = {
  /**
   * Lấy tất cả nhắc nhở
   * @returns {Promise<Array>} Danh sách nhắc nhở
   */
  getAllReminders: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get('/reminder', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching reminders:', error)
      throw error;
    }
  },

  /**
   * Lấy nhắc nhở theo ID   
   * @param {number} id - ID của nhắc nhở
   * @returns {Promise<Object>} Thông tin nhắc nhở
   */
  getReminderById: async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get(`/reminder/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching reminder:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách các loại nhắc nhở
   * @returns {Promise<Array>} Danh sách các loại nhắc nhở
   */
  getReminderTypes: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get('/reminder/enum/types', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching reminder types:', error);
      throw error;
    }
  },

  /**
   * Tạo nhắc nhở mới
   * @param {Object} reminderData - Dữ liệu nhắc nhở
   * @returns {Promise<Object>} Nhắc nhở đã tạo
   */
  createReminder: async (reminderData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.post('/reminder', reminderData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  },

  /**
   * Cập nhật nhắc nhở
   * @param {number} id - ID của nhắc nhở
   * @param {Object} reminderData - Dữ liệu nhắc nhở cập nhật
   * @returns {Promise<Object>} Nhắc nhở đã cập nhật
   */
  updateReminder: async (id, reminderData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.put(`/reminder/${id}`, reminderData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }
  },

  /**
   * Xóa nhắc nhở
   * @param {number} id - ID của nhắc nhở
   * @returns {Promise<string>} Thông báo kết quả
   */
  deleteReminder: async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.delete(`/reminder/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  }
};

export default reminderApi; 