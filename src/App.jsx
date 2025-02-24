import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import Profile from './pages/profiles/profile';
import 'react-toastify/dist/ReactToastify.css';

function App() {
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
