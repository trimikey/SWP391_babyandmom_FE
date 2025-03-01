import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import backgroundImage from '../../assets/background.jpg';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Gửi yêu cầu quên mật khẩu
  const handleForgotPassword = async (values) => {
    try {
      setLoading(true);
      const response = await api.post('/password/forgot', {
        email: values.email
      });
      message.success('Mã xác nhận đã được gửi đến email của bạn!');
      setCodeSent(true);
    } catch (error) {
      message.error(error.response?.data || 'Có lỗi xảy ra');
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
      await api.put('/password/reset', {
        email: values.email,
        code: values.code,
        newPassword: values.newPassword,
        confirmedNewPassword: values.confirmedNewPassword
      });
      message.success('Đặt lại mật khẩu thành công!');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}>   
         <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
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
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input disabled={codeSent} />
          </Form.Item>

          {codeSent && (
            <>
              <Form.Item
                name="code"
                label="Mã xác nhận"
                rules={[{ required: true, message: 'Vui lòng nhập mã xác nhận' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                ]}
              >
                <Input.Password />
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
                <Input.Password />
              </Form.Item>
            </>
          )}

          <div className="flex justify-between">
            <Button type="link" onClick={() => navigate('/login')}>
              Quay lại đăng nhập
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {codeSent ? 'Đặt lại mật khẩu' : 'Gửi mã xác nhận'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword; 