import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../config/axios';
import logoImage from '../../assets/logo.jpg';
import { message } from 'antd';
import { 
  FaSignOutAlt, 
  FaCaretDown, 
  FaUserCircle, // Icon thông tin cá nhân
  FaBabyCarriage, // Icon thông tin thai kỳ
  FaBell // Icon cho nhắc nhở
} from 'react-icons/fa'
import { MdPregnantWoman } from 'react-icons/md';
const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown
  const [userName, setUserName] = useState('');
  const token = localStorage.getItem('token');
  const [pregnancyProfile, setPregnancyProfile] = useState(null);
  const [pregnancyRecords, setPregnancyRecords] = useState(null);
  
  // State cho modal nhắc nhở
 
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/user/profile', {
        
        });
        
        console.log('Header User Profile:', response.data); // Thêm log này để kiểm tra
        
        if (response.data) {
          setUserName(response.data.userName || 'Guest');
          // Lưu lại thông tin user để sử dụng sau này
          localStorage.setItem('userInfo', JSON.stringify(response.data));
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserName('Guest');
        if (error.response?.status === 401) {
          // Token hết hạn hoặc không hợp lệ
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          setIsLoggedIn(false);
        } else if (error.response?.status === 403) {
          // Handle 403 Forbidden error
          console.error('Access denied. You do not have permission to access this resource.');
          // Optionally, you can set a state to show a message to the user
        }
      }
    };

    if (token) {
      fetchUserProfile();
    } else {
      setIsLoggedIn(false);
      setUserName('Guest');
    }
  }, [token]);

  useEffect(() => {
    const fetchPregnancyProfile = async () => {
      try {
        const response = await api.get('/pregnancy-profile');

      //   const responsePregnancyRecords = await api.get(`/growth-records/current?profileId=${localStorage.getItem('profileId')}`, {
      //     headers: {
      //       'Authorization': `Bearer ${token}`
      //     },
          
      //   });
      //   // console.log( responsePregnancyRecords);
      //   console.log('Pregnancy Profile:', pregnancyProfile);
      // console.log('Pregnancy Records:', pregnancyRecords);

      //   setPregnancyRecords(responsePregnancyRecords.data);
      //   // console.log('Pregnancy Profile:', response.data);
      //   if (response.data && response.data.length > 0) {
      //     setPregnancyProfile(response.data[0]); // Lấy profile đầu tiên
       
        console.log('Pregnancy Profile Response:', response.data);

        if (response.data && response.data.length > 0) {

          setPregnancyProfile(response.data[0]);
          localStorage.setItem('profileId', response.data[0].id); // Lưu profileId vào localStorage
          
          // Fetch pregnancy records sau khi có profile
          try {
            const recordsResponse = await api.get(`/growth-records/current?profileId=${response.data[0].id}`, {
            
            });
            setPregnancyRecords(recordsResponse.data);
          } catch (error) {
            console.error('Error fetching pregnancy records:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching pregnancy profile:', error);
      }
    };

    if (token) {
      fetchPregnancyProfile();
    }
  }, [token]);



  const handleNavigation = (path) => {
    if (path === '/growth-records') {
      // console.log('PregnancyProfile:', pregnancyProfile);
      console.log('PregnancyRecords:', pregnancyRecords);
      
      if (pregnancyRecords) {
        if (pregnancyRecords && pregnancyRecords.length > 0) {
          navigate(`/growth-records/profile/${pregnancyRecords[pregnancyRecords.length - 1].id}`);
        } else {
          navigate('/growth-records/profile');
        }
      } else {
        message.error('Vui lòng tạo hồ sơ thai kỳ trước');
        navigate('/profile/pregnancy-profile');
      }
    } else {
      navigate(path);
    }
    setShowDropdown(false);
  };

  const handleLogout = () => {
    // Xóa hoàn toàn thông tin đăng nhập
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Xóa bất kỳ thông tin lưu trữ nào khác liên quan đến session
    
    // Force reload trang để xóa tất cả state trong bộ nhớ
    window.location.href = '/login';
  };

  // Hiển thị modal thêm lời nhắc
  

  // Đóng modal
 


  return (
    <>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow fixed w-full z-50">
        <div className="max-w-7xl mx-auto py-2 px-4  flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src={logoImage} alt="Logo" className="h-12 w-12 object-contain" />
            <h1 className="text-3xl font-['Alex_Brush'] text-gray-900 hover:text-pink-600 transition-colors duration-200">
              Baby&Mom
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2 text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-5 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Đăng ký
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-pink-600"
                >
                  <FaUserCircle className="text-lg" />
                  <span>Xin chào, {userName}</span>
                  <FaCaretDown className={`transform transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-10">
                    {/* User Name */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{userName}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          handleNavigation('/profile');
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <FaUserCircle className="mr-3" />
                        Thông tin cá nhân
                      </button>

                      <button
                        onClick={() => {
                          handleNavigation('/profile/pregnancy-profile');
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <MdPregnantWoman className="mr-3" />
                        Thông tin thai kỳ
                      </button>

                      <button
                        onClick={() => {
                          handleNavigation('/growth-records');
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <FaBabyCarriage className="mr-3" />
                        Thông tin tăng trưởng
                      </button>

                      {/* Thêm mục Thêm lời nhắc */}
                      <button
                        onClick={() => {
                          handleNavigation('/reminders');
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <FaBell className="mr-3" />
                        Quản lý lời nhắc
                      </button>

                      {/* Add Transaction Menu Item */}
                      <button
                        onClick={() => {
                          handleNavigation('/transactions');
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <FaUserCircle className="mr-3" />
                        Thông tin giao dịch
                      </button>

                      {/* Add Change Password Menu Item */}
                      <button
                        onClick={() => {
                          handleNavigation('/change-password');
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <FaUserCircle className="mr-3" />
                        Thay đổi mật khẩu
                      </button>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      >
                        <FaSignOutAlt className="mr-3" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-center space-x-12 h-14">
              <button 
                onClick={() => handleNavigation('/')} 
                className="text-gray-700 hover:text-pink-600 font-medium relative group py-4"
              >
                <span>Trang chủ</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </button>
              <button 
                onClick={() => handleNavigation('/blog')} 
                className="text-gray-700 hover:text-pink-600 font-medium relative group py-4"
              >
                <span>Blog</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </button>
              <button 
                onClick={() => handleNavigation('/faq')} 
                className="text-gray-700 hover:text-pink-600 font-medium relative group py-4"
              >
                <span>FAQ</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </button>
              <button 
                onClick={() => handleNavigation('/membership')} 
                className="text-gray-700 hover:text-pink-600 font-medium relative group py-4"
              >
                <span>Gói thành viên</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </button>
              
              <button 
                onClick={() => handleNavigation('/growth-records')} 
                className="text-gray-700 hover:text-pink-600 font-medium relative group py-4"
              >
                <span>Cập nhật tăng trưởng</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </button>
            </div>
          </div>
        </nav>
      </header>
      {/* Add padding to account for fixed header */}
      <div className="h-32"></div>

     
      
    </>
  );
};

export default Header; 