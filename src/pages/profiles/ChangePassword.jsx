import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LockOutlined } from '@ant-design/icons';
import api from '../../config/axios';

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await api.put('password/change', {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      });

      if (response.data.status === "Success") {
        message.success('Đổi mật khẩu thành công');
        // Đợi 1 giây trước khi chuyển hướng
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        message.error(response.data.message || 'Đổi mật khẩu thất bại');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold text-pink-600 mb-6 text-center">
            Đổi Mật Khẩu
          </h2>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-4"
          >
            <Form.Item
              name="oldPassword"
              label="Mật khẩu hiện tại"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu hiện tại"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu mới"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu mới"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="Xác nhận mật khẩu mới"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item className="text-center">
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                className="bg-pink-600 hover:bg-pink-700 border-pink-600 rounded-lg px-8 w-full"
              >
                Đổi mật khẩu
              </Button>
            </Form.Item>

            <div className="text-center">
              <Button 
                type="link" 
                onClick={() => navigate('/')}
                className="text-pink-600 hover:text-pink-700"
              >
                Quay lại trang chủ
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ChangePassword;
