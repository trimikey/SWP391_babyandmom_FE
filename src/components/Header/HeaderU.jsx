import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.jpg';
import { FaUser, FaBaby, FaSignOutAlt, FaCaretDown } from 'react-icons/fa'; // Import icons

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    // Kiểm tra token và thông tin user từ localStorage
    const token = localStorage.getItem('token');
    const storedUserInfo = localStorage.getItem('userInfo');
    
    if (token && storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        console.log('Stored user info:', parsedUserInfo); // Kiểm tra thông tin được lưu
        setIsLoggedIn(true);
        setUserInfo({
          name: parsedUserInfo.name || parsedUserInfo.email, // Fallback to email if name is not available
          email: parsedUserInfo.email,
          role: parsedUserInfo.role
        });
      } catch (error) {
        console.error('Error parsing user info:', error);
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
    setUserInfo({
      name: '',
      email: '',
      role: ''
    });
    navigate('/login');
  };
  const mail = localStorage.getItem('email');

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
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700">Xin chào, {mail}</span>
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center space-x-1 font-medium text-pink-600 hover:text-pink-700"
                    >
                      <span>{userInfo.name}</span>
                      <FaCaretDown className={`transform transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                        <button
                          onClick={() => handleNavigation('/profile')}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 w-full text-left"
                        >
                          <FaUser className="text-pink-500" />
                          <span>Thông tin cá nhân</span>
                        </button>
                        <button
                          onClick={() => handleNavigation('/baby-profile')}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 w-full text-left"
                        >
                          <FaBaby className="text-pink-500" />
                          <span>Thông tin em bé</span>
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <FaSignOutAlt className="text-red-500" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {userInfo.role === 'ADMIN' ? 'Admin' : 'Thành viên'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-center space-x-12 h-14">
              <button 
                onClick={() => handleNavigation('/homepage')} 
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
              {userInfo.role === 'ADMIN' && (
                <button 
                  onClick={() => handleNavigation('/dashboard')} 
                  className="text-gray-700 hover:text-pink-600 font-medium relative group py-4"
                >
                  <span>Dashboard</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </button>
              )}
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