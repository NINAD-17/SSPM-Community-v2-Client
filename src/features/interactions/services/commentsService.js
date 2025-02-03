import apiClient from "../../../api/apiClient";

export const fetchComments = async (postId, postType = "UserPost") => {
    const response = await apiClient.get(`/comments/${postId}`, { params: { postType } });
    return response;
};

export const addComment = async (postId, content, postType = "UserPost") => {
    const response = await apiClient.post(`/comments/new`, { 
        postId, 
        content,
        postType 
    });
    return response;
}; 