import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/">Baby & Mom</Link>
            </div>
            <ul className="nav-links">
                <li><Link to="/">Trang chủ</Link></li>
                <li><Link to="/services">Dịch vụ</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/register">Đăng ký</Link></li>
                <li><Link to="/login">Đăng nhập</Link></li>
            </ul>
        </nav>
    );
};

export default Header;
