import React from "react";
import { useNavigate } from "react-router-dom";
import "./Service.css"; // File CSS riêng cho trang này

const ServicePage = () => {
    const navigate = useNavigate();

    return (
        <div className="service-page">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="logo">Baby And Mom</div>
                <ul className="nav-links">
                    <li><a href="/">Trang chủ</a></li>
                    <li><a href="/service">Dịch vụ</a></li>
                    <li><a href="/blog">Blog</a></li>
                    <li><a href="/faq">FAQ</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                </ul>
            </nav>

            {/* Service Section */}
            <section className="service-section">
                <h2>Các Gói Dịch Vụ</h2>
                <div className="service-container">
                    {/* Gói Cơ Bản */}
                    <div className="service-box">
                        <h3>Cơ bản</h3>
                        <p className="price">Miễn Phí</p>
                        <ul>
                            <li>✅ Theo dõi cân nặng cơ bản</li>
                            <li>✅ Blog chia sẻ cá nhân</li>
                            <li>✅ Lịch nhắc nhở</li>
                        </ul>
                        <button className="service-btn">Chọn Gói Này</button>
                    </div>

                    {/* Gói Tiêu Chuẩn */}
                    <div className="service-box">
                        <h3>Tiêu Chuẩn</h3>
                        <p className="price">199.000đ/tháng</p>
                        <ul>
                            <li>✅ Tất cả tính năng cơ bản</li>
                            <li>✅ Cảnh báo bất thường</li>
                            <li>✅ Biểu đồ tăng trưởng chi tiết</li>
                        </ul>
                        <button className="service-btn">Chọn Gói Này</button>
                    </div>

                    {/* Gói Cao Cấp */}
                    <div className="service-box">
                        <h3>Cao cấp</h3>
                        <p className="price">499.000đ/tháng</p>
                        <ul>
                            <li>✅ Tất cả tính năng tiêu chuẩn</li>
                            <li>✅ Ưu tiên hỗ trợ</li>
                            <li>✅ Báo cáo chi tiết</li>
                        </ul>
                        <button className="service-btn">Chọn Gói Này</button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <h3>Trung tâm Baby and Mom</h3>
                    <p>Ứng dụng cung cấp thông tin và giải pháp giúp mẹ bầu theo dõi thai kỳ một cách chính xác và an toàn.</p>
                </div>
                <div className="footer-links">
                    <h4>Explore</h4>
                    <ul>
                        <li><a href="/">Trang chủ</a></li>
                        <li><a href="/services">Dịch vụ</a></li>
                        <li><a href="/blog">Blog</a></li>
                        <li><a href="/faq">FAQ</a></li>
                        <li><a href="/dashboard">Dashboard</a></li>
                    </ul>
                </div>
            </footer>
        </div>
    );
};

export default ServicePage;
