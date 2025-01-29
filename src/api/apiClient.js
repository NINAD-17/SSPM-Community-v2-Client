import axios from "axios";

// Set default base URL
const apiClient = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true, // for including cookies by default
});

// Add a request interceptor
// apiClient.interceptors.request.use(
//     (config) => {
//         // You can modify the request config if needed
//         return config;
//     },
//     (error) => {
//         // Handle request error
//         return Promise.reject(error);
//     }
// );

// // Add a response interceptor
// apiClient.interceptors.response.use(
//     (response) => {
//         // Any status code that lie within the range of 2xx cause this function to trigger
//         return response;
//     },
//     (error) => {
//         // Any status codes that falls outside the range of 2xx cause this function to trigger
//         return Promise.reject(error);
//     }
// );

export default apiClient;
