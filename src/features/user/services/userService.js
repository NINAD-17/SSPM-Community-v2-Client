import apiClient from "../../../api/apiClient";

export const updateUserProfile = async (userData) => {
    try {
        const response = await apiClient.patch(`/v2/users/user/user-profile`, userData);
        return response;
    } catch (error) {
        console.error("Update profile error:", error);
        throw error.response?.data || error;
    }
};

export const updateUserAvatar = async (formData) => {
    try {
        const response = await apiClient.post('/v2/users/user/update-avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error("Update avatar error:", error);
        throw error.response?.data || error;
    }
};
