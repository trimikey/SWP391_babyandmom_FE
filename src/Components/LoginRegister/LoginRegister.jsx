import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEyeSlash, FaEye, FaEnvelope } from "react-icons/fa";
import './LoginRegister.css';

const LoginRegister = () => {
    const [action, setAction] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    const registerLink = () => setAction('active');
    const loginLink = () => setAction('');
    const togglePassword = () => setShowPassword(!showPassword);

    const handleLogin = (e) => {
        e.preventDefault();
        if (username && password) {
            localStorage.setItem("isLoggedIn", "true");
            navigate("/landing");
        } else {
            alert("Vui lòng nhập đầy đủ thông tin!");
        }
    };

    return (
        <div className={`wrapper ${action}`}>
            {/* Login Form */}
            <div className="form-box login">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input 
                            type="text" 
                            placeholder="Username" 
                            required 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {showPassword ? 
                            <FaEye className="icon" onClick={togglePassword} /> 
                            : <FaEyeSlash className="icon" onClick={togglePassword} />
                        }
                    </div>

                    <div className="remember-forgot">
                        <a href="#">Forgot password?</a>
                    </div>

                    <button type="submit">Login</button>
                    
                    <button type="button" onClick={registerLink} className="switch-btn">Register</button>
                </form>
            </div>

            {/* Register Form */}
            <div className="form-box register">
                <form>
                    <h1>Register</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Username" required />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input type="email" placeholder="Email" required />
                        <FaEnvelope className="icon" />
                    </div>
                    <div className="input-box">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            required 
                        />
                        {showPassword ? 
                            <FaEye className="icon" onClick={togglePassword} /> 
                            : <FaEyeSlash className="icon" onClick={togglePassword} />
                        }
                    </div>

                    <div className="remember-forgot">
                        <label><input type="checkbox" />I agree to the terms & conditions</label>
                    </div>

                    <button type="submit">Register</button>

                    <div className="register-link">
                        <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginRegister;
