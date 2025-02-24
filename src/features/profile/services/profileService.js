import apiClient from "../../../api/apiClient";

const API_URL = "/v2/users";

export const fetchProfile = async (userId) => {
    try {
        const response = await apiClient.get(`${API_URL}/${userId}/profile`);
        return response.data;
    } catch (error) {
        console.error("Fetch profile error:", error);
        throw error;
    }
};

export const updateProfile = async (userId, profileData) => {
    try {
        const response = await apiClient.patch(`${API_URL}/${userId}/profile/update`, profileData);
        return response.data;
    } catch (error) {
        console.error("Update profile error:", error);
        throw error;
    }
};

const profileService = {
    fetchProfile,
    updateProfile,
};

export default profileService;
