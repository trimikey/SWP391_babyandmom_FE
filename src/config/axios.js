import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/api'});

api.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      console.log(error);
      console.log('token', token)      
    }
  );

export default api;