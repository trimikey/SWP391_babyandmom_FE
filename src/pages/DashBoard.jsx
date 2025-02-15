import React from "react";
import "../styles/DashBoard.css";

const DashBoard = () => {
    return (
        <div className="dashboard">
            <h1>📊 Dashboard Theo Dõi Thai Kỳ</h1>
            <div className="dashboard-container">
                <div className="info-box">
                    <i className="fas fa-baby"></i>
                    <h3>Tuần thai</h3>
                    <p>Tuần 20 - Tam cá nguyệt thứ 2</p>
                </div>

                <div className="info-box">
                    <i className="fas fa-weight"></i>
                    <h3>Cân nặng mẹ</h3>
                    <p>65 kg (+2kg từ lần trước)</p>
                </div>

                <div className="info-box">
                    <i className="fas fa-heartbeat"></i>
                    <h3>Nhịp tim thai</h3>
                    <p>145 bpm</p>
                </div>

                <div className="info-box">
                    <i className="fas fa-calendar-alt"></i>
                    <h3>Lịch khám tiếp theo</h3>
                    <p>Ngày 20/02/2025</p>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
