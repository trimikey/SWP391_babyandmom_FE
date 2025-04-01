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
        const response = await api.get('/pregnancy-profile/membership/status');
        
        setMembershipStatus({
          isBasic: response.data.isBasic,
          isPremium: response.data.isPremium
        });
        
        // Có quyền truy cập nếu là Basic hoặc Premium
        setHasAccess(response.data.isBasic || response.data.isPremium);
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
    message.info('Bạn cần nâng cấp gói thành viên để sử dụng tính năng này');
    navigate('/membership');
  };

  return { isLoading, hasAccess, membershipStatus, redirectToMembership };
};

export default useMembershipAccess; 