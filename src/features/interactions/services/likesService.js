import apiClient from "../../../api/apiClient";

export const toggleLike = async (postId, postType = "UserPost") => {
    try {
        const response = await apiClient.post(`/v2/likes/toggle/p/${postId}`, { postType });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log({error});
        throw error.response?.data || error;
    }
};

export const fetchPostLikes = async (postId, postType = "UserPost") => {
    const response = await apiClient.get(`/likes/${postId}`, { params: { postType } });
    return response;
}; 