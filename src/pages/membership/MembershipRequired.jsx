import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const MembershipRequired = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Result
        status="403"
        title="Tính năng yêu cầu gói thành viên"
        subTitle="Để sử dụng tính năng này, bạn cần nâng cấp lên gói Cơ bản hoặc Cao cấp."
        extra={[
          <Button 
            type="primary" 
            key="membership"
            onClick={() => navigate('/membership')}
            className="bg-pink-400 hover:bg-pink-500 border-pink-400"
          >
            Nâng cấp gói thành viên
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

export default MembershipRequired;
