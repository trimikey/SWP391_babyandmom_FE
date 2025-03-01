import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../config/axios';
import HeaderU from '../../components/Header/HeaderU';
import Footer from '../../components/Footer/Footer';
import backgroundImage from '../../assets/background.jpg';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal'); // personal, child, password
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: ''
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    childName: '',
    childBirthday: '',
    childGender: '',
    pregnancyWeek: ''
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/user/profile');
        console.log('Profile data:', response.data);
        
        // Update both states
        setProfileData(response.data);
        setFormData(prevState => ({
          ...prevState,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone || ''
        }));
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Không thể tải thông tin profile');
      }
    };

    fetchProfile();
  }, []);

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
      const response = await api.put('/update/profile', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });

      console.log('Update response:', response.data);
      setProfileData(response.data);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin!');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Mật khẩu mới không khớp!');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      console.log('Password update response:', response.data);
      toast.success('Đổi mật khẩu thành công!');
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Password update error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu!');
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
          disabled
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
    <form onSubmit={handlePasswordChange} className="space-y-6">
      <h2 className="text-xl font-semibold text-pink-600 mb-6">Đổi Mật Khẩu</h2>
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Mật khẩu hiện tại</label>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:border-purple-500"
          required
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
          required
          minLength={6}
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
          required
          minLength={6}
        />
      </div>
      <button
        type="submit"
        className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        disabled={loading}
      >
        {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
      </button>
    </form>
  );

  return (
    <>
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      <div className="py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg">
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
        </div>
      </div>
    </>
  );
};

export default Profile;
