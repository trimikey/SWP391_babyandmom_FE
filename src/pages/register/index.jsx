import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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
const App = () => (
  <Steps
    current={1}
    items={[
      {
        title: 'Finished',
        description,
      },
      {
        title: 'In Progress',
        description,
        subTitle: 'Left 00:00:08',
      },
      {
        title: 'Waiting',
        description,
      },
    ]}
  />
);

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

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
    
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (validateForm()) {
        const requestData = {
          ...formData,
        };

        const response = await api.post('register', requestData);
      
        if (response.data) {
          toast.success('Đăng ký thành công!');
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        }
      }
    } catch (err) {
      // Kiểm tra lỗi email đã tồn tại
      if (err.response?.data === 400 && err.response?.data?.includes('email')) {
        toast.error('Email này đã được sử dụng. Vui lòng sử dụng email khác.');
        setErrors(prev => ({
          ...prev,
          email: 'Email này đã được sử dụng'
        }));
      } else {
        toast.error(err.response?.data || 'Đăng ký thất bại');
      }
    } finally {
      setIsLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Đăng ký tài khoản
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                  className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                    errors.password ? "border-red-300" : "border-gray-300"
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
                  Độ mạnh mật khẩu:
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
            >
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </div>

          <div className="mt-6 text-center flex items-center justify-center">
            <p className="mr-2">Bạn đã có tài khoản?</p>
            <button
              onClick={handleNavigateLogin}
              className="text-pink-400 hover:text-pink-500 font-medium"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;