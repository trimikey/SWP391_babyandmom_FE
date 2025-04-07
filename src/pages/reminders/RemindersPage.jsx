import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, Modal, Form, Input, Select, DatePicker, message, Popconfirm, Tag, Alert, Collapse, Checkbox, List, Divider, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, MailOutlined, ExclamationCircleOutlined, InfoCircleOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/vi_VN';
import api from '../../config/axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Paragraph, Title } = Typography;

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
  DOCTOR_APPOINTMENT: 'purple',
  VACCINATION: 'green',
  MEDICAL_TEST: 'blue',
  PRENATAL_CHECKUP: 'orange',
  CUSTOM: 'cyan'
};

// Cấu hình moment sử dụng locale tiếng Việt
moment.locale('vi');

// Danh sách các triệu chứng bất thường trong thai kỳ


const RemindersPage = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [reminderTypes, setReminderTypes] = useState([]);
  const [pregnancyProfiles, setPregnancyProfiles] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [checkingPremium, setCheckingPremium] = useState(true);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [visibleAdvice, setVisibleAdvice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          message.error('Vui lòng đăng nhập để xem lời nhắc');
          navigate('/login');
          return;
        }

        const userResponse = await api.get('/user/profile');

        console.log('User profile data:', userResponse.data);

        if (userResponse.data) {
          setCurrentUser(userResponse.data);
          
          await checkMembershipStatus(token);
        }
      } catch (error) {
        console.error('Auth error:', error);
        message.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    checkAuth();

    const onFocus = () => {
      if (currentUser) {
        const token = localStorage.getItem('token');
        if (token) {
          checkMembershipStatus(token);
        }
      }
    };

    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [navigate]);

  const checkMembershipStatus = async (token) => {
    try {
      setCheckingPremium(true);
      
      // First try the membership status endpoint
      try {
        const membershipResponse = await api.get('/reminder/membership/status');
        
        console.log('Membership status:', membershipResponse.data);
        
        if (membershipResponse.data && membershipResponse.data.isPremium === true) {
          setIsPremiumUser(true);
          fetchReminderTypes();
          fetchPregnancyProfiles();
          fetchReminders();
          return;
        }
      } catch (membershipError) {
        console.error('Error checking membership status:', membershipError);
      }
      
      // Fallback: Check orders for premium purchase using available endpoints
      try {
        // Log the current user info to debug
        const userResponse = await api.get('/user/profile');
        console.log('Current user:', userResponse.data);
        
        // Get all orders for the current user
        const ordersResponse = await api.get('/order/all');
        
        console.log('User orders:', ordersResponse.data);
        
        // Look for any PAID or ACTIVE order with premium package
        const hasPaidPremiumOrder = ordersResponse.data && 
          Array.isArray(ordersResponse.data) && 
          ordersResponse.data.some(order => {
            // Check if order is paid and contains premium subscription
            const orderIsPaid = order.status === 'PAID';
            console.log(`Order ${order.id} status: ${order.status} - isPaid: ${orderIsPaid}`);
            
            const isPremiumPackage = 
              // Check if subscription exists and has package info
              (order.subscription && 
               order.subscription.membershipPackage && 
               order.subscription.membershipPackage.type === 'PREMIUM') ||
              // Or check direct packageType field
              order.packageType === 'PREMIUM' ||
              // Or check type field
              order.type === 'PREMIUM';
            
            console.log(`Order ${order.id} isPremium: ${isPremiumPackage}`);
            
            return orderIsPaid && isPremiumPackage;
          });
        
        console.log('Has paid premium order:', hasPaidPremiumOrder);
        
        setIsPremiumUser(hasPaidPremiumOrder);
        
        if (hasPaidPremiumOrder) {
          fetchReminderTypes();
          fetchPregnancyProfiles();
          fetchReminders();
        } else {
          message.warning('Tính năng nhắc nhở chỉ dành cho người dùng gói PREMIUM');
        }
      } catch (orderError) {
        console.error('Error checking orders:', orderError);
        setIsPremiumUser(false);
        message.warning('Không thể xác định trạng thái gói PREMIUM');
      }
    } finally {
      setCheckingPremium(false);
    }
  };

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const timestamp = new Date().getTime();
      
      const response = await api.get(`/reminder?t=${timestamp}`);
      
      console.log('Fetched reminders:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        if (pregnancyProfiles.length > 0) {
          const filteredReminders = response.data.filter(reminder => 
            pregnancyProfiles.some(profile => profile.id === reminder.pregnancyId)
          );
          setReminders(filteredReminders);
        } else {
          setReminders(response.data);
        }
      } else {
        console.error('Invalid reminders data format:', response.data);
        setReminders([]);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
      if (error.response && error.response.status === 403) {
        message.error('Bạn cần nâng cấp lên gói PREMIUM để sử dụng tính năng này');
        setIsPremiumUser(false);
      } else {
        message.error('Không thể tải danh sách lời nhắc');
      }
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReminderTypes = async () => {
    try {
      // Since there's no API endpoint for reminder types, use hardcoded values
      const defaultTypes = [
        'DOCTOR_APPOINTMENT',
        'VACCINATION',
        'MEDICAL_TEST',
        'PRENATAL_CHECKUP',
        'CUSTOM'
      ];
      
      setReminderTypes(defaultTypes);
    } catch (error) {
      console.error('Error setting reminder types:', error);
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
      const response = await api.get('/pregnancy-profile');
      
      if (response.data && Array.isArray(response.data)) {
        setPregnancyProfiles(response.data);
        
        if (reminders.length > 0) {
          fetchReminders();
        }
      }
    } catch (error) {
      console.error('Error fetching pregnancy profiles:', error);
    }
  };

  const showAddModal = () => {
    if (!isPremiumUser) {
      message.warning('Tính năng này chỉ dành cho người dùng gói PREMIUM');
      return;
    }
    
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
        await api.put(`/reminder/${editingReminder.id}`, data)
      } else {
        await api.post('/reminder', data);
      }
      await fetchReminders();
      message.success(editingReminder 
        ? 'Cập nhật lời nhắc thành công' 
        : 'Tạo lời nhắc thành công. Bạn sẽ nhận được email nhắc nhở vào ngày đã chọn.');
      handleCancel();
    } catch (error) {
      console.error('Error saving reminder:', error);
      if (error.response && error.response.status === 403) {
        message.error('Bạn cần nâng cấp lên gói PREMIUM để sử dụng tính năng này');
        setIsPremiumUser(false);
        setIsModalVisible(false);
      } else {
        message.error('Có lỗi xảy ra khi lưu lời nhắc');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/reminder/${id}`);
      await fetchReminders();
      message.success('Xóa lời nhắc thành công');
    } catch (error) {
      console.error('Error deleting reminder:', error);
      if (error.response && error.response.status === 403) {
        message.error('Bạn cần nâng cấp lên gói PREMIUM để sử dụng tính năng này');
        setIsPremiumUser(false);
      } else {
        message.error('Có lỗi xảy ra khi xóa lời nhắc');
      }
    }
  };

  const handleSymptomSelect = (symptomId) => {
    const isSelected = selectedSymptoms.includes(symptomId);
    
    if (isSelected) {
      setSelectedSymptoms(selectedSymptoms.filter(id => id !== symptomId));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    }
    
    setVisibleAdvice(symptomId);
  };

  const getSymptomSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return '#f5222d';
      case 'medium':
        return '#fa8c16';
      case 'low':
        return '#52c41a';
      default:
        return '#1890ff';
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

  // Phần Triệu Chứng Bất Thường và Lời Khuyên
  

  if (!isPremiumUser) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card title="Quản lý lời nhắc" className="shadow-md">
          <div className="py-8 text-center">
            <div className="text-5xl text-gray-300 mb-4">
              <MailOutlined />
            </div>
            <h3 className="text-xl font-medium mb-4">Tính năng chỉ dành cho gói PREMIUM</h3>
            <p className="text-gray-500 mb-6">
              Tính năng nhắc nhở qua email chỉ dành cho người dùng gói PREMIUM. 
              Nâng cấp ngay để theo dõi thai kỳ hiệu quả hơn với hệ thống nhắc nhở thông minh.
            </p>
            <div className="space-y-4">
              <ul className="text-left max-w-md mx-auto mb-6">
                <li className="flex items-center mb-2">
                  <span className="text-green-500 mr-2">✓</span> Nhắc lịch khám thai định kỳ
                </li>
                <li className="flex items-center mb-2">
                  <span className="text-green-500 mr-2">✓</span> Nhắc lịch tiêm chủng
                </li>
                <li className="flex items-center mb-2">
                  <span className="text-green-500 mr-2">✓</span> Nhắc lịch xét nghiệm
                </li>
                <li className="flex items-center mb-2">
                  <span className="text-green-500 mr-2">✓</span> Nhắc nhở tùy chỉnh
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Nhận email nhắc nhở trước 1 ngày và trong ngày
                </li>
              </ul>
              <button
                onClick={() => navigate('/membership')}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Nâng cấp lên PREMIUM ngay
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <Card
        title="Quản lý lời nhắc"
        extra={
          <button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showAddModal}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-1 px-2 rounded-lg"
          >
            Thêm lời nhắc
          </button>
        }
      >
        <Alert
          message="Tính năng email nhắc nhở PREMIUM"
          description={
            <p>
              Hệ thống sẽ tự động gửi email nhắc nhở cho bạn vào lúc 8:00 sáng trong ngày diễn ra lời nhắc để bạn có thể chuẩn bị. Hãy đảm bảo email của bạn chính xác.
            </p>
          }
          type="success"
          showIcon
          icon={<MailOutlined />}
          className="mb-4"
        />
        
        <Table
          columns={columns}
          dataSource={reminders}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={(pagination) => setPagination(pagination)}
        />
      </Card>

      {/* Phần triệu chứng bất thường */}

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