import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true, // 로그인 기능을 위해 유지
});

  // 요청 인터셉터
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 응답 인터셉터
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("🚨 API ERROR:", error);
      return Promise.reject(error);
    }
  );

  export default axiosInstance;
