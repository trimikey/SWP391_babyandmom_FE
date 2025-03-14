import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Result
        status="info"
        title="Thanh toán đã bị hủy"
        subTitle="Bạn đã hủy quá trình thanh toán. Bạn có thể thử lại hoặc quay lại sau."
        extra={[
          <Button 
            key="membership" 
            className="bg-pink-500 hover:bg-pink-600 text-white" 
            onClick={() => navigate('/membership')}
          >
            Quay lại trang gói thành viên
          </Button>,
          <Button 
            key="home" 
            onClick={() => navigate('/')}
          >
            Về trang chủ
          </Button>
        ]}
      />
    </div>
  );
};

export default PaymentCancel; 