import React, { useState } from 'react';
import { Form, Input, message, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import backgroundImage from '../../assets/background.jpg';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Gửi yêu cầu quên mật khẩu hoặc đặt lại mật khẩu
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (!codeSent) {
        // Gửi yêu cầu quên mật khẩu
        await api.post('/user/forgot', { email: values.email }, { withCredentials: true });
        message.success('Mã xác nhận đã được gửi đến email của bạn!');
        setUserEmail(values.email);
        setCodeSent(true);
      } else {
        // Kiểm tra mật khẩu trùng khớp
        if (values.newPassword !== values.confirmedNewPassword) {
          message.error('Mật khẩu xác nhận không khớp!');
          return;
        }
        // Đặt lại mật khẩu
        await api.put('/user/reset', values, { withCredentials: true });
        message.success('Đặt lại mật khẩu thành công!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      message.error(error.response?.data || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Card className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {codeSent ? 'Đặt lại mật khẩu' : 'Quên mật khẩu'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {codeSent
            ? `Nhập mã xác nhận đã gửi đến: ${userEmail}`
            : 'Nhập email để nhận mã xác nhận'}
        </p>

        <Form form={form} onFinish={handleSubmit} layout="vertical" className="mt-8 space-y-6">
          {!codeSent ? (
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input placeholder="Nhập email đã đăng ký" />
            </Form.Item>
          ) : (
            <>
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
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>
              <Form.Item
                name="confirmedNewPassword"
                label="Xác nhận mật khẩu mới"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      return !value || getFieldValue('newPassword') === value
                        ? Promise.resolve()
                        : Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu mới" />
              </Form.Item>
            </>
          )}

          <div className="flex justify-between mt-6">
            <button type="button" onClick={() => navigate('/login')} className="text-pink-500 hover:text-pink-600">
              Quay lại đăng nhập
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              {loading ? 'Đang xử lý...' : codeSent ? 'Đặt lại mật khẩu' : 'Gửi mã xác nhận'}
            </button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
