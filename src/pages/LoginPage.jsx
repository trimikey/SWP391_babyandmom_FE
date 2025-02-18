import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/UseAuth"; // Import hàm login từ API
import "../styles/LoginPage.css";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // Gọi hàm đăng nhập từ API
    const [user, setUser] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user.email || !user.password) {
            setError("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        // const result = await login(user.email, user.password);
        const result = await login({ email: user.email, password: user.password });


        if (result.success) {
            navigate("/");
        } else {
            setError(result.message || "Sai email hoặc mật khẩu!");
        }
    };
    

    const handleGoogleLogin = () => {
        alert("Tính năng đăng nhập bằng Google chưa được triển khai.");
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <h2>Đăng nhập</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Mật khẩu" value={user.password} onChange={handleChange} required />
                    <button type="submit">Đăng nhập</button>
                </form>

                <button className="google-login-btn" onClick={handleGoogleLogin}>
                    Đăng nhập bằng Google
                </button>

                <div className="extra-links">
                    <p><a href="/forgot-password">Quên mật khẩu?</a></p>
                    <p>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
