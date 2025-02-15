import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <h1>Chào mừng đến với Baby & Mom</h1>
                <p>Theo dõi thai kỳ dễ dàng và an toàn với ứng dụng của chúng tôi.</p>
                <button className="cta-button" onClick={() => navigate("/register")}>
                    Bắt đầu ngay
                </button>
            </section>

            {/* Tính năng chính */}
            <section className="features-section">
                <div className="feature-box">
                    <h3>📊 Theo dõi sức khỏe</h3>
                    <p>Cập nhật cân nặng, nhịp tim và sức khỏe mẹ bầu.</p>
                </div>
                <div className="feature-box">
                    <h3>📅 Lịch nhắc nhở</h3>
                    <p>Đặt lịch khám thai, uống vitamin và theo dõi lịch tiêm chủng.</p>
                </div>
                <div className="feature-box">
                    <h3>📖 Blog & Cộng đồng</h3>
                    <p>Chia sẻ kiến thức, kinh nghiệm mang thai từ chuyên gia.</p>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
