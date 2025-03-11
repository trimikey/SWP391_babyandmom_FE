import React from 'react';
import { FaFacebook, FaTiktok, FaEnvelope } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white-100/30 text-gray-700 py-2 mt-6 [&_a]:text-gray-600 [&_a]:no-underline">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm">&copy; 2025 Baby&Mom. All rights reserved.</p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center space-y-3" >
            <Link to="/contact" className="text-gray no-underline hover:text-gray-600 transition-colors">
              Liên hệ
            </Link>
            <Link to="/privacy-policy" className="text-black no-underline hover:text-gray-600 transition-colors">
              Chính sách bảo mật
            </Link>
            <Link to="/terms-of-service" className="text-black no-underline hover:text-gray-600 transition-colors">
              Điều khoản sử dụng
            </Link>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <h4 className="font-semibold text-lg text-black">Kết nối với chúng tôi</h4>
            <div className="flex space-x-4">
              <Link to="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="!text-blue-600 !no-underline hover:!text-blue-700 transition-colors">
                <FaFacebook size={24} />
              </Link>
              <Link to="https://tiktok.com" target="_blank" rel="noopener noreferrer"
                className="!text-blue-600 !no-underline hover:!text-blue-700 transition-colors">
                <FaTiktok size={24} />
              </Link>
              <Link to="https://zalo.me/your-zalo-id" target="_blank" rel="noopener noreferrer"
                className="!text-blue-600 !no-underline hover:!text-blue-700 transition-colors">
                <SiZalo size={24} />
              </Link>
              <Link to="mailto:leductri12321@gmail.com"
                className="!text-blue-600 !no-underline hover:!text-blue-700 transition-colors">
                <FaEnvelope size={24} />
              </Link>
            </div>
            <a href="mailto:leductri12321@gmail.com" 
              className="!text-black-600 !no-underline hover:!text-blue-700 transition-colors">
              Mail: leductri12321@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 