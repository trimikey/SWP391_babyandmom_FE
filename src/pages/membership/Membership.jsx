import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/background.jpg';

import { Spin, message } from 'antd';
import api from '../../config/axios';


const Membership = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await api.get('membership-packages');
      setPackages(response.data);
    } catch (error) {
      message.error('Không thể tải thông tin gói thành viên');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSubscribe = (packageId) => {
    navigate('/payment', { state: { packageId } });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getDurationText = (months) => {
    return months === -1 ? 'Trọn đời' : '1 năm';
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}>
      
      {/* Header */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
      <div className="bg-pink-100/95 backdrop-blur-sm rounded-lg shadow-lg p-8">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gói Thành Viên</h1>
          <p className="text-xl text-gray-700">Chọn gói phù hợp với nhu cầu của bạn</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {packages.map((pkg) => (
              <div key={pkg.id} 
                className={`bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 
                  ${pkg.type === 'LIFETIME' ? 'border-2 border-pink-500' : ''}`}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {pkg.type === 'YEARLY' && 'Gói Hàng Năm'}
                    {pkg.type === 'LIFETIME' && 'Gói Trọn Đời'}
                  </h3>
                  {pkg.type === 'LIFETIME' && (
                    <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm">
                      Được ưa chuộng
                    </span>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(pkg.price)}
                  </span>
                  <span className="text-gray-600">/{getDurationText(pkg.durationInMonths)}</span>
                </div>

                <div className="mt-8">
                  <div className="space-y-4">
                    {pkg.features.split('\n').map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <svg className="h-6 w-6 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSubscribe(pkg.id)}
                  className={`mt-8 w-full py-3 px-6 rounded-lg text-white font-semibold
                    ${pkg.type === 'LIFETIME' 
                      ? 'bg-pink-500 hover:bg-pink-600' 
                      : 'bg-gray-800 hover:bg-gray-900'} 
                    transition-colors duration-200`}
                >
                  Đăng ký ngay
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center bg-pink-100/90 backdrop-blur-sm rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cam kết của chúng tôi</h2>
          <p className="text-gray-700">
            Baby&Mom cam kết mang đến trải nghiệm tốt nhất cho các mẹ bầu trong hành trình thai kỳ. 
            Với đội ngũ chuyên gia giàu kinh nghiệm và nền tảng công nghệ hiện đại, 
            chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.
          </p>
        </div>
      </div>
      </div>

      {/* Footer */}
    </div>
  );
};

export default Membership; 