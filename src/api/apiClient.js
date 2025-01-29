import axios from "axios";

// Set default base URL
const apiClient = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    // Adding credentials requirement
    credentials: 'include'
});

// Add request interceptor to handle errors
apiClient.interceptors.request.use(
    (config) => {
        // You can modify the request config if needed
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Response Error:', error);
        // Extract the error message
        const message = 
            error.response?.data?.message || 
            error.message || 
            'Something went wrong';
        return Promise.reject({ message });
    }
);

export default apiClient;
