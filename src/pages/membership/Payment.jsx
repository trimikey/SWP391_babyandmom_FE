import React, { useState, useEffect } from 'react';
import { Card, Button, message, Spin } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../config/axios';

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Kiểm tra đăng nhập
    if (!token) {
      message.error('Vui lòng đăng nhập để tiếp tục');
      navigate('/login');
      return;
    }

    // Kiểm tra thông tin gói
    if (!location.state?.packageId || !location.state?.packageName) {
      message.error('Không tìm thấy thông tin gói đăng ký');
      navigate('/membership');
      return;
    }

    fetchUserProfile();
  }, [location, navigate, token]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setUserProfile(response.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        navigate('/login');
      } else {
        message.error('Không thể tải thông tin người dùng');
      }
    }
  };

  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      const currentToken = localStorage.getItem('token');
      
      if (!currentToken) {
        message.error('Vui lòng đăng nhập lại để tiếp tục');
        navigate('/login');
        return;
      }

      const orderData = {
        type: location.state.packageType,
        buyerEmail: userProfile.email
      };
      console.log(orderData);
      const response = await api.post(`/order/create?membershipType=${location.state.packageType}`);
      console.log(response);
      if (response) {
        message.success('Đăng ký gói thành công!');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      console.error('Error details:', error.response || error);
      
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/login');
      } else {
        message.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-pink-600">
              Xác Nhận Đăng Ký Gói Thành Viên
            </h2>
            <p className="text-gray-600 mt-2">
              Gói: {location.state?.packageType}
            </p>
            <p className="text-gray-600 mt-1">
              Giá: {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(location.state?.packagePrice)}
            </p>
            <p className="text-gray-600 mt-1">
              Thời hạn: {location.state?.packageDuration} tháng
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Thông tin người đăng ký
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  Họ tên: {userProfile.userName}
                </p>
                <p className="text-gray-600">
                  Email: {userProfile.email}
                </p>
                <p className="text-gray-600">
                  Số điện thoại: {userProfile.phone}
                </p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <button
                type="button"
                onClick={handleCreateOrder}
                loading={loading}
                className="bg-pink-500 hover:bg-pink-700 border-pink-500 w-full rounded-lg text-white text-lg py-2"
              >
                Xác nhận đăng ký
              </button>
              
              <button
                type="link" 
                onClick={() => navigate('/membership')}
                className="text-pink-600 hover:text-pink-700"
              >
                Quay lại
              </button>
            </div>
          </div>
        </Card>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default Payment;
