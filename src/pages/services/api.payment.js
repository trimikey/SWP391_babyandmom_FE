import api from '../config/axios';

const paymentApi = {
  // Tạo đơn hàng mới
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/order/create', orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách đơn hàng theo trạng thái
  getOrdersByStatus: async (status) => {
    try {
      const response = await api.get(`/order/status/${status}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy tất cả đơn hàng
  getAllOrders: async () => {
    try {
      const response = await api.get('/order/all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng theo ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/order/${orderId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Hủy đơn hàng
  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`/order/cancel/${orderId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật trạng thái đơn hàng hết hạn
  updateExpiredOrders: async () => {
    try {
      const response = await api.put('/order/update-expired');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default paymentApi;