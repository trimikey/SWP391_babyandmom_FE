import React from 'react';

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Liên hệ</h1>
      <p className="text-gray-600 mb-6">
        Nếu bạn có bất kỳ câu hỏi nào về hồ sơ thai kỳ, vui lòng liên hệ với chúng tôi qua email: 
        <a href="mailto:leductri12321@gmail.com" className="text-blue-600 underline">support@babyandmom.com</a> 
        hoặc gọi điện thoại: <span className="font-semibold">123-456-7890</span>.
      </p>

      {/* Biểu mẫu liên hệ */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Gửi tin nhắn cho chúng tôi</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Tên của bạn</label>
            <input type="text" className="w-full p-2 border rounded-lg" placeholder="Nhập tên của bạn" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email" className="w-full p-2 border rounded-lg" placeholder="Nhập email của bạn" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tin nhắn</label>
            <textarea className="w-full p-2 border rounded-lg" rows="4" placeholder="Nhập tin nhắn của bạn"></textarea>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Gửi</button>
        </form>
      </div>

      {/* Thông tin mạng xã hội */}
      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold">Theo dõi chúng tôi</h2>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="text-blue-600">Facebook</a>
          <a href="#" className="text-blue-400">Twitter</a>
          <a href="#" className="text-red-600">YouTube</a>
        </div>
      </div>

      {/* Bản đồ nhúng */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Địa chỉ của chúng tôi</h2>
        <iframe
          className="w-full h-64 rounded-lg"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6384961636585!2d106.66397411526061!3d10.762622692334055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ef8871b5b7f%3A0x67cf04a0030b1f3b!2zU29tZSBBZGRyZXNz!5e0!3m2!1sen!2s!4v1618380443345!5m2!1sen!2s"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
