import { createSlice } from '@reduxjs/toolkit';
import authApi from '../../config/axios';

const initialState = {
    user: null,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
        },
        loginFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        logoutSuccess: (state) => {
            state.user = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        
    },
});

export const { loginStart, loginSuccess, loginFailure, logoutSuccess, setUser } = authSlice.actions;

export const login = async (dispatch, credentials) => {
    dispatch(loginStart());
    try {
        const response = await authApi.login(credentials);
        const user = response.data;
        
        // Lưu user vào localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
        // Dispatch action để cập nhật Redux store
        dispatch(loginSuccess(user));
    } catch (error) {
        dispatch(loginFailure(error.message));
    }
};

export const logout = (dispatch) => {
    // Xóa user khỏi localStorage
    localStorage.removeItem('user');
    
    // Dispatch action để clear Redux store
    dispatch(logoutSuccess());
};

export default authSlice.reducer;
