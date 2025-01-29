import apiClient from "../../../api/apiClient";

const API_URL = "/v2/users";

export const loginUser = async (credentials) => {
    console.log(
        `Requesting URL: ${apiClient.defaults.baseURL}${API_URL}/login`,
        credentials
    );
    const response = await apiClient.post(`${API_URL}/login`, credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    console.log(
        `Requesting URL: ${apiClient.defaults.baseURL}${API_URL}/register`,
        userData
    );
    const response = await apiClient.post(`${API_URL}/register`, userData);
    return response.data;
};

export const logoutUser = async () => {
    console.log(
        `Requesting URL: ${apiClient.defaults.baseURL}${API_URL}/logout`
    );
    await apiClient.post(`${API_URL}/logout`);
    return;
};

export const verifyAndFetchTokenUser = async () => {
    console.log(`Requesting URL: ${apiClient.defaults.baseURL}${API_URL}/user`);
    const response = await apiClient.get(`${API_URL}/user`);
    return response.data;
};

export const refreshAccessToken = async () => {
    console.log(
        `Requesting URL: ${apiClient.defaults.baseURL}${API_URL}/refresh-access-token`
    );
    const response = await apiClient.post(`${API_URL}/refresh-access-token`);
    return response.data;
};

const authService = {
    loginUser,
    registerUser,
    logoutUser,
    verifyAndFetchTokenUser,
    refreshAccessToken,
};

export default authService;
