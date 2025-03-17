import api from '../../config/axios';

const commentApi = {
  /**
   * Lấy tất cả bình luận của một bài viết
   * @param {number} blogId - ID của bài viết
   * @returns {Promise<Array>} Danh sách bình luận
   */
  getCommentsByBlogId: async (blogId) => {
    try {
      const response = await api.get(`/comments/${blogId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  /**
   * Tạo bình luận mới
   * @param {number} blogId - ID của bài viết
   * @param {string} content - Nội dung bình luận
   * @returns {Promise<Object>} Bình luận đã tạo
   */
  createComment: async (blogId, content) => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.post(
        `/comments/blog/${blogId}`,
        { content },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  /**
   * Cập nhật bình luận
   * @param {number} commentId - ID của bình luận
   * @param {string} content - Nội dung bình luận mới
   * @returns {Promise<Object>} Bình luận đã cập nhật
   */
  updateComment: async (commentId, content) => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.put(
        `/comments/${commentId}`,
        { content },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  /**
   * Xóa bình luận
   * @param {number} commentId - ID của bình luận
   * @returns {Promise<string>} Thông báo kết quả
   */
  deleteComment: async (commentId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.delete(
        `/comments/${commentId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};

export default commentApi; 