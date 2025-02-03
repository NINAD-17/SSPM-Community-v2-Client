import apiClient from '../../../api/apiClient';

const API_URL_GROUPS = '/v2/groups';
const API_URL_GROUP_POSTS = '/v2/group-posts';

export const fetchGroups = async () => {
        const response = await apiClient.get(API_URL_GROUPS);
        return response;
};

export const createGroup = async (groupData) => {
        const response = await apiClient.post(`${API_URL_GROUPS}/create`, groupData);
        return response;
};

export const joinGroup = async (groupId) => {
        const response = await apiClient.post(
            `${API_URL_GROUPS}/${groupId}/join`
        );
        return response;
};

export const leaveGroup = async (groupId) => {
        const response = await apiClient.post(
            `${API_URL_GROUPS}/${groupId}/leave`
        );
        return response;
};

export const fetchGroupDetails = async (groupId) => {
        const response = await apiClient.get(`${API_URL_GROUPS}/${groupId}`);
        console.log("group details resp: ", response);
        return response;
};

export const fetchGroupPosts = async (groupId, lastPostId = null) => {
        const params = new URLSearchParams();
        if (lastPostId) params.append('lastPostId', lastPostId);
        
        const response = await apiClient.get(
            `${API_URL_GROUP_POSTS}/group/${groupId}${params ? `?${params}` : ''}`
        );
        return response;
};

export const createGroupPost = async (groupId, postData) => {
        const response = await apiClient.post(
            `${API_URL_GROUP_POSTS}/group/${groupId}`,
            postData
        );
        return response;
};

export const deletePost = async (postId) => {
        const response = await apiClient.delete(
            `${API_URL_GROUP_POSTS}/${postId}`
        );
        return response;
};

export const fetchRecommendedGroups = async () => {
    const response = await apiClient.get(`${API_URL_GROUPS}/recommendations`);
    return response;
};

const groupService = {
    fetchGroups,
    createGroup,
    joinGroup,
    leaveGroup,
    fetchGroupDetails,
    fetchGroupPosts,
    createGroupPost,
    deletePost,
    fetchRecommendedGroups
};

export default groupService;
