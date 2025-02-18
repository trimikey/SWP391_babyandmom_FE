import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import { FaUserCircle, FaTimes, FaCrown, FaUserEdit, FaBaby, FaPlus, FaKey, FaClipboardList, FaPhone, FaComment, FaStar, FaSignOutAlt, FaHeartbeat, FaBookOpen } from "react-icons/fa";
import bannerImage from "../Components/Assets/banner2.jpg";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";


const HomePage = () => {
    const navigate = useNavigate();

    const [userName, setUserName] = useState("Khách hàng");
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem("user")) || {}; // Lấy thông tin từ localStorage
    const handleLogout = () => {
        
        localStorage.removeItem("user"); // Xóa thông tin người dùng
        navigate("/login"); // Điều hướng về trang đăng nhập
    };
    
    // Toggle mở/đóng Profile Modal
    const toggleProfileModal = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    return (
        <div className="home-page">
            {/* Navigation Menu */}
            <nav className="navbar">
                <div className="logo">
                    <Link to="/">Baby & Mom</Link>
                </div>
                <ul className="nav-links">
                    <li><Link to="/">Trang chủ</Link></li>
                    <li><Link to="/blog">Blog</Link></li>
                    <li><Link to="/faq">FAQ</Link></li>
                    <li><Link to="/membership">Gói thành viên</Link></li>
                </ul>
                <div className="auth-links">
                    <Link to="/login" className="auth-link">Đăng nhập</Link>
                    <Link to="/register" className="auth-link">Đăng ký</Link>
                    <button className="profile-icon" onClick={toggleProfileModal}>
                        <FaUserCircle size={30} />
                        <span>{userName}</span>
                    </button>
                </div>
            </nav>
          
            {/* Hero Section */}
            <section className="hero-section">
                <h1>Chào mừng đến với Baby & Mom</h1>
                <p>Theo dõi thai kỳ dễ dàng và an toàn với ứng dụng của chúng tôi.</p>
                {/* <button className="cta-button">
                    Bắt đầu ngay
                </button> */}
            </section>

            <section className="banner-section">
    <img src={bannerImage} alt="Baby & Mom Banner" className="banner-image" />
</section>
            {/* Phần Giới Thiệu */}
            <section className="about-section">
                <h2>Về Baby & Mom</h2>
                <p>
                    Baby & Mom là ứng dụng hàng đầu giúp các mẹ bầu theo dõi sức khỏe thai kỳ,
                     cập nhật kiến thức chăm sóc mẹ và bé, đồng thời kết nối với cộng đồng các mẹ bầu khác. 
                </p>
                <p>
                    Chúng tôi cung cấp những thông tin hữu ích, khoa học 
                    và được kiểm chứng từ các chuyên gia để giúp hành trình mang
                     thai trở nên dễ dàng và an toàn hơn.
                </p>
            </section>

            {/* Phần Chăm Sóc Thai Kỳ */}
            <section className="pregnancy-care-section">
    <h2>Chăm Sóc Thai Kỳ</h2>
    <div className="care-features">
        <Link to="/health-tracking" className="care-card">
            <FaHeartbeat size={40} className="care-icon" />
            <h3>Theo Dõi Sức Khỏe</h3>
            <p>Kiểm tra cân nặng, huyết áp, và sự phát triển của thai nhi theo từng tuần.</p>
        </Link>
        <Link to="/pregnancy-knowledge" className="care-card">
            <FaBookOpen size={40} className="care-icon" />
            <h3>Kiến Thức Mẹ Bầu</h3>
            <p>Cập nhật những thông tin hữu ích về dinh dưỡng, tập luyện, và chuẩn bị sinh con.</p>
        </Link>
        <Link to="/baby-preparation" className="care-card">
            <FaBaby size={40} className="care-icon" />
            <h3>Chuẩn Bị Cho Bé</h3>
            <p>Danh sách đồ sơ sinh, bí quyết chăm sóc bé sơ sinh và cách nuôi dạy con khoa học.</p>
        </Link>
    </div>
</section>


            {/* Profile Modal */}
            {isProfileOpen && (
    <div className="profile-modal-overlay" onClick={toggleProfileModal}>
        <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={toggleProfileModal}>
                <FaTimes />
            </button>
            <div className="profile-header">
                <p><strong>Xin chào,</strong></p>
                <p><strong>{user.userName || "Người dùng"}</strong> ({user.phoneNumber || "Chưa có số" })</p>
                <button className="vip-button">
                    <FaCrown className="vip-icon" /> Kích Hoạt VIP Mom
                </button>
            </div>
            <ul className="profile-menu">
                <li><Link to="/edit-profile"><FaUserEdit /> Sửa thông tin bạn</Link></li>
                <li><Link to="/edit-baby-info"><FaBaby /> Sửa thông tin con</Link></li>
                <li><Link to="/add-baby"><FaPlus /> Thêm con</Link></li>
                <li><Link to="/change-password"><FaKey /> Đổi mật khẩu</Link></li>
                <li><Link to="/orders"><FaClipboardList /> Đơn hàng của bạn</Link></li>
                <li><Link to="/support"><FaPhone /> Hỗ trợ - Liên hệ</Link></li>
                <li><Link to="/feedback"><FaComment /> Góp ý, đề xuất nội dung</Link></li>
                <li><Link to="/rate-app"><FaStar /> Đánh giá ứng dụng Mamibabi</Link></li>
                <li className="logout" onClick={handleLogout}>
                    <FaSignOutAlt /> Đăng xuất
                </li>
            </ul>
        </div>
    </div>
)}
            <Footer />
        </div>
    );
};

export default HomePage;
