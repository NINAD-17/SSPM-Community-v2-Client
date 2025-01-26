import axios from "axios";

const API_URL = "/api/v2/users";

export const loginUser = async (credentials) => {
    console.log("Requesting URL:", `${API_URL}/login`, credentials);
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    console.log("Requesting URL:", `${API_URL}/register`, userData);
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

export const logoutUser = async () => {
    console.log("Requesting URL:", `${API_URL}/logout`);
    await axios.post(`${API_URL}/logout`);
    return;
}

const authService = {
    loginUser,
    registerUser,
};

export default authService;
