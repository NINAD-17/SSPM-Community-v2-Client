import apiClient from "../../../api/apiClient";

export const fetchComments = async (postId, postType = "UserPost", lastCommentId) => {
    const response = await apiClient.get(`/v2/comments/${postId}/all`, { params: { postType } });
    return response.data;
};

export const addComment = async (postId, content, postType = "UserPost") => {
    const response = await apiClient.post(`/v2/comments/new`, { 
        postId, 
        content,
        postType 
    });
    return response.data;
}; 

export const updateComment = async (commentId, content) => {
    console.log(commentId, content);
    const response = await apiClient.patch(`/v2/comments/${commentId}/edit`, { content });
    console.log(response.data);
    return response.data;
}

export const deleteComment = async (commentId) => {
    const response = await apiClient.delete(`/v2/comments/${commentId}/delete`);
    return response.data;
}