
import axios from "axios"
const api = axios.create({
    // baseURL: "http://localhost:4000",
    // baseURL: "https://distinguished-laughter-production.up.railway.app/api",
    baseURL: "https://grpssf3g-8000.inc1.devtunnels.ms",
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : null;
    // console.log(token)
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export default api