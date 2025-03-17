import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Modal, Form, message, Select, Tooltip, Typography, Tag } from 'antd';
import { SearchOutlined, DeleteOutlined, EditOutlined, EyeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import api from '../../config/axios';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

const CommentManagement = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  // Fetch tất cả các blog để lọc
  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      message.error('Không thể tải danh sách bài viết');
    }
  };

  // Fetch comments cho blog được chọn hoặc tất cả các blog
  const fetchComments = async () => {
    setLoading(true);
    try {
      if (selectedBlogId) {
        const response = await api.get(`/comments/${selectedBlogId}`);
        setComments(response.data);
      } else {
        // Fetch tất cả comments từ tất cả blogs
        const blogResponses = await Promise.all(
          blogs.map(blog => api.get(`/comments/${blog.id}`))
        );
        
        // Gộp tất cả comments
        const allComments = blogResponses.flatMap(response => response.data);
        setComments(allComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      message.error('Không thể tải bình luận');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (blogs.length > 0) {
      fetchComments();
    }
  }, [blogs, selectedBlogId]);

  const handleDelete = (commentId) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa bình luận này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          await api.delete(`/comments/${commentId}`);
          message.success('Xóa bình luận thành công');
          fetchComments();
        } catch (error) {
          console.error('Error deleting comment:', error);
          message.error('Không thể xóa bình luận');
        }
      },
    });
  };

  const handleEdit = (comment) => {
    setCurrentComment(comment);
    form.setFieldsValue({
      content: comment.content
    });
    setEditModalVisible(true);
  };

  const handleView = (comment) => {
    setCurrentComment(comment);
    setViewModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await api.put(`/comments/${currentComment.id}`, {
        content: values.content
      });
      message.success('Cập nhật bình luận thành công');
      setEditModalVisible(false);
      fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
      message.error('Không thể cập nhật bình luận');
    }
  };

  const handleBlogChange = (value) => {
    setSelectedBlogId(value);
  };

  

  const formatDate = (dateString) => {
    return moment(dateString).format('DD/MM/YYYY HH:mm:ss');
  };

  // Cắt ngắn nội dung bình luận để hiển thị tốt hơn trong bảng
  const truncateContent = (content, maxLength = 50) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Bài viết ID',
      dataIndex: 'blogId',
      key: 'blogId',
      width: 100,
    },
    {
      title: 'Người dùng',
      dataIndex: 'userName',
      key: 'userName',
      width: 150,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      render: (text) => (
        <Tooltip title={text}>
          <div>{truncateContent(text)}</div>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => formatDate(text),
      width: 180,
    },
    {
      title: 'Cập nhật gần nhất',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => formatDate(text),
      width: 180,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            type="primary"
            ghost
          >
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="primary"
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Quản lý bình luận</h1>
        <div className="flex gap-4 mb-4">
          <Select
            style={{ width: 300 }}
            placeholder="Chọn bài viết để lọc"
            onChange={handleBlogChange}
            allowClear
          >
            {blogs.map(blog => (
              <Option key={blog.id} value={blog.id}>
                {blog.title || `Blog #${blog.id}`}
              </Option>
            ))}
          </Select>
       
          <Button type="primary" onClick={fetchComments}>
            Làm mới
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={searchText ? handleSearch() : comments}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Modal chỉnh sửa bình luận */}
      <Modal
        title="Chỉnh sửa bình luận"
        visible={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setEditModalVisible(false)}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập nội dung bình luận',
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết bình luận */}
      <Modal
        title="Chi tiết bình luận"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {currentComment && (
          <div>
            <p>
              <strong>ID:</strong> {currentComment.id}
            </p>
            <p>
              <strong>Bài viết ID:</strong> {currentComment.blogId}
            </p>
            <p>
              <strong>Người dùng ID:</strong> {currentComment.userId}
            </p>
            <p>
              <strong>Tên người dùng:</strong> {currentComment.userName}
            </p>
            <div>
              <strong>Nội dung:</strong>
              <div className="p-3 mt-2 bg-gray-50 rounded border">
                {currentComment.content}
              </div>
            </div>
            <p className="mt-3">
              <strong>Ngày tạo:</strong> {formatDate(currentComment.createdAt)}
            </p>
            <p>
              <strong>Cập nhật gần nhất:</strong> {formatDate(currentComment.updatedAt)}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CommentManagement; 