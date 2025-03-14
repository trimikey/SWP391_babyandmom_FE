import React, { useEffect, useState } from 'react';
import { Result, Button, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/axios';

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Vui lòng đăng nhập để xem thông tin đơn hàng');
          setLoading(false);
          return;
        }

        // Kiểm tra trạng thái đơn hàng
        const response = await api.get(`/order/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Đơn hàng có thể đã được xác nhận bởi webhook
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError('Không thể kiểm tra trạng thái thanh toán');
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Result
          status="warning"
          title="Có lỗi xảy ra"
          subTitle={error}
          extra={
            <Button type="primary" onClick={() => navigate('/membership')}>
              Quay lại trang gói thành viên
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Result
        status="success"
        title="Thanh toán thành công!"
        subTitle="Cảm ơn bạn đã đăng ký gói thành viên tại Baby&Mom."
        extra={[
          <Button 
            key="dashboard" 
            className="bg-pink-500 hover:bg-pink-600 text-white" 
            onClick={() => navigate('/')}
          >
            Về trang chủ
          </Button>,
          <Button 
            key="membership" 
            onClick={() => navigate('/membership')}
          >
            Quay lại trang gói thành viên
          </Button>
        ]}
      />
    </div>
  );
};

export default PaymentSuccess; 