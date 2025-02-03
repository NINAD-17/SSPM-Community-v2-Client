import apiClient from "../../../api/apiClient";

export const toggleLike = async (postId, postType = "UserPost") => {
    const response = await apiClient.post(`/likes/toggle/p/${postId}`, { postType });
    return response;
};

export const fetchPostLikes = async (postId, postType = "UserPost") => {
    const response = await apiClient.get(`/likes/${postId}`, { params: { postType } });
    return response;
}; 