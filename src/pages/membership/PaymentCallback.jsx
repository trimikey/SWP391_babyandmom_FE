import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Result, Button, Spin } from 'antd';
import api from '../../config/axios';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Gửi thông tin callback từ VNPay lên server để verify
        const response = await api.get('/api/payment/verify', {
          params: Object.fromEntries(searchParams)
        });

        setPaymentStatus(response.data.status);
      } catch (error) {
        console.error('Error verifying payment:', error);
        setPaymentStatus('error');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        {paymentStatus === 'success' ? (
          <Result
            status="success"
            title="Thanh toán thành công!"
            subTitle="Cảm ơn bạn đã đăng ký gói thành viên. Bạn có thể bắt đầu sử dụng các tính năng ngay bây giờ."
            extra={[
              <Button 
                type="primary" 
                onClick={() => navigate('/')}
                className="bg-pink-600 hover:bg-pink-700 border-pink-600"
                key="home"
              >
                Về trang chủ
              </Button>
            ]}
          />
        ) : (
          <Result
            status="error"
            title="Thanh toán thất bại"
            subTitle="Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau."
            extra={[
              <Button 
                type="primary" 
                onClick={() => navigate('/membership')}
                className="bg-pink-600 hover:bg-pink-700 border-pink-600"
                key="retry"
              >
                Thử lại
              </Button>
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentCallback; 