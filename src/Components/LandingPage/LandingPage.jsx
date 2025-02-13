import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/");
    };

    return (
        <div className="landing-page">
            {/* --- Navigation Bar --- */}
            <nav className="navbar">
                <div className="logo" onClick={() => navigate("/")}>Baby And Mom</div>
                <ul className="nav-links">
                    <li><a onClick={() => navigate("/")}>Trang chủ</a></li>
                    <li><a onClick={() => navigate("/services")}>Dịch vụ</a></li>
                    <li><a onClick={() => navigate("/blog")}>Blog</a></li>
                    <li><a onClick={() => navigate("/faq")}>FAQ</a></li>
                    <li><a onClick={() => navigate("/dashboard")}>Dashboard</a></li>
                </ul>
                <div className="auth-buttons">
                    <button className="secondary-btn" onClick={() => navigate("/login")}>Login</button>
                    <button className="primary-btn" onClick={() => navigate("/register")}>Register</button>
                </div>
            </nav>

            {/* --- Hero Section --- */}
            <header className="hero">
                <div className="hero-content">
                    <h1>Trung Tâm Baby And Mom</h1>
                    <p>Hành trình thai kỳ của mẹ, niềm vui của bé</p>
                    <p>Theo dõi sự phát triển của thai nhi, nhận thông tin và lời khuyên cho thai kỳ luôn khỏe mạnh</p>
                    <div className="buttons">
                        <button className="primary-btn" onClick={() => navigate("/register")}>Đăng Thai Miễn Phí</button>
                        <button className="secondary-btn" onClick={() => navigate("/about")}>Xem Thêm</button>
                    </div>
                </div>
                <img src="https://th.bing.com/th/id/OIP.nnfKw5DFBKUh7OouQv2uGwHaE7?w=259&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="Baby and Mom" className="hero-image" />
            </header>

            {/* --- About Section --- */}
            <section className="about">
                <h2>Giới thiệu</h2> 
                <div className="about-content">
                    <div className="text">
                        <h3>Nền tảng đồng hành cùng mẹ bầu trong hành trình thai kỳ</h3>
                        <p>
                            Baby and Mom là nền tảng trực tuyến hiện đại, cung cấp công cụ và tài nguyên giúp mẹ bầu theo dõi sự phát triển của thai nhi,
                            nhận thông tin về sức khỏe và tận hưởng hành trình làm mẹ một cách dễ dàng hơn.
                        </p>
                        <button className="secondary-btn" onClick={() => navigate("/about")}>Xem Thêm</button>
                    </div>
                    <img src="https://th.bing.com/th/id/OIP.IdS3GB2jzW37W1lSwzHuawHaDt?w=305&h=174&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="Baby and Mom" className="hero-image" />
                </div>
            </section>

            {/* --- Blog Section --- */}
            <section className="blog">
                <h2>Blog</h2>
                <div className="blog-content">
                    <img src="https://th.bing.com/th/id/OIP.oTH53Rx7bniews1HcwCabAHaE8?w=236&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="Baby and Mom" className="hero-image" />
                    <div className="text">
                        <h3>Những bài viết hữu ích cho mẹ bầu</h3>
                        <p>
                            Khám phá những bài viết đáng giá, giúp mẹ có thêm kiến thức trong suốt thai kỳ: từ chế độ dinh dưỡng, chăm sóc sức khỏe đến
                            bí quyết nuôi dạy con.
                        </p>
                        <button className="secondary-btn" onClick={() => navigate("/blog")}>Xem Thêm</button>
                    </div>
                </div>
            </section>

            {/* --- Call to Action --- */}
            <section className="cta">
                <h2>Bắt đầu hành trình thai kỳ của bạn ngay hôm nay</h2>
                <button className="primary-btn" onClick={() => navigate("/register")}>Đăng Ký Ngay</button>
            </section>

            {/* --- Footer --- */}
            <footer className="footer">
                <div className="footer-content">
                    <h3>Trung tâm Baby and Mom</h3>
                    <p>Ứng dụng miễn phí này cung cấp giải pháp cho nhu cầu sức khỏe của bạn bằng cách cung cấp
Bạn có quyền truy cập một lần để có thông tin đầy đủ về nhiều
kiểm tra y tế. Ứng dụng này mang đến những mẹo và lời khuyên đơn giản để
giúp bạn duy trì lối sống lành mạnh.</p>
                </div>
                <div className="footer-links">
                    <h4>Explore</h4>
                    <ul>
                        <li><a onClick={() => navigate("/")}>Trang chủ</a></li>
                        <li><a onClick={() => navigate("/services")}>Dịch vụ</a></li>
                        <li><a onClick={() => navigate("/blog")}>Blog</a></li>
                        <li><a onClick={() => navigate("/faq")}>FAQ</a></li>
                        <li><a onClick={() => navigate("/dashboard")}>Dashboard</a></li>
                    </ul>
                </div>
                <div className="social-media">
                    <h4>Follow Us</h4>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
