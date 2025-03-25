import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import api from "../../config/axios";
import logoImage from "../../assets/logo1.jpg";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const { data } = await api.post("login", formData);
      if (data.accessToken) {
        const decodedToken = jwtDecode(data.accessToken);
        const userData = {
          id: data.id || decodedToken.id,
          email: data.email || decodedToken.sub,
          userName: data.userName || decodedToken.userName,
          role: data.role,
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("token", data.accessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
        toast.success("Đăng nhập thành công!");
        navigate(userData.role === "ADMIN" ? "/dashboard" : "/");
      }
    } catch (err) {
      setLoginError("Email hoặc mật khẩu không đúng");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/src/assets/background.jpg')" }}>
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <img className="mx-auto h-16" src={logoImage} alt="Pregnancy Tracker Logo" />
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Đăng nhập vào Baby&Mom</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {[{ label: "Email", name: "email", type: "email", icon: FaUser }, { label: "Mật khẩu", name: "password", type: showPassword ? "text" : "password", icon: FaLock }].map(({ label, name, type, icon: Icon }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    name={name}
                    type={type}
                    className="w-full pl-10 pr-10 py-2 border rounded-lg text-gray-900 focus:ring focus:border-purple-500"
                    placeholder={`Nhập ${label.toLowerCase()} của bạn`}
                    value={formData[name]}
                    onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                  />
                  {name === "password" && (
                    <button type="button" className="absolute right-3 top-2.5" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                    </button>
                  )}
                </div>
                {errors[name] && <p className="text-sm text-red-600">{errors[name]}</p>}
              </div>
            ))}
          </div>
          {loginError && <p className="text-center text-sm text-red-600">{loginError}</p>}
          <div className="text-right text-sm">
            <Link to="/forgot-password" className="text-pink-500">Quên mật khẩu?</Link>
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 disabled:opacity-50">
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
          <p className="text-sm text-center mt-4">Chưa có tài khoản? <Link to="/register" className="text-pink-500">Đăng ký ngay</Link></p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
