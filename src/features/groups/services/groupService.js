import apiClient from "../../../api/apiClient";

const API_URL_GROUPS = "/v2/groups";
const API_URL_GROUP_POSTS = "/v2/group-posts";

export const createGroup = async (groupData) => {
    try {
        const formData = new FormData();
        
        // Add text fields
        Object.keys(groupData).forEach(key => {
            if (key !== 'avatar' && key !== 'coverImage' && key !== 'skills') {
                formData.append(key, groupData[key]);
            }
        });
        
        // Add skills array as JSON string
        if (groupData.skills && groupData.skills.length > 0) {
            formData.append('skills', JSON.stringify(groupData.skills));
        }
        
        // Add files if they exist
        if (groupData.avatar) {
            formData.append('avatar', groupData.avatar);
        }
        
        if (groupData.coverImage) {
            formData.append('coverImage', groupData.coverImage);
        }
        
        const response = await apiClient.post('/groups', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
};

export const updateGroupAvatar = async (groupId, avatarData) => {
    try {
        const formData = new FormData();
        formData.append('avatar', avatarData);
        
        const response = await apiClient.patch(
            `${API_URL_GROUPS}/${groupId}/avatar`,
            formData,
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
        const formData = new FormData();
        formData.append('cover', coverData);
        
        const response = await apiClient.patch(
            `${API_URL_GROUPS}/${groupId}/cover`,
            formData,
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
        if (limit) params.append("limit", limit.toString());
        if (fetchCount) params.append("fetchCount", fetchCount.toString());
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
        if (limit) params.append("limit", limit.toString());
        if (fetchCount) params.append("fetchCount", fetchCount.toString());
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

export const fetchAllGroups = async (lastId = null, limit = 10, search = '') => {
    try {
        const params = new URLSearchParams();
        if (lastId) params.append("lastId", lastId);
        if (limit) params.append("limit", limit);
        if (search) params.append("search", search);

        const response = await apiClient.get(`${API_URL_GROUPS}${params.toString() ? `?${params.toString()}` : ""}`);
        // Return the data in the format expected by the thunk
        return {
            data: response.data.data
        };
    } catch (error) {
        console.error("Error fetching all groups:", error);
        throw error;
    }
};

export const fetchAllUserJoinedGroups = async (userId, lastId = null, limit = 10) => {
    try {
        const params = new URLSearchParams();
        if (lastId) params.append("lastId", lastId);
        if (limit) params.append("limit", limit.toString());

        const response = await apiClient.get(
            `${API_URL_GROUPS}/user/${userId || 'me'}/joined${params.toString() ? `?${params.toString()}` : ""}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching all user joined groups:", error);
        throw error;
    }
};

// Group Posts
export const fetchGroupPosts = async (groupId, lastPostId = null, limit = 10, fetchCount = 0, sortBy = 'createdAt', sortType = 'desc') => {
    try {
        const params = new URLSearchParams();
        if (lastPostId) params.append("lastPostId", lastPostId);
        if (limit) params.append("limit", limit.toString());
        if (fetchCount) params.append("fetchCount", fetchCount.toString());
        if (sortBy) params.append("sortBy", sortBy);
        if (sortType) params.append("sortType", sortType);

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
        
        if (postData.media && postData.media.length > 0) {
            postData.media.forEach((file) => {
                formData.append("media", file);
            });
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
        
        if (postData.media && postData.media.length > 0) {
            postData.media.forEach((file) => {
                formData.append("media", file);
            });
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
};

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
        console.log('Fetching recommendations from:', `/v2/recommendations/groups`);
        const response = await apiClient.get(`/v2/recommendations/groups`);
        console.log('Recommendations response:', response);
        return {
            data: response.data.data
        };
    } catch (error) {
        console.error("Error fetching recommended groups: ", error);
        // Better error details for debugging
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Error setting up request:", error.message);
        }
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
