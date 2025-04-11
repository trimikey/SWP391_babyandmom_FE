import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import api from '../../config/axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  // Lấy danh sách người dùng
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/user');
      // Lọc ra những user chưa bị xóa (không có trạng thái BAN)
      const activeUsers = response.data.filter(user => user.status !== 'BAN');
      

      // Sắp xếp người dùng theo thời gian tạo mới nhất
      const sortedUsers = activeUsers.sort((a, b) => {
        // Nếu có trường createdAt hoặc createdDate, sử dụng nó để sắp xếp
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        // Nếu không có, sắp xếp theo ID (giả sử ID lớn hơn = mới hơn)
        return b.id - a.id;
      });
      
      setUsers(sortedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Hiển thị modal chỉnh sửa
  const showEditModal = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      userName: user.userName,
      email: user.email,
      phone: user.phone,
      status: user.status,
      });
    setEditModalVisible(true);
  };

  // Hiển thị modal thêm mới


  // Cập nhật người dùng
  const handleUpdate = async (values) => {
    try {
      const updateData = {
        userName: values.userName,
        email: values.email,
        phone: values.phone,
        status: values.status
      };

      await api.put(`/user/${selectedUser.id}`, updateData);
      message.success('Cập nhật thông tin thành công');
      setEditModalVisible(false);
      // Cập nhật lại danh sách người dùng ngay sau khi cập nhật thành công
      await fetchUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      message.error('Cập nhật thông tin thất bại');
    }
  };

  // Thêm người dùng mới
 

  // Cập nhật trạng thái người dùng
  const handleStatusChange = async (userId, status) => {
    try {
      await api.put(`/user/${userId}/status`, { status });
      message.success('Cập nhật trạng thái thành công');
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user status:', error);
      message.error('Cập nhật trạng thái thất bại');
    }
  };

  // Xóa người dùng (cập nhật trạng thái BAN)
  const handleDelete = async (userId) => {
    try {
      await api.delete(`/user/${userId}`);
      message.success('Người dùng đã bị cấm');
      // Cập nhật state users bằng cách lọc ra user vừa xóa
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Failed to ban user:', error);
      message.error('Không thể cấm người dùng');
    }
  };

  // Render tag màu theo trạng thái




  const columns = [
    {
      title: 'Tên người dùng',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record.id, value)}
          dropdownStyle={{ minWidth: '150px' }}
        >
          <Select.Option value="VERIFIED">
            <Tag>Đã xác minh</Tag>
          </Select.Option>
          <Select.Option value="UNVERIFIED">
            <Tag>Chưa xác minh</Tag>
          </Select.Option>
          <Select.Option value="BAN">
            <Tag>Bị cấm</Tag>
          </Select.Option>
        </Select>
      ),
      filters: [
        { text: 'Đã xác minh', value: 'VERIFIED' },
        { text: 'Chưa xác minh', value: 'UNVERIFIED' },
        { text: 'Bị cấm', value: 'BAN' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
          >
            Sửa
          </Button>
      
        </Space>
      ),
    },
  ];

  return (
    <div>
      

      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Modal chỉnh sửa người dùng */}
      <Modal
        title="Chỉnh sửa thông tin người dùng"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={selectedUser}
        >
         
            
         
         
          <Form.Item
            name="userName"
            label="Tên người dùng"
            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
          >
            <Input />
          </Form.Item>
          
          <Form.Item className="flex justify-end">
            <Button type="default" onClick={() => setEditModalVisible(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#ff85a2', borderColor: '#ff85a2' }}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal thêm người dùng mới */}
      
    </div>
  );
};

export default UserManagement;