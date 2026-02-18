import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5001",
});

api.interceptors.request.use(
    (config) => {
        // Try to get token from 'token' key first (current implementation)
        // Then try 'userInfo' (requested implementation) to be safe
        const token = localStorage.getItem("token");
        const userInfo = localStorage.getItem("userInfo")
            ? JSON.parse(localStorage.getItem("userInfo"))
            : null;

        const activeToken = token || userInfo?.token;

        if (activeToken) {
            config.headers.Authorization = `Bearer ${activeToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
