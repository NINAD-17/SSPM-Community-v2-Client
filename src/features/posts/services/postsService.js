import apiClient from "../../../api/apiClient";

const API_URL = "/v2/posts";

export const createPost = async (postData) => {
    try {
        const response = await apiClient.post(`${API_URL}/create`, postData);
        return response.data;
    } catch (error) {
        console.error('Post creation error:', error);
        throw error;
    }
};

export const uploadPostMedia = async (formData) => {
    try {
        const response = await apiClient.post(`${API_URL}/upload-media`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error('Media upload error:', error);
        throw error;
    }
};

export const updatePost = async(postId, updates) => {
    try {
        const response = await apiClient.patch(`${API_URL}/${postId}`, updates);
        return response.data;
    } catch (error) {
        console.error('Post update error:', error);
        throw error;
    }
}

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

export const fetchFeedPosts = async ({ lastPostId, limit, sortBy = "createdAt", sortType = "desc", fetchCount = 0 }) => {
    try {
        const params = new URLSearchParams({
            lastPostId: lastPostId || "",
            limit: limit.toString(),
            sortBy,
            sortType,
            fetchCount
        });
        
        const response = await apiClient.get(`${API_URL}/?${params}`);
        
        if (!response?.data?.data) {
            throw new Error('Invalid response format');
        }
        
        return response;
    } catch (error) {
        console.error('Feed posts fetch error:', error);
        throw error;
    }
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

export const fetchSinglePost = async (postId) => {
    try {
        const response = await apiClient.get(`${API_URL}/${postId}`);
        return response.data;
    } catch (error) {
        console.error('Single post fetch error:', error);
        throw error;
    }
};

const postsService = {
    createPost,
    uploadPostMedia,
    fetchUserPosts,
    fetchFeedPosts,
    likePost,
    addComment,
    updatePost,
    deletePost,
    fetchSinglePost,
};

export default postsService;
