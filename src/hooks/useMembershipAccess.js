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
        
        // Kiểm tra URL để biết người dùng vừa từ trang thanh toán chuyển đến
        const urlParams = new URLSearchParams(window.location.search);
        const paymentSuccess = urlParams.get('payment') === 'success';
        const paymentCancel = urlParams.get('payment') === 'cancel';
        
        // Cập nhật trạng thái
        setMembershipStatus({
          isBasic: membershipResponse.data.isBasic,
          isPremium: membershipResponse.data.isPremium,
          // Nếu URL có tham số payment=success, coi như đã thanh toán thành công
          paymentSuccess: paymentSuccess,
          paymentCancel: paymentCancel
        });
        
        // Đặt quyền truy cập dựa trên điều kiện:
        // 1. Có gói thành viên (basic hoặc premium)
        // 2. Không có trạng thái hủy thanh toán
        const hasMembership = membershipResponse.data.isBasic || membershipResponse.data.isPremium;
        
        // Trường hợp đặc biệt: Nếu người dùng vừa thanh toán thành công, cho phép truy cập
        if (paymentSuccess && hasMembership) {
          setHasAccess(true);
          // Xóa query param để tránh vấn đề khi refresh
          window.history.replaceState({}, document.title, window.location.pathname);
        } 
        // Trường hợp đặc biệt: Nếu người dùng vừa hủy thanh toán, từ chối truy cập
        else if (paymentCancel && hasMembership) {
          setHasAccess(false);
          // Xóa query param
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        // Các trường hợp khác: Nếu có gói thành viên, cho phép truy cập
        else {
          setHasAccess(hasMembership);
        }
        
        // Lưu trạng thái vào localStorage
        if (paymentSuccess && hasMembership) {
          localStorage.setItem('paymentStatus', 'success');
        } else if (paymentCancel && hasMembership) {
          localStorage.setItem('paymentStatus', 'cancel');
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
    // Trạng thái thanh toán từ localStorage
    const paymentStatus = localStorage.getItem('paymentStatus');
    
    if (paymentStatus === 'cancel' && (membershipStatus.isBasic || membershipStatus.isPremium)) {
      message.warning('Thanh toán đã bị hủy. Vui lòng thanh toán để sử dụng tính năng này.');
    } else {
      message.warning(
        membershipStatus.isBasic || membershipStatus.isPremium
        ? 'Bạn cần hoàn tất thanh toán để sử dụng tính năng này'
        : 'Bạn cần đăng ký gói thành viên để sử dụng tính năng này'
      );
    }
    
    navigate('/membership');
  };

  return { isLoading, hasAccess, membershipStatus, redirectToMembership };
};

export default useMembershipAccess; 