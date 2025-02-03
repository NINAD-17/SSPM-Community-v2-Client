import apiClient from "../../../api/apiClient";

const API_URL = "/v2/posts";

export const createPost = async (postData) => {
    const response = await apiClient.post(`${API_URL}/create`, postData);
    return response;
};

export const uploadPostMedia = async (formData) => {
    const response = await apiClient.post(`${API_URL}/upload-media`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const fetchUserPosts = async (userId, { lastPostId, limit, sortBy = "createdAt", sortType = "desc" }) => {
    const params = new URLSearchParams({
        lastPostId: lastPostId || "",
        limit: limit.toString(),
        sortBy,
        sortType
    });
    
    const response = await apiClient.get(`${API_URL}/user/${userId}/all?${params}`);
    return response;
};

export const fetchFeedPosts = async ({ lastPostId, limit, sortBy = "createdAt", sortType = "desc" }) => {
    const params = new URLSearchParams({
        lastPostId: lastPostId || "",
        limit: limit.toString(),
        sortBy,
        sortType
    });
    
    const response = await apiClient.get(`${API_URL}/?${params}`);
    return response;
};

export const likePost = async (postId) => {
    const response = await apiClient.post(`/likes/toggle/p/${postId}`);
    return response;
};

export const addComment = async (postId, content) => {
    const response = await apiClient.post(`/comments/new`, {
        content,
    });
    return response;
};

export const deletePost = async (postId) => {
    const response = await apiClient.delete(`${API_URL}/${postId}`);
    return response;
};

const postsService = {
    createPost,
    uploadPostMedia,
    fetchUserPosts,
    fetchFeedPosts,
    likePost,
    addComment,
    deletePost,
};

export default postsService;
