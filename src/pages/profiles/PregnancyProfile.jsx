import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Button, message, Table, Space, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import pregnancyProfileApi from '../services/api.pregnancyProfile';
import moment from 'moment';

const { Option } = Select;

const PregnancyProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  // Fetch profiles
  const fetchProfiles = async () => {
    try {
      const data = await pregnancyProfileApi.getAllProfiles();
      setProfiles(data);
    } catch (error) {
      message.error('Không thể tải thông tin thai kỳ');
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Table columns
  const columns = [
    {
      title: 'Tên em bé',
      dataIndex: 'babyName',
      key: 'babyName',
    },
    {
      title: 'Giới tính',
      dataIndex: 'babyGender',
      key: 'babyGender',
      render: (gender) => gender === 'MALE' ? 'Nam' : 'Nữ',
    },
    {
      title: 'Ngày dự sinh',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Tuần thai',
      dataIndex: 'currentWeek',
      key: 'currentWeek',
    },
    {
      title: 'Kỳ kinh cuối',
      dataIndex: 'lastPeriod',
      key: 'lastPeriod',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Chiều cao (cm)',
      dataIndex: 'height',
      key: 'height',
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
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // Handle create/edit
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      // Convert dates to ISO string format
      const formattedValues = {
        ...values,
        dueDate: values.dueDate.toISOString(),
        lastPeriod: values.lastPeriod.toISOString(),
      };

      if (editingId) {
        await pregnancyProfileApi.updateProfile(editingId, formattedValues);
        message.success('Cập nhật thông tin thành công');
      } else {
        await pregnancyProfileApi.createProfile(formattedValues);
        message.success('Thêm thông tin thành công');
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchProfiles();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      dueDate: moment(record.dueDate),
      lastPeriod: moment(record.lastPeriod),
    });
    setIsModalVisible(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await pregnancyProfileApi.deleteProfile(id);
      message.success('Xóa thông tin thành công');
      fetchProfiles();
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Thông Tin Thai Kỳ</h1>
        <Button 
          type="primary"
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Thêm Mới
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={profiles}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingId ? "Cập nhật thông tin thai kỳ" : "Thêm thông tin thai kỳ"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="babyName"
            label="Tên em bé"
            rules={[{ required: true, message: 'Vui lòng nhập tên em bé' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="babyGender"
            label="Giới tính"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
          >
            <Select>
              <Option value="MALE">Nam</Option>
              <Option value="FEMALE">Nữ</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Ngày dự sinh"
            rules={[{ required: true, message: 'Vui lòng chọn ngày dự sinh' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="currentWeek"
            label="Tuần thai"
            rules={[{ required: true, message: 'Vui lòng nhập tuần thai' }]}
          >
            <InputNumber min={1} max={42} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="lastPeriod"
            label="Kỳ kinh cuối"
            rules={[{ required: true, message: 'Vui lòng chọn kỳ kinh cuối' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="height"
            label="Chiều cao (cm)"
            rules={[{ required: true, message: 'Vui lòng nhập chiều cao' }]}
          >
            <InputNumber min={0.1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item className="text-right">
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PregnancyProfile; 