import apiClient from "../../../api/apiClient";

const API_URL = "/v2/auth";

export const initiateRegistration = async (email) => {
    console.log(
        `Requesting URL: ${apiClient.defaults.baseURL}${API_URL}/registration-initiator`,
        email
    );

    const response = await apiClient.post(`${API_URL}/register/initiate`, { email });
    return response.data;
};

export const verifyRegistrationOTP = async (otpData) => {
    const response = await apiClient.post(
        `${API_URL}/register/verify-otp`,
        otpData
    );
    console.log("data resp = ", response.data);
    return response.data;
};

export const completeRegistration = async (userData) => {
    const response = await apiClient.post(
        `${API_URL}/register/complete`,
        userData
    );
    return response.data;
};

export const initiateLogin = async (credentials) => {
    const response = await apiClient.post(`${API_URL}/login/initiate`, credentials);
    return response.data;
};

export const verifyLoginOTP = async (otpData) => {
    const response = await apiClient.post(`${API_URL}/login/verify-otp`, otpData);
    return response.data;
};

export const logoutUser = async () => {
    await apiClient.post(`${API_URL}/logout`);
    return;
};

export const verifyAndFetchTokenUser = async () => {
    try {
        const response = await apiClient.get(`${API_URL}/user`);
        return response.data;
    } catch (error) {
        console.log({error});
        throw error;
    }
};

export const refreshAccessToken = async () => {
    const response = await apiClient.post(`${API_URL}/refresh-access-token`);
    return response.data;
};

const authService = {
    initiateRegistration,
    verifyRegistrationOTP,
    completeRegistration,
    initiateLogin,
    verifyLoginOTP,
    logoutUser,
    verifyAndFetchTokenUser,
    refreshAccessToken,
};

export default authService;