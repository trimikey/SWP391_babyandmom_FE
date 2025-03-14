import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import Profile from './pages/profiles/profile';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/slices/authSlice';
import api from './config/axios';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Lấy thông tin user từ token
      const fetchUser = async () => {
        try {
          const response = await api.get('user/profile');
          dispatch(setUser(response.data));
        } catch (error) {
          localStorage.removeItem('token');
        }
      };
      fetchUser();
    }
  }, [dispatch]);

  return (
    <Router>
      <AuthProvider>
        <div className="App">
          {/* Các routes khác của bạn */}
          <Profile />
        </div>
        <ToastContainer />
      </AuthProvider>
    </Router>
  );
}

export default App;

// Xử lý API
