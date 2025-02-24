import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.jpg';

const Header = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

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
            <button
              onClick={() => handleNavigation('/profile')}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Hồ sơ
            </button>
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
            <button onClick={() => handleNavigation('/growthchart')} className="text-gray-700 hover:text-pink-900 font-medium">Biểu đồ thai</button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header; 