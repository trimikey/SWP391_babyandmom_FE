import { useState, useEffect } from "react";
import { Steps } from 'antd';

import {
  FaEye,
  FaEyeSlash,

} from "react-icons/fa";
import { auth } from "../../config/firebase";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const description = 'This is a description.'


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    phoneNumber: "",
    email: "",
    password: "",
    dueDate: "",
    currentWeek: 1,
    lastPeriod: "",
    height: 0.1,
    babyName: "",
    babyGender: "unknown"
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Thông tin cá nhân',
      description: 'Đăng ký tài khoản',
    },
    {
      title: 'Xác nhận thai kỳ',
      description: 'Tình trạng thai kỳ',
    },
    {
      title: 'Thông tin thai kỳ',
      description: 'Thông tin em bé',
    }
  ];

  const validatePassword = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Tên là bắt buộc";
    }
    if (!formData.userName.trim()) {
      newErrors.userName = "Tên người dùng là bắt buộc";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Số điện thoại là bắt buộc";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordStrength(validatePassword(value));
    }

    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value) newErrors.name = "Tên là bắt buộc";
        else if (value.length < 4)
          newErrors.name = "Tên phải có ít nhất 2 ký tự";
        else if (!/^[a-zA-Z0-9]+$/.test(value))
          newErrors.userName = "Tên người dùng chỉ được nhập chữ cái và số";
        else delete newErrors.name;
        break;

      case "userName":
        if (!value) newErrors.userName = "Tên người dùng là bắt buộc";
       
        else if (value.length > 20)
          newErrors.userName = "Tên người dùng không được vượt quá 20 ký tự";
        else if (!/^[a-zA-Z0-9]+$/.test(value))
          newErrors.userName = "Tên người dùng chỉ được nhập chữ cái và số";
        else delete newErrors.userName;
        break;

        case "phoneNumber":
          if (!value) {
              newErrors.phoneNumber = "Số điện thoại là bắt buộc";
          } else if (!/^0\d{9}$/.test(value)) {  
              newErrors.phoneNumber = "Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng 0";
          } else {
              delete newErrors.phoneNumber;
          }
          break;
      
      

      case "email":
        if (!value) newErrors.email = "Email là bắt buộc";
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
          newErrors.email = "Email không hợp lệ";
        else delete newErrors.email;
        break;

      case "password":
        if (!value) newErrors.password = "Mật khẩu là bắt buộc";
        else if (value.length < 6)
          newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        else if (!/(?=.*[A-Z])/.test(value))
          newErrors.password = "Mật khẩu phải có ít nhất một chữ cái in hoa";
        else if (!/(?=.*[a-z])/.test(value))
          newErrors.password = "Mật khẩu phải có ít nhất một chữ cái thường";
        else if (!/(?=.*[0-9])/.test(value))
          newErrors.password = "Mật khẩu phải có ít nhất một chữ số";
        else if (!/(?=.*[!@#$%^&*])/.test(value))
          newErrors.password = "Mật khẩu phải có ít nhất một ký tự đặc biệt";
        else delete newErrors.password;
        break;
        case "height":
          if (value <= 0)
            newErrors.height = "Chiều cao phải lớn hơn 0";
          else delete newErrors.height;
          break;
    
        case "lastPeriod":
          if (value) {
            const lastPeriodDate = new Date(value);
            const dueDate = new Date(lastPeriodDate);
            dueDate.setMonth(dueDate.getMonth() + 9);
            dueDate.setDate(dueDate.getDate() + 10);
            
            setFormData(prev => ({
              ...prev,
              dueDate: dueDate.toISOString().split('T')[0]
            }));
          }
          break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep === 0) {
      if (validateForm()) {
        setCurrentStep(1);
      }
    } else {
      setIsLoading(true);
      try {
        const requestData = {
          ...formData,
          dueDate: new Date(formData.dueDate).toISOString(),
          lastPeriod: formData.lastPeriod,
          currentWeek: parseInt(formData.currentWeek),
          height: parseFloat(formData.height)
        };

        const response = await api.post('register', requestData);
      
      if (response.data) {
        toast.success('Đăng ký thành công!');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      // Kiểm tra lỗi email đã tồn tại
      if (err.response?.data === 400 && err.response?.data?.includes('email')) {
        toast.error('Email này đã được sử dụng. Vui lòng sử dụng email khác.');
        setErrors(prev => ({
          ...prev,
          email: 'Email này đã được sử dụng'
        }));
        // Quay lại bước 1 để người dùng sửa email
        setCurrentStep(0);
      } else {
        toast.error(err.response?.data || 'Đăng ký thất bại');
      }
    } finally {
      setIsLoading(false);
    }
  }
};

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-red-400";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-yellow-400";
      case 4:
        return "bg-green-500";
      case 5:
        return "bg-green-400";
      default:
        return "bg-gray-200";
    }
  };

  
  const handleNavigateLogin = () => {
    navigate('/login');
  };

  const handleBack = () => {
    console.log("Handling back action...");
    setCurrentStep(0);
    navigate('/register', { replace: true });
  };

  const handlePregnancyConfirmation = async (isPregnant) => {
    if (isPregnant) {
      setCurrentStep(2); // Chuyển đến form thông tin em bé
    } else {
      // Nếu không mang thai, đăng ký tài khoản không có thông tin thai kỳ
      setIsLoading(true);
      try {
        const response = await api.post('register', formData);
        toast.success('Đăng ký thành công!');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } catch (err) {
        toast.error(err.response?.data || 'Đăng ký thất bại');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderPregnancyConfirmation = () => (
    <div className="mt-8 space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">Bạn có đang mang thai không?</h3>
        <p className="mt-1 text-sm text-gray-500">
          Thông tin này giúp chúng tôi cung cấp dịch vụ phù hợp nhất cho bạn
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => handlePregnancyConfirmation(true)}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          Có, tôi đang mang thai
        </button>
        <button
          onClick={() => handlePregnancyConfirmation(false)}
          className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          Không, tôi chưa mang thai
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <Steps current={currentStep} items={steps} className="mb-8" />
        
        {currentStep === 0 ? (
          <form className="mt-8 space-y-6" onSubmit={(e) => {
            e.preventDefault();
            if (validateForm()) {
              setCurrentStep(1);
            }
          }}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Tên
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${errors.name ? "border-red-300" : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                  placeholder="Nhập tên của bạn"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                  Tên người dùng
                </label>
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  required
                  className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${errors.userName ? "border-red-300" : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                  placeholder="Nhập tên người dùng"
                  value={formData.userName}
                  onChange={handleChange}
                />
                {errors.userName && (
                  <p className="mt-2 text-sm text-red-600">{errors.userName}</p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  required
                  className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${errors.phoneNumber ? "border-red-300" : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                  placeholder="Nhập số điện thoại"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                {errors.phoneNumber && (
                  <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${errors.email ? "border-red-300" : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                  placeholder="Nhập email của bạn"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${errors.password ? "border-red-300" : "border-gray-300"
                      } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
                <div className="mt-2">
                  <div className="text-sm text-gray-600 mb-1">
                    Password strength:
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {isLoading ? "Đang xử lý..." : "Tiếp tục"}
              </button>
            </div>

          

            <div className="mt-6 text-center flex items-center justify-center">
              <p className="mr-2">Bạn đã có tài khoản?</p>
              <button
                onClick={handleNavigateLogin}
                className="text-sm text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Đăng nhập
              </button>
            </div>
          </form>
        ) : currentStep === 1 ? (
          renderPregnancyConfirmation()
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="babyName" className="block text-sm font-medium text-gray-700">
                  Tên em bé
                </label>
                <input
                  type="text"
                  name="babyName"
                  id="babyName"
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  value={formData.babyName}
                  onChange={handleChange}
                  placeholder="Nhập tên em bé (nếu đã có)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Giới tính em bé
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="babyGender"
                      value="male"
                      checked={formData.babyGender === "male"}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-purple-600"
                    />
                    <span className="ml-2">Nam</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="babyGender"
                      value="female"
                      checked={formData.babyGender === "female"}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-purple-600"
                    />
                    <span className="ml-2">Nữ</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="babyGender"
                      value="unknown"
                      checked={formData.babyGender === "unknown"}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-purple-600"
                    />
                    <span className="ml-2">Chưa rõ</span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                  Ngày dự sinh
                </label>
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="lastPeriod" className="block text-sm font-medium text-gray-700">
                  Kỳ kinh nguyệt cuối cùng
                </label>
                <input
                  type="date"
                  name="lastPeriod"
                  id="lastPeriod"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  value={formData.lastPeriod}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                  Chiều cao (cm)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="height"
                  id="height"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  value={formData.height}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setCurrentStep(0)}
                className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Quay lại
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {isLoading ? "Đang đăng ký..." : "Hoàn thành đăng ký"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
