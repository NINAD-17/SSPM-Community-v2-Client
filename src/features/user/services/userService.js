import apiClient from "../../../api/apiClient";

export const updateUserProfile = async (userData, userId) => {
    try {
        const response = await apiClient.patch(`/v2/users/${userId}/profile/update`, userData);
        if (!response.data?.data?.profile) {
            throw new Error('Invalid response format');
        }
        return response.data;
    } catch (error) {
        console.error("Update profile error:", error);
        throw error.response?.data || error;
    }
};

export const updateUserAvatar = async (formData, userId) => {
    try {
        const response = await apiClient.post(`/v2/users/${userId}/update-avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Update avatar error:", error);
        throw error.response?.data || error;
    }
};
