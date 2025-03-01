import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../config/axios';
import backgroundImage from '../../assets/background.jpg';
import bannerImage from '../../assets/banner2.jpg';
import introImage from '../../assets/baby-intro2.jpg';
import { Link } from 'react-router-dom';



const Homepage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Kiểm tra thông tin user đã lưu
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const token = localStorage.getItem('token');
    // console.log('Current token:', token); // Kiểm tra token

    const checkPregnancyProfile = async () => {
      try {
        // Lấy và hiển thị tên người dùng
        
        const response = await api.get('/pregnancy-profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Nếu chưa có thông tin thai kỳ, hiện thông báo
        if (!response.data.hasProfile) {
          Swal.fire({
            title: 'Thêm thông tin thai kỳ',
            text: 'Bạn chưa có thông tin thai kỳ. Bạn có muốn thêm thông tin ngay bây giờ không?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#EC4899',
            cancelButtonColor: '#9CA3AF',
            confirmButtonText: 'Thêm thông tin',
            cancelButtonText: 'Để sau',
            background: '#fff',
            customClass: {
              container: 'font-sans',
              popup: 'rounded-lg',
              title: 'text-xl text-gray-800 font-semibold',
              content: 'text-gray-700',
              confirmButton: 'rounded-lg text-sm font-medium',
              cancelButton: 'rounded-lg text-sm font-medium'
            }
          }).then((result) => {
            console.log('Alert result:', result);
            if (result.isConfirmed) {
              console.log('Navigating to profile page...');
              navigate('/profile');
            }
          });
        } else {
          console.log('Profile exists, no action needed');
        }
      } catch (error) {
        console.error('Error in checkPregnancyProfile:', error);
        console.error('Error response:', error.response);
      }
    };

    // Chỉ check profile nếu có userInfo và không phải ADMIN
    if (userInfo && userInfo.role !== 'ADMIN') {
      checkPregnancyProfile();
    }
  }, []);

  return (  
    
    <div className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Main Content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-pink-100/95 backdrop-blur-sm rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Chào mừng bạn đến với Baby&Mom!</h2>
              <p className="text-xl text-gray-700">Hãy bắt đầu hành trình của bạn cùng chúng tôi.</p>
            </div>
            
            {/* Banner Image */}
            <div className="w-full h-[400px] relative mb-12">
              <img src={bannerImage} alt="Banner" className="w-full h-full object-cover rounded-lg shadow-lg" />
            </div>

            {/* Introduction Section */}
            <section className="flex flex-col md:flex-row items-center py-12 px-6 bg-pink-200/80 rounded-lg shadow-lg">
              <div className="md:w-1/2 text-left">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Nền tảng đồng hành cùng mẹ bầu trong hành trình thai kỳ</h3>
                <p className="text-lg text-gray-700">Baby&Mom là nền tảng trực tuyến hiện đại, cung cấp công cụ và thông tin hữu ích giúp mẹ bầu theo dõi thai kỳ toàn diện và khoa học. Với giao diện thân thiện, người dùng có thể ghi lại các mốc phát triển thai nhi, quản lý lịch khám, nhận gợi ý dinh dưỡng và chăm sóc sức khỏe theo từng giai đoạn.</p>
                <p className="text-lg text-gray-700 mt-4">Chúng tôi còn là nơi kết nối mẹ bầu, chia sẻ kinh nghiệm và nhận hỗ trợ từ các chuyên gia y tế. Baby&Mom cam kết đồng hành cùng bạn trong hành trình mang thai kỳ diệu, giúp bạn tự tin và hạnh phúc trong từng khoảnh khắc.</p>
              </div>
              <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
                <img src={introImage} alt="Giới thiệu" className="w-full max-w-sm rounded-lg shadow-lg" />
              </div>
            </section>

            {/* Pregnancy Care and Monitoring Section */}
            <section className="mt-12 py-12 px-6 bg-pink-100/80 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Chăm Sóc và Theo Dõi Thai Kỳ</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Monitoring Feature */}
                <Link to="/pregnancy-monitoring" className="block hover:transform hover:scale-105 transition-transform duration-300">
                  <div className="bg-white p-6 rounded-lg shadow-md h-full">
                    <h4 className="text-xl font-semibold text-purple-800 mb-4">Theo Dõi Thai Nhi</h4>
                    <p className="text-gray-700">Ghi chép và theo dõi sự phát triển của thai nhi theo từng tuần. Cập nhật cân nặng, chiều cao và các mốc phát triển quan trọng.</p>
                  </div>
                </Link>

                {/* Health Care Feature */}
                <Link to="/pregnancy-care" className="block hover:transform hover:scale-105 transition-transform duration-300">
                  <div className="bg-white p-6 rounded-lg shadow-md h-full">
                    <h4 className="text-xl font-semibold text-purple-800 mb-4">Chăm Sóc Sức Khỏe</h4>
                    <p className="text-gray-700">Nhận lời khuyên về dinh dưỡng, tập luyện và chế độ sinh hoạt phù hợp. Theo dõi các chỉ số sức khỏe quan trọng trong thai kỳ.</p>
                  </div>
                </Link>

                {/* Parenting Education Feature */}
                <Link to="/parenting-education" className="block hover:transform hover:scale-105 transition-transform duration-300">
                  <div className="bg-white p-6 rounded-lg shadow-md h-full">
                    <h4 className="text-xl font-semibold text-purple-800 mb-4">Giáo dục sớm & làm cha mẹ</h4>
                    <p className="text-gray-700">Chia sẻ những kiến thức cho những bậc cha mẹ để giúp con mình phát triển nhanh hơn. Xem các video hướng dẫn chi tiết.</p>
                  </div>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Homepage;
