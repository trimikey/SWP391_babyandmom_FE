import React, { useState, useEffect } from 'react';
import { Collapse } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../config/axios';
import backgroundImage from '../../assets/background.jpg';

const { Panel } = Collapse;

const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleNavigation = (path) => {  
    navigate(path);
  };

  // Fetch FAQs from API
  const fetchFAQs = async () => {
    try {
      const response = await api.get('faqs');
      // Sắp xếp FAQ theo displayOrder
      const sortedFaqs = response.data.sort((a, b) => a.displayOrder - b.displayOrder);
      // Lọc chỉ lấy các FAQ đang active
      const activeFaqs = sortedFaqs.filter(faq => faq.isActive);
      setFaqs(activeFaqs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Header & Navigation */}


      {/* Main Content - thêm background màu trắng trong suốt */}
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Câu hỏi thường gặp
            </h1>
            <p className="text-lg text-gray-600">
              Tìm hiểu thêm về Baby&Mom và các dịch vụ của chúng tôi
            </p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            </div>
          ) : (
            <Collapse 
              defaultActiveKey={['0']} 
              className="bg-white rounded-lg shadow-lg"
            >
              {faqs.map((faq) => (
                <Panel 
                  key={faq.id}
                  header={
                    <div className="text-lg font-medium text-gray-800">
                      {faq.name}
                    </div>
                  }
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <div 
                    className="text-gray-600 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: faq.description }}
                  />
                </Panel>
              ))}
            </Collapse>
          )}

          {/* Hiển thị thông báo nếu không có FAQ */}
          {!loading && faqs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">Hiện tại chưa có câu hỏi thường gặp nào.</p>
            </div>
          )}

          {/* Phần liên hệ hỗ trợ */}
          <div className="mt-12 text-center bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Bạn không tìm thấy câu trả lời cần thiết?
            </h2>
            <p className="text-gray-600 mb-4">
              Đừng ngần ngại liên hệ với đội ngũ hỗ trợ của chúng tôi
            </p>
            <Link
              to="mailto:leductri12321@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white bg-pink-500 hover:bg-pink-600 transition-colors duration-200"
            >
              Liên hệ hỗ trợ
            </Link>
          </div>

          
        </div>
      </main>

    </div>
  );
};

export default FaqPage;

