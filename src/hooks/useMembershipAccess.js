import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';
import { message } from 'antd';

const useMembershipAccess = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState({
    isBasic: false,
    isPremium: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkMembershipStatus = async () => {
      try {
        setIsLoading(true);
        
        // Kiểm tra trạng thái membership từ API
        const membershipResponse = await api.get('/pregnancy-profile/membership/status');
        
        // Lấy thông tin user từ localStorage
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        if (userInfo && userInfo.id) {
          // Lấy danh sách giao dịch của user
          const transactionsResponse = await api.get(`/transactions/user/${userInfo.id}`);
          const transactions = transactionsResponse.data;
          
          // Kiểm tra giao dịch gần nhất (transaction cuối cùng trong mảng)
          const latestTransaction = transactions.length > 0 ? transactions[transactions.length - 1] : null;
          const isPaymentCompleted = latestTransaction?.status === 'COMPLETED';
          
          // Cập nhật trạng thái membership
          setMembershipStatus({
            isBasic: membershipResponse.data.isBasic,
            // Chỉ set isPremium = true khi có gói premium VÀ thanh toán COMPLETED
            isPremium: membershipResponse.data.isPremium && isPaymentCompleted
          });
          
          // Cập nhật quyền truy cập
          if (membershipResponse.data.isBasic) {
            setHasAccess(true);
          } else if (membershipResponse.data.isPremium) {
            // Chỉ cho phép truy cập khi thanh toán COMPLETED
            if (isPaymentCompleted) {
              setHasAccess(true);
              localStorage.setItem('paymentStatus', 'success');
            } else {
              setHasAccess(false);
              localStorage.setItem('paymentStatus', 'failed');
            }
          } else {
            setHasAccess(false);
          }
        }
        
      } catch (error) {
        console.error('Error checking membership status:', error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMembershipStatus();
  }, []);

  const redirectToMembership = () => {
    const paymentStatus = localStorage.getItem('paymentStatus');
    
    if (paymentStatus === 'failed') {
      message.warning('Thanh toán chưa hoàn tất. Vui lòng thanh toán để sử dụng tính năng Premium.');
    } else {
      message.warning('Bạn cần đăng ký và thanh toán gói Premium để sử dụng tính năng này');
    }
    
    navigate('/membership');
  };

  return { isLoading, hasAccess, membershipStatus, redirectToMembership };
};

export default useMembershipAccess; 