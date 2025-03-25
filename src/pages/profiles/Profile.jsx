import React, { useState, useEffect } from 'react';
import { Form, Input, Card, message, Spin } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import api from '../../config/axios';

const UserProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await api.get('/user/profile');
        if (data) {
          form.setFieldsValue({
            userName: data.userName,
            email: data.email,
            phone: data.phone,
          });
        }
      } catch (error) {
        message.error('Không thể tải thông tin cá nhân');
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [form]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await api.put('/user/update-profile', values);
      message.success('Cập nhật thông tin thành công');
      localStorage.setItem(
        'userInfo',
        JSON.stringify({ ...JSON.parse(localStorage.getItem('userInfo') || '{}'), ...values })
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Cập nhật thất bại: ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold text-pink-600 mb-6 text-center">Thông Tin Cá Nhân</h2>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="userName" label="Tên người dùng" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
              <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input prefix={<MailOutlined />} disabled />
            </Form.Item>
            <Form.Item name="phone" label="Số điện thoại" rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
            ]}>
              <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
            </Form.Item>
            <div className="text-center">
              <button type="submit" disabled={submitting} className="bg-pink-600 hover:bg-pink-700 border border-pink-600 rounded-lg px-8 py-2 text-white">
                {submitting ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
