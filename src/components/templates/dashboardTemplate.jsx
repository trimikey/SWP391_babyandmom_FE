import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message } from 'antd';
import api from '../../config/axios';

const MembershipPackages = () => {
  const [packages, setPackages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  // Fetch packages
  const fetchPackages = async () => {
    try {
      const response = await api.get('/api/membership-packages');
      setPackages(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách gói thành viên');
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Table columns
  const columns = [
    {
      title: 'Loại gói',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Tính năng',
      dataIndex: 'features',
      key: 'features',
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => price.toLocaleString('vi-VN'),
    },
    {
      title: 'Thời hạn (tháng)',
      dataIndex: 'durationInMonths',
      key: 'durationInMonths',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  // Handle create/edit
  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await api.put(`/api/membership-packages/${editingId}`, values);
        message.success('Cập nhật gói thành công');
      } else {
        await api.post('/api/membership-packages', values);
        message.success('Tạo gói thành công');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchPackages();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  // Handle edit
  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/membership-packages/${id}`);
      message.success('Xóa gói thành công');
      fetchPackages();
    } catch (error) {
      message.error('Không thể xóa gói');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý gói thành viên</h1>
        <Button type="primary" onClick={() => {
          setEditingId(null);
          form.resetFields();
          setIsModalVisible(true);
        }}>
          Thêm gói mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={packages}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? "Sửa gói thành viên" : "Thêm gói thành viên mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingId(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="type"
            label="Loại gói"
            rules={[{ required: true, message: 'Vui lòng nhập loại gói' }]}
          >
            <Input placeholder="VD: Gói Cơ bản, Gói Premium..." />
          </Form.Item>

          <Form.Item
            name="features"
            label="Tính năng"
            rules={[{ required: true, message: 'Vui lòng nhập tính năng' }]}
          >
            <Input.TextArea
              placeholder="Mô tả các tính năng của gói"
              rows={4}
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="durationInMonths"
            label="Thời hạn (tháng)"
            rules={[{ required: true, message: 'Vui lòng nhập thời hạn' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              max={36}
            />
          </Form.Item>

          <Form.Item className="flex justify-end">
            <Button type="default" onClick={() => setIsModalVisible(false)} className="mr-2">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {editingId ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MembershipPackages;
