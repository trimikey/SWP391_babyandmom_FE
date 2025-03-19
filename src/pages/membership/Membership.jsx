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

  const handleSubscribe = (pkg) => {
    navigate('/payment', { 
      state: { 
        packageId: pkg.id,
        packageType: pkg.type,
        packagePrice: pkg.price,
        packageDuration: pkg.durationInMonths,
        packageName: `Gói ${pkg.durationInMonths} tháng`
      } 
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getPackageTypeLabel = (type) => {
    const typeMap = {
      'BASIC': 'Cơ bản',
      'PREMIUM': 'Cao cấp',
    };
    return typeMap[type] || type;
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {packages.slice(0, 2).map((pkg) => (
                <div key={pkg.id} 
                  className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 flex flex-col justify-between">
                  <div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Gói {pkg.durationInMonths} tháng
                      </h3>
                      <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                        {getPackageTypeLabel(pkg.type)}
                      </span>
                    </div>

                    <div className="mt-6 text-center">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(pkg.price)}
                      </span>
                      <span className="text-gray-600 ml-2">/gói</span>
                    </div>

                    <div className="mt-8">
                      <div className="space-y-4">
                        {pkg.features.split('\n').map((feature, index) => (
                          <div key={index} className="flex items-start">
                            <svg className="h-6 w-6 text-pink-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSubscribe(pkg)}
                    className="mt-8 w-full py-3 px-6 rounded-lg text-white font-semibold
                      bg-pink-500 hover:bg-pink-600 transition-colors duration-200"
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