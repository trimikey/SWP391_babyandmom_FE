import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const MembershipRequired = ({ membershipStatus }) => {
  const navigate = useNavigate();
  
  // Lấy thông tin từ localStorage
  const paymentStatus = localStorage.getItem('paymentStatus');
  const hasMembership = membershipStatus?.isBasic || membershipStatus?.isPremium;
  const paymentCancelled = paymentStatus === 'cancel';
  
  let title, subTitle, actionText;
  
  if (hasMembership && paymentCancelled) {
    title = "Thanh toán đã bị hủy";
    subTitle = "Bạn đã đăng ký gói thành viên nhưng thanh toán đã bị hủy. Vui lòng thanh toán để tiếp tục sử dụng.";
    actionText = "Thanh toán lại";
  } else {
    title = "Tính năng yêu cầu gói thành viên";
    subTitle = "Để sử dụng tính năng này, bạn cần đăng ký gói Cao cấp.";
    actionText = "Đăng ký gói thành viên";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Result
        status={paymentCancelled ? "warning" : "403"}
        title={title}
        subTitle={subTitle}
        extra={[
          <Button 
            type="primary" 
            key="membership"
            onClick={() => navigate('/membership')}
            className="bg-pink-400 hover:bg-pink-500 border-pink-400"
          >
            {actionText}
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
