import React from 'react';
import { FaFacebook, FaTiktok, FaEnvelope } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="bg-white-100/30 text-black py-2 mt-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm">&copy; 2025 Baby&Mom. All rights reserved.</p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center space-y-3">
            <a href="#" className="text-black hover:text-pink-600 transition-colors">Liên hệ</a>
            <a href="#" className="text-black hover:text-pink-600 transition-colors">Chính sách bảo mật</a>
            <a href="#" className="text-black hover:text-pink-600 transition-colors">Điều khoản sử dụng</a>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <h4 className="font-semibold text-lg text-black">Kết nối với chúng tôi</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="text-black hover:text-pink-700 transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
                className="text-black hover:text-gray-700 transition-colors">
                <FaTiktok size={24} />
              </a>
              <a href="https://zalo.me/your-zalo-id" target="_blank" rel="noopener noreferrer"
                className="text-black hover:text-blue-600 transition-colors">
                <SiZalo size={24} />
              </a>
              <a href="mailto:leductri12321@gmail.com"
                className="text-black hover:text-red-600 transition-colors">
                <FaEnvelope size={24} />
              </a>
            </div>
            <a href="mailto:leductri12321@gmail.com" 
              className="text-sm text-black hover:text-gray-800">
              Mail: leductri12321@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 