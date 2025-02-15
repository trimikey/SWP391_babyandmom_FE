import React, { useState } from "react";
import "../styles/LoginPage.css"; // Tái sử dụng CSS đăng nhập

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Liên kết đặt lại mật khẩu đã gửi đến ${email}`);
    };

    return (
        <div className="login-page">
            <h2>Quên mật khẩu?</h2>
            <p>Nhập email để nhận liên kết đặt lại mật khẩu.</p>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit">Gửi yêu cầu</button>
            </form>
            <p><a href="/login">Quay lại đăng nhập</a></p>
        </div>
    );
};

export default ForgotPassword;
