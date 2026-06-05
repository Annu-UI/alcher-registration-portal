import axios from 'axios';

const baseURL = process.env.REACT_APP_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL,
});

// Interceptor to add the access token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor to handle token refresh on 401 responses
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is 401 and it's not a retry request
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark it as a retry

            const refreshToken = localStorage.getItem('refresh');
            if (!refreshToken) {
                // If no refresh token, redirect to login
                window.location.href = '/login/';
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${baseURL}/api/token/refresh/`, {
                    refresh: refreshToken,
                });

                // If token refresh is successful, save the new access token
                localStorage.setItem('access', response.data.access);

                // Update the Authorization header for the original request and retry
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                // If refresh token is also invalid, clear storage and redirect to login
                console.error("Token refresh failed!", refreshError);
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                window.location.href = '/login/';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;