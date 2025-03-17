import React, { useEffect, useState } from 'react';
import { Result, Button, Spin, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../config/axios';

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Lấy orderId từ URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const orderId = queryParams.get('orderId');
        
        if (!orderId) {
          message.error('Không tìm thấy thông tin đơn hàng');
          setTimeout(() => navigate('/membership'), 2000);
          return;
        }
        
        // Cập nhật trạng thái đơn hàng (nếu cần)
        await api.get(`/order/payment-success/${orderId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        // Lấy thông tin chi tiết đơn hàng
        const response = await api.get(`/order/${orderId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (response.data && response.data.length > 0) {
          setOrderDetails(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        message.error('Đã xảy ra lỗi khi xác nhận thanh toán');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [location, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle={
            <div className="text-center">
              <p className="text-gray-600 mt-2">
                Bạn đã đăng ký thành công gói {orderDetails?.type || 'PREMIUM'}
              </p>
              <p className="text-gray-600 mt-1">
                Mã đơn hàng: {orderDetails?.id || 'N/A'}
              </p>
              {orderDetails?.totalPrice && (
                <p className="text-gray-600 mt-1">
                  Số tiền: {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(orderDetails.totalPrice)}
                </p>
              )}
            </div>
          }
          extra={[
            <Button 
              type="primary" 
              key="reminders" 
              onClick={() => navigate('/reminders')}
              className="bg-pink-500 hover:bg-pink-700 border-pink-500"
            >
              Sử dụng tính năng nhắc hẹn ngay
            </Button>,
            <Button 
              key="membership" 
              onClick={() => navigate('/membership')}
            >
              Quay lại trang thành viên
            </Button>,
          ]}
        />
      </div>
    </div>
  );
};

export default PaymentSuccess; 