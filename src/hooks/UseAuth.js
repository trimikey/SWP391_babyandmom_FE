import { useState } from "react";

const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Hàm xử lý đăng nhập
    const login = async (credentials) => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Đăng nhập thất bại!");

            localStorage.setItem("token", data.token);
            return { success: true, message: "Đăng nhập thành công!" };
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý đăng ký
    const register = async (userData) => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Đăng ký thất bại!");

            return { success: true, message: "Đăng ký thành công!" };
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    return { login, register, loading, error };
};

export default useAuth;
