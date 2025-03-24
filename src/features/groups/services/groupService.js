import apiClient from "../../../api/apiClient";

const API_URL_GROUPS = "/v2/groups";
const API_URL_GROUP_POSTS = "/v2/group-posts";

export const createGroup = async (groupData) => {
    try {
        const response = await apiClient.post(
            `${API_URL_GROUPS}/create`,
            groupData
        );
        return response.data;
    } catch (error) {
        console.error("Error creating group:", error);
        throw error;
    }
};

export const updateGroupAvatar = async (groupId, avatarData) => {
    try {
        const response = await apiClient.patch(
            `${API_URL_GROUPS}/${groupId}/avatar`,
            avatarData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating group avatar:", error);
        throw error;
    }
};

export const updateGroupCover = async (groupId, coverData) => {
    try {
        const response = await apiClient.patch(
            `${API_URL_GROUPS}/${groupId}/cover`,
            coverData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating group cover:", error);
        throw error;
    }
};

export const updateGroupDetails = async (groupId, updates) => {
    try {
        const response = await apiClient.patch(
            `${API_URL_GROUPS}/${groupId}/update`,
            updates
        );
        return response.data;
    } catch (error) {
        console.error("Error updating group details:", error);
        throw error;
    }
};

export const joinGroup = async (groupId) => {
    try {
        const response = await apiClient.post(
            `${API_URL_GROUPS}/${groupId}/join`
        );
        return response.data;
    } catch (error) {
        console.error("Error joining group:", error);
        throw error;
    }
};

export const leaveGroup = async (groupId) => {
    try {
        const response = await apiClient.delete(
            `${API_URL_GROUPS}/${groupId}/leave`
        );
        return response.data;
    } catch (error) {
        console.error("Error leaving group:", error);
        throw error;
    }
};

export const fetchGroupDetails = async (groupId) => {
    try {
        const response = await apiClient.get(`${API_URL_GROUPS}/${groupId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching group details:", error);
        throw error;
    }
};

export const fetchGroupMembers = async (groupId, lastMemberId = null, limit = 10, fetchCount = 0, sortBy = 'createdAt', sortType = 'desc') => {
    try {
        const params = new URLSearchParams();
        if (lastMemberId) params.append("lastMemberId", lastMemberId);
        if (limit) params.append("limit", limit);
        if (fetchCount) params.append("fetchCount", fetchCount);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortType) params.append("sortType", sortType);

        const response = await apiClient.get(
            `${API_URL_GROUPS}/${groupId}/members${params.toString() ? `?${params.toString()}` : ""}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching group members:", error);
        throw error;
    }
};

export const fetchGroupAdmins = async (groupId, lastAdminId = null, limit = 10, fetchCount = 0, sortBy = 'createdAt', sortType = 'desc') => {
    try {
        const params = new URLSearchParams();
        if (lastAdminId) params.append("lastAdminId", lastAdminId);
        if (limit) params.append("limit", limit);
        if (fetchCount) params.append("fetchCount", fetchCount);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortType) params.append("sortType", sortType);

        const response = await apiClient.get(
            `${API_URL_GROUPS}/${groupId}/admins${params.toString() ? `?${params.toString()}` : ""}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching group admins:", error);
        throw error;
    }
};

export const fetchAllGroups = async () => {
    try {
        const response = await apiClient.get(API_URL_GROUPS);
        return response.data;
    } catch (error) {
        console.error("Error fetching all groups:", error);
        throw error;
    }
};

export const fetchAllUserJoinedGroups = async (userId) => {
    try {
        const response = await apiClient.get(
            `${API_URL_GROUPS}/user/${userId}/joined`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching all user joined groups:", error);
        throw error;
    }
};

// Group Posts
export const fetchGroupPosts = async (groupId, lastPostId = null, limit, fetchCount, sortBy, sortType) => {
    try {
        const params = new URLSearchParams();
        if (lastPostId) params.append("lastPostId", lastPostId);

        const response = await apiClient.get(
            `${API_URL_GROUP_POSTS}/group/${groupId}/all${params.toString() ? `?${params.toString()}` : ""}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching group posts:", error);
        throw error;
    }
};

export const fetchGroupPostById = async (groupId, postId) => {
    try {
        const response = await apiClient.get(`${API_URL_GROUP_POSTS}/group/${groupId}/post/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching group post by id: ", error);
        throw error;
    }
};

export const createGroupPost = async (groupId, postData) => {
    try {
        const formData = new FormData();
        formData.append("content", postData.content);
        if (postData.media) {
            postData.media.forEach((file) => formData.append("media", file));
        }
        const response = await apiClient.post(
            `${API_URL_GROUP_POSTS}/group/${groupId}/create`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error creating group post: ", error);
        throw error;
    }
};

export const updateGroupPost = async (groupId, postId, postData) => {
        try {
                const formData = new FormData();
                formData.append("content", postData.content);
                if (postData.media) {
                    postData.media.forEach((file) => formData.append("media", file));
                }
                const response = await apiClient.patch(
                    `${API_URL_GROUP_POSTS}/group/${groupId}/post/${postId}/update`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                return response.data;
            } catch (error) {
                console.error("Error updating group post: ", error);
                throw error;
            }
}

export const deleteGroupPost = async (postId, groupId) => {
    try {
        const response = await apiClient.delete(`${API_URL_GROUP_POSTS}/group/${groupId}/post/${postId}/delete`);
        return response.data;
    } catch (error) {
        console.error("Error deleting post: ", error);
        throw error;
    }
};

export const fetchRecommendedGroups = async () => {
    try {
        const response = await apiClient.get(`${API_URL_GROUPS}/recommendations`);
        return response.data;
    } catch (error) {
        console.error("Error fetching recommended groups: ", error);
        throw error;
    }
};

const groupService = {
    createGroup,
    updateGroupAvatar,
    updateGroupCover,
    updateGroupDetails,
    joinGroup,
    leaveGroup,
    fetchGroupDetails,
    fetchGroupMembers,
    fetchGroupAdmins,
    fetchAllGroups,
    fetchAllUserJoinedGroups,
    fetchGroupPosts,
    fetchGroupPostById,
    createGroupPost,
    updateGroupPost,
    deleteGroupPost,
    fetchRecommendedGroups,
};

export default groupService;
