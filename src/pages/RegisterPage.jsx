import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/UseAuth"; // Import useAuth
import "../styles/RegisterPage.css";

const Register = () => {
    const navigate = useNavigate();
    const { register, loading, error } = useAuth();
    const [user, setUser] = useState({
        name: "",
        username: "",
        email: "",
        phone: "",
        password: ""
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(user);

        if (result.success) {
            alert(result.message);
            navigate("/login");
        }
    };

    return (
        <div className="register-page">
            <h2>Đăng ký tài khoản</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Họ và tên" value={user.name} onChange={handleChange} required />
                <input type="text" name="username" placeholder="Tên người dùng" value={user.username} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Số điện thoại" value={user.phone} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Mật khẩu" value={user.password} onChange={handleChange} required />
                <button type="submit" disabled={loading}>{loading ? "Đang đăng ký..." : "Đăng ký"}</button>
            </form>
            <p>Đã có tài khoản? <a href="/login">Đăng nhập</a></p>
        </div>
    );
};

export default Register;
