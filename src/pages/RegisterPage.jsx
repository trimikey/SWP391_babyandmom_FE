import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterPage.css";

const Register = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (user.password !== user.confirmPassword) {
            alert("Mật khẩu không khớp!");
            return;
        }
        alert("Đăng ký thành công!");
        navigate("/login");
    };

    return (
        <div className="register-page">
            <h2>Đăng ký tài khoản</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Họ và tên" value={user.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Mật khẩu" value={user.password} onChange={handleChange} required />
                <input type="password" name="confirmPassword" placeholder="Xác nhận mật khẩu" value={user.confirmPassword} onChange={handleChange} required />
                <button type="submit">Đăng ký</button>
            </form>
            <p>Đã có tài khoản? <a href="/login">Đăng nhập</a></p>
        </div>
    );
};

export default Register;
