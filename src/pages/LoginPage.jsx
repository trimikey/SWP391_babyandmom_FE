import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

const LoginPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user.email || !user.password) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        alert("Đăng nhập thành công!");
        navigate("/dashboard");
    };

    const handleGoogleLogin = () => {
        alert("Tính năng đăng nhập bằng Google chưa được triển khai.");
    };

    return (
        <div className="login-page">
            <h2>Đăng nhập</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Mật khẩu" value={user.password} onChange={handleChange} required />
                <button type="submit">Đăng nhập</button>
            </form>

            <button className="google-login-btn" onClick={handleGoogleLogin}>
                Đăng nhập bằng Google
            </button>

            <p><a href="/forgot-password">Quên mật khẩu?</a></p>
            <p>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
        </div>
    );
};

export default LoginPage;
