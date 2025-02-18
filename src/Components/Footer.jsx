import React from "react";
import "../styles/Footer.css";
import { FaFacebook, FaTiktok } from "react-icons/fa";
import { SiZalo } from "react-icons/si"; // Zalo icon

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <h3>Baby & Mom</h3>
                <p>Ứng dụng giúp mẹ bầu theo dõi thai kỳ một cách chính xác và an toàn.</p>
            </div>

            {/* Links */}
            <div className="footer-links">
                <ul>
                    <li><a href="/">Trang chủ</a></li>
                    <li><a href="/services">Dịch vụ</a></li>
                    <li><a href="/blog">Blog</a></li>
                    <li><a href="/faq">FAQ</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                </ul>
            </div>

            {/* Social Media */}
            <div className="footer-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <FaFacebook className="social-icon facebook" />
                </a>
                <a href="https://zalo.me" target="_blank" rel="noopener noreferrer">
                    <SiZalo className="social-icon zalo" />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                    <FaTiktok className="social-icon tiktok" />
                </a>
            </div>
        </footer>
    );
};

export default Footer;
