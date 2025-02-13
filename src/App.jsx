import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginRegister from "./Components/LoginRegister/LoginRegister";
import LandingPage from "./Components/LandingPage/LandingPage";
import Service  from "./Service/Service"; // Đảm bảo file trùng tên

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginRegister />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/services" element={<Service />} />


            </Routes>
        </Router>
    );
}

export default App;
