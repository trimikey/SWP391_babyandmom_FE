import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.jpg';
import { FaUser, FaKey, FaBaby, FaSignOutAlt, FaCaretDown } from 'react-icons/fa'; // Import icons

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Kiểm tra token và thông tin user từ localStorage
    const token = localStorage.getItem('token');
    const userInfoStr = localStorage.getItem('userInfo');
    console.log('userInfoStr:', userInfoStr);
    if (token && userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        console.log('Parsed userInfo:', userInfo); // Debug log
        
        // Thứ tự ưu tiên: name -> fullName -> email
        const displayName = userInfo.name || userInfo.fullName || userInfo.email || 'Guest';
        setUserName(displayName);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing userInfo:', error);
        setUserName('Guest');
      }
    }
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setShowDropdown(false); // Close dropdown after navigation
  };

  const handleLogout = () => {
    // Xóa token và thông tin user
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUserName('Guest');
    navigate('/login');
  };

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
                  onClick={() => handleNavigation('/login')}
                  className="px-5 py-2 text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
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
                  <FaUser className="text-lg" />
                  <span>{userName}</span>
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
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50"
                      >
                        <FaBaby className="text-pink-500" />
                        <span>Thông tin mẹ và bé</span>
                      </button>

                      <button
                        onClick={() => {
                          handleNavigation('/profile/pregnancy-profile'); 
                          setShowDropdown(false);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50"
                      >
                        <FaUser className="text-pink-500" />
                        <span>Thông tin thai kì</span>
                      </button>

                      <button
                        onClick={() => {
                          handleNavigation('/profile');
                          setShowDropdown(false);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50"
                      >
                        <FaKey className="text-pink-500" />
                        <span>Đổi mật khẩu</span>
                      </button>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={() => {
                          handleLogout();
                          setShowDropdown(false);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <FaSignOutAlt className="text-red-500" />
                        <span>Đăng xuất</span>
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
                onClick={() => handleNavigation('/growthchart')} 
                className="text-gray-700 hover:text-pink-600 font-medium relative group py-4"
              >
                <span>Biểu đồ thai</span>
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