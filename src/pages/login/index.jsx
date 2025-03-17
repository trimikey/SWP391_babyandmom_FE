import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import logoImage from '../../assets/logo1.jpg';
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    userName:""
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        const response = await api.post('login', formData);
        console.log('Response:', response.data);

        if (response.data.accessToken) {  
          const { accessToken, role, email,  userName } = response.data;
          const decodedToken = jwtDecode(accessToken);
          
          // Lưu user vào Redux store
          const userData = {
            id: decodedToken.id || decodedToken.sub, // Lấy id từ token
            email: email || decodedToken.sub,
            userName: userName || decodedToken.userName,
            role: role
          };
          
          console.log('User data to store:', userData); // Debug
          dispatch(setUser(userData));

          // Lưu token
          localStorage.setItem('token', accessToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          
          toast.success('Đăng nhập thành công!');

          if (role === 'ADMIN') {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
        }
      } catch (err) {
        console.error('Error:', err);
        if (err.response) {
          setLoginError("Email hoặc mật khẩu không đúng");
        } else {
          setLoginError("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.");
        }
       
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,                                  
      [name]: type === "checkbox" ? checked : value,
    }));
    
    if (loginError && (name === 'email' || name === 'password')) {
      setLoginError("");
    }
  };

  return (
    <div 
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/src/assets/background.jpg')",
        backgroundColor: 'rgba(255, 182, 193, 0.8)',
      }}
    >
      <div className="max-w-md w-full space-y-8 bg-white/100 backdrop-blur-sm p-8 rounded-xl shadow-lg">
        <div>
          <img
            className="mx-auto h-16 w-auto"
            src={logoImage}
            alt="Pregnancy Tracker Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập vào Baby&Mom
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Theo dõi thai kỳ của bạn một cách dễ dàng
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border ${
                    errors.email || loginError ? "border-red-300" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm`}
                  placeholder="Nhập email của bạn"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`appearance-none rounded-lg relative block w-full pl-10 pr-10 py-2 border ${
                    errors.password || loginError ? "border-red-300" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm`}
                  placeholder="Nhập mật khẩu của bạn"
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {errors.password}
                </p>
              )}
            </div>
          </div>
          
          {loginError && (
            <div className="rounded-md bg-red-50 p-2">
              <p className="text-sm text-center font-medium text-red-600">{loginError}</p>
            </div>
          )}
          
          <div className="text-sm text-right text-black-400 hover:text-pink-500 " >
              <Link to="/forgot-password" >
                Quên mật khẩu?
              </Link>
            </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-400 hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

              <div className="text-sm mt-4">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="text-black hover:text-pink-500 transition-colors duration-200">
                Đăng ký ngay
              </Link>
              </div>  
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;