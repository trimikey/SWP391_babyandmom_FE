import React, { createContext, useContext, useState } from 'react';

// Tạo context với giá trị mặc định
const AuthContext = createContext({
  user: null,
  setUser: () => {},
  updateUserProfile: () => Promise.resolve(),
});

// Custom hook để sử dụng auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Người dùng',
    email: 'example@email.com',
    phone: '0123456789',
  });

  const updateUserProfile = async (userData) => {
    try {
      // Tạm thời để test UI, sau này sẽ kết nối API
      setUser(prevUser => ({
        ...prevUser,
        ...userData
      }));
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const value = {
    user,
    setUser,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};