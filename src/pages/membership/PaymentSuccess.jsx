import React, {  useState } from 'react';
import { Result, Button,  } from 'antd';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle={
            <div className="text-center">
              <p className="text-gray-600 mt-2">
                Bạn đã đăng ký thành công gói
              </p>
          
            </div>
          }
          extra={[
           
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