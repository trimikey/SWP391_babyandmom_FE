import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState(
    {
      userName: "",
      phoneNumber: "",
      email: "",
      password: ""
    });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [duplicateEmailError, setDuplicateEmailError] = useState(null);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].reduce((acc, regex) => acc + regex.test(password), password.length >= 8 ? 1 : 0);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName.trim()) newErrors.userName = "Tên người dùng là bắt buộc";
    if (!formData.phoneNumber.trim() || !/^0\d{9}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    if (!formData.email.trim() || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) newErrors.email = "Email không hợp lệ";
    if (!formData.password || formData.password.length < 6) newErrors.password = "Mật khẩu ít nhất 6 ký tự";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") setPasswordStrength(validatePassword(value));  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setDuplicateEmailError(null);
    try {
      const response = await api.post("register", formData);
      toast.success("Đăng ký thành công!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Đăng ký thất bại";
      if (err.response?.status === 400 && errorMessage.includes("Email")) {
        setDuplicateEmailError("Email này đã được sử dụng.");
        setErrors((prev) => ({ ...prev, email: "Email này đã được sử dụng" }));
      } else toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">Đăng ký tài khoản</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {["userName", "phoneNumber", "email", "password"].map((field, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium text-gray-700">{field === "userName" ? "Tên người dùng" : field === "phoneNumber" ? "Số điện thoại" : field === "email" ? "Email" : "Mật khẩu"}</label>
              <div className="relative">
                <input
                  type={field === "password" && !showPassword ? "password" : "text"}
                  name={field}
                  className={`w-full px-3 py-2 border rounded-lg ${errors[field] ? "border-red-300" : "border-gray-300"}`}
                  placeholder={`Nhập ${field === "userName" ? "tên người dùng" : field === "phoneNumber" ? "số điện thoại" : field === "email" ? "email" : "mật khẩu"}`}
                  value={formData[field]}
                  onChange={handleChange}
                />
                {field === "password" && (
                  <button type="button" className="absolute inset-y-0 right-3" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" />}
                  </button>
                )}
              </div>
              {errors[field] && <p className="mt-2 text-sm text-red-600">{errors[field]}</p>}
            </div>
          ))}
          <button type="submit" disabled={isLoading} className="w-full py-2 px-4 text-white bg-pink-400 rounded-md hover:bg-pink-500">
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </button>
          {duplicateEmailError && <p className="mt-2 text-sm text-red-600 text-center">{duplicateEmailError}</p>}
          <div className="mt-6 text-center">
            <p>Bạn đã có tài khoản? <button onClick={() => navigate("/login")} className="text-pink-400 hover:text-pink-500 font-medium">Đăng nhập</button></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
