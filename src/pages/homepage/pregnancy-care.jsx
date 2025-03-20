import React from 'react';

import backgroundImage from '../../assets/background.jpg';

const PregnancyCare = () => {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h1 className="text-3xl font-bold text-pink-600 mb-8 text-center">
        Chăm Sóc Thai Kỳ
      </h1>

      <div className="max-w-7xl mx-auto">
        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Video Section 1 */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="aspect-video w-full mb-3">
              <iframe 
                className="w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/7sxvTLhqNU8?si=uTtghtIsQBswLwtT" 
                title="Những điều cần biết khi mang thai 3 tháng đầu"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
            <h2 className="text-lg font-semibold text-purple-700 mb-2">
              Những điều cần biết khi mang thai 3 tháng đầu
            </h2>
            <p className="text-gray-700 text-sm">
              Hướng dẫn chi tiết về các thay đổi của cơ thể và những điều cần lưu ý trong 3 tháng đầu.
            </p>
          </div>

          {/* Video Section 2 */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="aspect-video w-full mb-3">
              <iframe 
                className="w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/Nhgphzopxj8?si=HQAPOJivRDwMJFsE" 
                title="Chế độ dinh dưỡng cho bà bầu"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
            <h2 className="text-lg font-semibold text-purple-700 mb-2">
              Chế độ dinh dưỡng cho bà bầu
            </h2>
            <p className="text-gray-700 text-sm">
              Tìm hiểu về các nhóm thực phẩm cần thiết và chế độ dinh dưỡng trong thai kỳ.
            </p>
          </div>

          {/* Video Section 3 */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="aspect-video w-full mb-3">
              <iframe 
                className="w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/OdORjnmUJEo?si=qybTKqdiV2mrmA9T" 
                title="Các bài tập cho bà bầu"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
            <h2 className="text-lg font-semibold text-purple-700 mb-2">
              Các bài tập an toàn cho bà bầu
            </h2>
            <p className="text-gray-700 text-sm">
              Hướng dẫn các bài tập nhẹ nhàng, an toàn cho mẹ bầu.
            </p>
          </div>

          {/* Video Section 4 */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="aspect-video w-full mb-3">
              <iframe 
                className="w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/jIDGvtLJK5Y?si=U2ZKk7fvCFaQ42Uv" 
                title="Hướng dẫn chăm sóc thai kỳ"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
            <h2 className="text-lg font-semibold text-purple-700 mb-2">
              Hướng dẫn chăm sóc thai kỳ toàn diện
            </h2>
            <p className="text-gray-700 text-sm">
              Tổng hợp kiến thức cần thiết về chăm sóc thai kỳ hàng ngày.
            </p>
          </div>

          {/* Video Section 5 */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="aspect-video w-full mb-3">
              <iframe 
                className="w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/xig2j_EUPnU?si=UPxcm12Ns689OwcP" 
                title="Những dấu hiệu bất thường khi mang thai"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
            <h2 className="text-lg font-semibold text-purple-700 mb-2">
              Những dấu hiệu bất thường khi mang thai
            </h2>
            <p className="text-gray-700 text-sm">
              Nhận biết các dấu hiệu cần chú ý và cách xử lý khi gặp tình huống bất thường.
            </p>
          </div>

          {/* Video Section 6 */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="aspect-video w-full mb-3">
              <iframe 
                className="w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/iSe8kWqUY7M?si=pkYFo4n4kyZ5gezQ" 
                title="Chuẩn bị sinh nở"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
            <h2 className="text-lg font-semibold text-purple-700 mb-2">
              Chuẩn bị sinh nở
            </h2>
            <p className="text-gray-700 text-sm">
              Hướng dẫn chuẩn bị đồ đạc và tinh thần cho quá trình sinh nở.
            </p>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-purple-50 p-6 rounded-lg shadow-lg mt-8">
          <p className="font-semibold text-purple-700 text-lg mb-3">Lưu ý quan trọng:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Luôn tham khảo ý kiến bác sĩ trước khi áp dụng bất kỳ chế độ ăn hoặc bài tập mới</li>
            <li>Mỗi thai kỳ là khác nhau, hãy lắng nghe cơ thể và điều chỉnh phù hợp</li>
            <li>Theo dõi định kỳ với bác sĩ để đảm bảo thai kỳ khỏe mạnh</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PregnancyCare;
