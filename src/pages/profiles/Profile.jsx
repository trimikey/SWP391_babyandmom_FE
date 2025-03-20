import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import api from '../../config/axios';

const UserProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/profile', {
        
      });

      if (response.data) {
        // Cập nhật form với dữ liệu từ API
        form.setFieldsValue({
          userName: response.data.userName,
          email: response.data.email,
          phone: response.data.phone
        });
      }
    } catch (error) {
      message.error('Không thể tải thông tin cá nhân');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);

      // Kiểm tra xem các trường yêu cầu có hợp lệ không
      if (!values.userName || !values.phone) {
        message.error('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const response = await api.put('/user/update-profile',
        {
          userName: values.userName,
          email: values.email,
          phone: values.phone
        },
       
      );

      if (response.data) {
        message.success('Cập nhật thông tin thành công');
        // Cập nhật lại thông tin trong localStorage nếu cần
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        localStorage.setItem('userInfo', JSON.stringify({
          ...userInfo,
          userName: values.userName,
          email: values.email,
          phone: values.phone
        }));
      }
    } catch (error) {
      // Ghi lại thông tin lỗi chi tiết
      console.error('Error updating profile:', error.response?.data || error);
      message.error('Cập nhật thông tin thất bại: ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
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
          <h2 className="text-2xl font-semibold text-pink-600 mb-6 text-center">
            Thông Tin Cá Nhân
          </h2>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-4"
          >
            <Form.Item
              name="userName"
              label="Tên người dùng"
              rules={[
                { required: true, message: 'Vui lòng nhập họ tên' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập họ và tên"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
            >
              <Input
                prefix={<MailOutlined />}
                disabled
                className="rounded-lg bg-gray-50"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Nhập số điện thoại"
                className="rounded-lg"
              />
            </Form.Item>

            <div className="text-center">

              {/* bo ngoai form */}
              <button
                type="submit"
                disabled={submitting}
                className="bg-pink-600 hover:bg-pink-700 border border-pink-600 rounded-lg px-8 py-2 text-white"
              >
                {submitting ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>

          </Form>

         
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;