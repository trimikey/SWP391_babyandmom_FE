import React from "react";
import "../styles/Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <h3>Baby & Mom</h3>
                <p>Ứng dụng giúp mẹ bầu theo dõi thai kỳ một cách chính xác và an toàn.</p>
            </div>
            <div className="footer-links">
                <ul>
                    <li><a href="/">Trang chủ</a></li>
                    <li><a href="/services">Dịch vụ</a></li>
                    <li><a href="/blog">Blog</a></li>
                    <li><a href="/faq">FAQ</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
