import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import HeaderU from '../../components/Header/HeaderU';
import Footer from '../../components/Footer/Footer';
import backgroundImage from '../../assets/background.jpg';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal'); // personal, child, password
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    childName: '',
    childBirthday: '',
    childGender: '',
    pregnancyWeek: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserProfile(formData);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật thông tin!');
    } finally {
      setLoading(false);
    }
  };

  // Component cho thông tin cá nhân
  const PersonalInfo = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-pink-600 mb-6">Thông Tin Cá Nhân</h2>
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Họ và tên</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:border-purple-500"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:border-purple-500"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Số điện thoại</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:border-pink-500"
        />
      </div>
      <button
        type="submit"
        className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        disabled={loading}
      >
        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
      </button>
    </form>
  );

  // Component cho thông tin con
  const ChildInfo = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-pink-600 mb-6">Thông Tin Con</h2>
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Tên con</label>
        <input
          type="text"
          name="childName"
          value={formData.childName}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:border-purple-500"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Ngày sinh/Dự sinh</label>
        <input
          type="date"
          name="childBirthday"
          value={formData.childBirthday}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:border-purple-500"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Tuần thai</label>
        <input
          type="number"
          name="pregnancyWeek"
          value={formData.pregnancyWeek}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:border-purple-500"
        />
      </div>
      <button
        type="submit"
        className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        disabled={loading}
      >
        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
      </button>
    </form>
  );

  // Component cho đổi mật khẩu
  const PasswordChange = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-pink-600 mb-6">Đổi Mật Khẩu</h2>
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Mật khẩu hiện tại</label>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:border-purple-500"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Mật khẩu mới</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:border-purple-500"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Xác nhận mật khẩu mới</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:border-purple-500"
        />
      </div>
      <button
        type="submit"
        className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        disabled={loading}
      >
        {loading ? 'Đang lưu...' : 'Đổi mật khẩu'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}>
      
      <HeaderU />
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-pink-50 p-6 border-r border-pink-100">
            <h1 className="text-xl font-bold text-pink-600 mb-6">Tài Khoản</h1>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('personal')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'personal'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-700 hover:bg-purple-100'
                }`}
              >
                Thông tin bạn
              </button>
              <button
                onClick={() => setActiveTab('child')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'child'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-700 hover:bg-pink-100'
                }`}
              >
                Thông tin con
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'password'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-700 hover:bg-pink-100'
                }`}
              >
                Đổi mật khẩu
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {activeTab === 'personal' && <PersonalInfo />}
            {activeTab === 'child' && <ChildInfo />}
            {activeTab === 'password' && <PasswordChange />}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Profile;
