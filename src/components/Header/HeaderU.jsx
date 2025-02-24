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
      <header className="bg-white/80 backdrop-blur-sm shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={logoImage} alt="Logo" className="h-10 w-10" />
            <h1 className="text-3xl font-['Alex_Brush'] text-gray-900">Baby&Mom</h1>
          </div>
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              // Hiển thị nút đăng nhập và đăng ký khi chưa đăng nhập
              <>
                <button
                  onClick={() => handleNavigation('/login')}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors duration-200"
                >
                  Đăng ký
                </button>
              </>
            ) : (
              // Hiển thị thông tin user và nút đăng xuất khi đã đăng nhập
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">Xin chào,{mail}</span>
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
                  <span className="text-sm text-gray-500">
                    ({userInfo.role === 'ADMIN' ? 'Admin' : 'Thành viên'})
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav>
        <div className="max-w-7xl mx-auto px-4 flex justify-center h-16">
          <div className="flex space-x-8">
            <button onClick={() => handleNavigation('/homepage')} className="text-gray-700 hover:text-pink-900 font-medium">Trang chủ</button>
            <button onClick={() => handleNavigation('/blog')} className="text-gray-700 hover:text-pink-900 font-medium">Blog</button>
            <button onClick={() => handleNavigation('/faq')} className="text-gray-700 hover:text-pink-900 font-medium">FAQ</button>
            <button onClick={() => handleNavigation('/membership')} className="text-gray-700 hover:text-pink-900 font-medium">Gói thành viên</button>
            {userInfo.role === 'ADMIN' && (
              <button onClick={() => handleNavigation('/dashboard')} className="text-gray-700 hover:text-pink-900 font-medium">Dashboard</button>
            )}
            <button onClick={() => handleNavigation('/growthchart')} className="text-gray-700 hover:text-pink-900 font-medium">Biểu đồ thai</button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header; 