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
      setUsers(response.data);
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
      status: user.status
    });
    setEditModalVisible(true);
  };

  // Hiển thị modal thêm mới
  const showAddModal = () => {
    addForm.resetFields();
    setAddModalVisible(true);
  };

  // Cập nhật người dùng
  const handleUpdate = async (values) => {
    try {
      await api.put(`/user/${selectedUser.id}`, values);
      message.success('Cập nhật thông tin thành công');
      setEditModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      message.error('Cập nhật thông tin thất bại');
    }
  };

  // Thêm người dùng mới
  const handleAdd = async (values) => {
    try {
      // Đây là giả định API endpoint, backend của bạn cần có API này
      await api.post('/user/register', {
        ...values,
        role: 'MEMBER'
      });
      message.success('Thêm người dùng thành công');
      setAddModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to add user:', error);
      message.error('Thêm người dùng thất bại');
    }
  };

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

  // Xóa người dùng (thực tế là cập nhật trạng thái BAN)
  const handleDelete = async (userId) => {
    try {
      await api.delete(`/user/${userId}`);
      message.success('Người dùng đã bị cấm');
      fetchUsers();
    } catch (error) {
      console.error('Failed to ban user:', error);
      message.error('Không thể cấm người dùng');
    }
  };

  // Render tag màu theo trạng thái
  const renderStatusTag = (status) => {
    let color = 'green';
    if (status === 'UNVERIFIED') color = 'orange';
    if (status === 'BANNED' || status === 'BAN') color = 'red';
    
    return (
      <Tag color={color}>
        {status === 'VERIFIED' ? 'Đã xác minh' : 
         status === 'UNVERIFIED' ? 'Chưa xác minh' : 
         status === 'BANNED' || status === 'BAN' ? 'Bị cấm' : status}
      </Tag>
    );
  };

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
      render: renderStatusTag,
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
          <Popconfirm
            title="Cấm người dùng này?"
            description="Hành động này sẽ cấm người dùng, bạn có chắc chắn không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Quản lý người dùng</h1>
        <Button 
          type="primary" 
          icon={<UserAddOutlined />} 
          onClick={showAddModal}
         
        >
          Thêm người dùng
        </Button>
      </div>

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
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Select.Option value="VERIFIED">Đã xác minh</Select.Option>
              <Select.Option value="UNVERIFIED">Chưa xác minh</Select.Option>
              <Select.Option value="BAN">Bị cấm</Select.Option>
            </Select>
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
      <Modal
        title="Thêm người dùng mới"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={handleAdd}
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
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            initialValue="VERIFIED"
          >
            <Select>
              <Select.Option value="VERIFIED">Đã xác minh</Select.Option>
              <Select.Option value="UNVERIFIED">Chưa xác minh</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item className="flex justify-end">
            <Button type="default" onClick={() => setAddModalVisible(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#ff85a2', borderColor: '#ff85a2' }}>
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;