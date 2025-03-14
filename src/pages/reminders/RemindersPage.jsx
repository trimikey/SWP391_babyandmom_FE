import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, Modal, Form, Input, Select, DatePicker, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import api from '../../config/axios';
import { useNavigate } from 'react-router-dom';
import locale from 'antd/es/date-picker/locale/vi_VN';
import 'moment/locale/vi';

const { TextArea } = Input;
const { Option } = Select;

// Ánh xạ loại nhắc nhở sang tiếng Việt
const reminderTypeLabels = {
  DOCTOR_APPOINTMENT: 'Cuộc hẹn với bác sĩ',
  VACCINATION: 'Tiêm chủng',
  MEDICAL_TEST: 'Xét nghiệm y tế',
  PRENATAL_CHECKUP: 'Khám thai định kỳ',
  CUSTOM: 'Tùy chỉnh'
};

// Màu sắc cho các loại nhắc nhở
const reminderTypeColors = {
  DOCTOR_APPOINTMENT: 'blue',
  VACCINATION: 'green',
  MEDICAL_TEST: 'purple',
  PRENATAL_CHECKUP: 'orange',
  CUSTOM: 'gray'
};

// Cấu hình moment sử dụng locale tiếng Việt
moment.locale('vi');

const RemindersPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reminderTypes, setReminderTypes] = useState([]);
  const [pregnancyProfiles, setPregnancyProfiles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    let isActive = true;
    
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập để xem lời nhắc');
        navigate('/login');
        return;
      }
      
      try {
        const response = await api.get('/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (isActive) {
          setCurrentUser(response.data);
          setIsMounted(true);
        }
      } catch (error) {
        console.error('Auth error:', error);
        if (isActive) {
          message.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    
    checkAuth();
    
    return () => {
      isActive = false;
    };
  }, [navigate]);

  useEffect(() => {
    if (isMounted && currentUser) {
      fetchReminders();
      fetchReminderTypes();
      fetchPregnancyProfiles();
    }
  }, [isMounted, currentUser]);

  useEffect(() => {
    const handleFocus = () => {
      if (isMounted && currentUser) {
        fetchReminders();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isMounted && currentUser) {
        fetchReminders();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isMounted, currentUser]);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const timestamp = new Date().getTime();
      const response = await api.get(`/reminder?t=${timestamp}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { cache: false }
      });
      
      console.log('Fetched reminders:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setReminders(response.data);
      } else {
        setReminders([]);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
      message.error('Không thể tải danh sách lời nhắc');
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReminderTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/reminder/enum/types', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data && Array.isArray(response.data)) {
        setReminderTypes(response.data);
      } else {
        console.error('Invalid reminder types format:', response.data);
        setReminderTypes([
          'DOCTOR_APPOINTMENT',
          'VACCINATION',
          'MEDICAL_TEST',
          'PRENATAL_CHECKUP',
          'CUSTOM'
        ]);
      }
    } catch (error) {
      console.error('Error fetching reminder types:', error);
      setReminderTypes([
        'DOCTOR_APPOINTMENT',
        'VACCINATION',
        'MEDICAL_TEST',
        'PRENATAL_CHECKUP',
        'CUSTOM'
      ]);
    }
  };

  const fetchPregnancyProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/pregnancy-profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data && Array.isArray(response.data)) {
        setPregnancyProfiles(response.data);
      }
    } catch (error) {
      console.error('Error fetching pregnancy profiles:', error);
    }
  };

  const showAddModal = () => {
    setEditingReminder(null);
    form.resetFields();
    form.setFieldsValue({
      reminderDateTime: moment(),
      pregnancyId: pregnancyProfiles.length > 0 ? pregnancyProfiles[0].id : null
    });
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingReminder(record);
    form.setFieldsValue({
      title: record.title,
      type: record.type,
      reminderDateTime: moment(record.reminderDateTime),
      description: record.description,
      pregnancyId: record.pregnancyId
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingReminder(null);
  };

  const handleSave = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const data = {
        ...values,
        reminderDateTime: values.reminderDateTime.format('YYYY-MM-DD')
      };

      if (editingReminder) {
        await api.put(`/reminder/${editingReminder.id}`, data, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        await api.post('/reminder', data, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      await fetchReminders();
      message.success(editingReminder ? 'Cập nhật lời nhắc thành công' : 'Tạo lời nhắc thành công');
      handleCancel();
    } catch (error) {
      console.error('Error saving reminder:', error);
      message.error('Có lỗi xảy ra khi lưu lời nhắc');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/reminder/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchReminders();
      message.success('Xóa lời nhắc thành công');
    } catch (error) {
      console.error('Error deleting reminder:', error);
      message.error('Có lỗi xảy ra khi xóa lời nhắc');
    }
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Loại lời nhắc',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={reminderTypeColors[type] || 'default'}>
          {reminderTypeLabels[type] || type}
        </Tag>
      ),
      filters: reminderTypes.map(type => ({
        text: reminderTypeLabels[type] || type,
        value: type
      })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Ngày nhắc',
      dataIndex: 'reminderDateTime',
      key: 'reminderDateTime',
      render: (date) => moment(date).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.reminderDateTime).unix() - moment(b.reminderDateTime).unix(),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
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
            title="Bạn có chắc chắn muốn xóa lời nhắc này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const datePickerConfig = {
    superNextIcon: null,
    superPrevIcon: null,
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <Card
        title="Quản lý lời nhắc"
        extra={
          <button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showAddModal}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-1 px-2   rounded-lg"
          >
            Thêm lời nhắc
          </button>
        }
      >
        <Table
          columns={columns}
          dataSource={reminders}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={(pagination) => setPagination(pagination)}
        />
      </Card>

      <Modal
        title={editingReminder ? "Chỉnh sửa lời nhắc" : "Thêm lời nhắc mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề lời nhắc" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại lời nhắc"
            rules={[{ required: true, message: 'Vui lòng chọn loại lời nhắc' }]}
          >
            <Select placeholder="Chọn loại lời nhắc">
              {reminderTypes.map(type => (
                <Option key={type} value={type}>
                  {reminderTypeLabels[type] || type}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="reminderDateTime"
            label="Ngày nhắc"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker 
              format="DD/MM/YYYY" 
              style={{ width: '100%' }}
              placeholder="Chọn ngày nhắc"
              locale={locale}
              components={datePickerConfig}
              disabledDate={(current) => {
                return current && current < moment().startOf('day');
              }}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea 
              rows={4} 
              placeholder="Nhập mô tả chi tiết (không bắt buộc)"
            />
          </Form.Item>

          <Form.Item
            name="pregnancyId"
            label="Hồ sơ thai kỳ"
            rules={[{ required: true, message: 'Vui lòng chọn hồ sơ thai kỳ' }]}
          >
            <Select placeholder="Chọn hồ sơ thai kỳ">
              {pregnancyProfiles.map(profile => (
                <Option key={profile.id} value={profile.id}>
                  {profile.babyName || `Thai kỳ #${profile.id}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="text-right">
            <Space>
              <Button onClick={handleCancel}>Hủy</Button>
              <button type="primary" htmlType="submit" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-1 px-3 rounded-lg">
                {editingReminder ? 'Cập nhật' : 'Tạo'}
              </button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RemindersPage; 