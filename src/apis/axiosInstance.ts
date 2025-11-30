import axios from "axios";

// .env에 VITE_API_URL이 없으면 에러 발생
if (!import.meta.env.VITE_API_URL) {
  console.warn("⚠️ VITE_API_URL이 설정되지 않았습니다. .env 파일을 확인하세요.");
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
