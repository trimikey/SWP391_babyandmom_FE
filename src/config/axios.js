import axios from "axios";
const api = axios.create({
    baseURL: 'http://14.225.210.81:8080/api'
    // baseURL: 'http://localhost:8080/api'
});

api.interceptors.request.use(
    config => {
      const token = localStorage.getItem("token");
      if (token) {
        // Bearer Token là một phương thức xác thực thông qua JSON Web
        //  Token (JWT) hoặc một token khác mà server tạo ra khi đăng nhập.
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      // console.log('Current token:', localStorage.getItem('token'));
      return config;
    },  
    error => {
      console.log(error);
      console.log('token', token)      
      return Promise.reject(error);
    }
  );

// api.interceptors.response.use(
//   response => {
//     return response;
//   },
//   error => {
//     if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//       // Token hết hạn hoặc không hợp lệ
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

export default api;