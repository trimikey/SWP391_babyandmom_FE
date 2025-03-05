import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import api from '../../config/axios';

function ManageUser() {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/user');
      setUsers(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách người dùng');
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/user/${userId}`);
      message.success('Xóa người dùng thành công');
      fetchUsers();
    } catch (error) {
      message.error('Không thể xóa người dùng');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingUser) {
        await api.put(`/user/${editingUser.id}`, values);
        message.success('Cập nhật người dùng thành công');
      } else {
        await api.post('/user', values);
        message.success('Thêm người dùng thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
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
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={handleAdd}
        >
          Thêm người dùng
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{ 
          pageSize: 10,
          showTotal: (total) => `Tổng số ${total} người dùng`,
        }}
        loading={loading}
      />

      <Modal
        title={editingUser ? "Sửa thông tin người dùng" : "Thêm người dùng mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input />
          </Form.Item>

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
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^0\d{9}$/, message: 'Số điện thoại không hợp lệ!' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="password"
            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}

          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageUser;