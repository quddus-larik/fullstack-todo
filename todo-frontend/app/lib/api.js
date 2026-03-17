import axios from "axios";

const api=axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ,
    headers: {
        'Content-Type': 'application/json',
    }
})

export const fetcher = (url) => api.get(url).then((res) => res.data);

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('access')
if (token) {
        console.log("Interceptor: Token Found and Attached"); // DEBUG LINE
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn("Interceptor: No Token found in LocalStorage");
        console.log(process.env.NEXT_PUBLIC_API_URL) // DEBUG LINE
    }
    return config;
},(error)=>{return Promise.reject(error)}
)
// The "Global Error Handler" - Kicks user to login if token expires
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('access');
            if(window.location.pathname !=='login'){
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;