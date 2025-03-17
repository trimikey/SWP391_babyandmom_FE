import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import backgroundImage from '../../assets/background.jpg';
import axios from 'axios';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Gửi yêu cầu quên mật khẩu
  const handleForgotPassword = async (values) => {
    try {
      setLoading(true);
      
      // Tạo instance axios với credentials
      const axiosInstance = axios.create({
        baseURL: api.defaults.baseURL,
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true  // Quan trọng! Cho phép gửi cookie session
      });
      
      const response = await axiosInstance.post('/user/forgot', {
        email: values.email
      });
      
      message.success('Mã xác nhận đã được gửi đến email của bạn!');
      setUserEmail(values.email);
      setCodeSent(true);
    } catch (error) {
      // Thêm thông tin chi tiết hơn về lỗi
      console.log('Detailed error:', error);
      const errorMessage = error.response?.data || 'Có lỗi xảy ra khi gửi mã xác nhận';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Đặt lại mật khẩu
  const handleResetPassword = async (values) => {
    if (values.newPassword !== values.confirmedNewPassword) {
      message.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      setLoading(true);
      
      // Tạo instance axios với credentials
      const axiosInstance = axios.create({
        baseURL: api.defaults.baseURL,
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true  // Quan trọng!
      });
      
      // Phải gửi email cùng các thông tin khác
      const response = await axiosInstance.put('/user/reset', {
        code: values.code,
        newPassword: values.newPassword,
        confirmedNewPassword: values.confirmedNewPassword,
        email: userEmail  // Quan trọng!
      });
      
      message.success('Đặt lại mật khẩu thành công!');
      navigate('/login');
    } catch (error) {
      console.log('Detailed error:', error);
      const errorMessage = error.response?.data || 'Có lỗi xảy ra khi đặt lại mật khẩu';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}>   
      <Card className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {codeSent ? 'Đặt lại mật khẩu' : 'Quên mật khẩu'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {codeSent 
              ? 'Nhập mã xác nhận đã được gửi đến email của bạn' 
              : 'Nhập email để nhận mã xác nhận'}
          </p>
        </div>

        <Form
          form={form}
          onFinish={codeSent ? handleResetPassword : handleForgotPassword}
          layout="vertical"
          className="mt-8 space-y-6"
        >
          {!codeSent && (
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input placeholder="Nhập email đã đăng ký" />
            </Form.Item>
          )}

          {codeSent && (
            <>
              <p className="mb-4 text-sm text-gray-600">
                Mã xác nhận đã được gửi đến email: <strong>{userEmail}</strong>
              </p>
              
              <Form.Item
                name="code"
                label="Mã xác nhận"
                rules={[{ required: true, message: 'Vui lòng nhập mã xác nhận' }]}
              >
                <Input placeholder="Nhập mã 6 chữ số" />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>

              <Form.Item
                name="confirmedNewPassword"
                label="Xác nhận mật khẩu mới"
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu mới" />
              </Form.Item>
            </>
          )}

          <div className="flex justify-between mt-6">
            <Button type="link" onClick={() => navigate('/login')}>
              Quay lại đăng nhập
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="bg-pink-500 hover:bg-pink-600"
            >
              {codeSent ? 'Đặt lại mật khẩu' : 'Gửi mã xác nhận'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword; 