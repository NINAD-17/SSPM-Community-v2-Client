import apiClient from "../../../api/apiClient";

export const fetchConversationsList = async () => {
    try {
        const response = await apiClient.get("/v2/conversations");
        return response.data.data.conversations;
    } catch (error) {
        console.error("Error fetching conversations:", error);
        throw error.response?.data || error;
    }
};

export const fetchConversationById = async (conversationId) => {
    try {
        const response = await apiClient.get(`/v2/conversations/${conversationId}`);
        return response.data.data.conversation;
    } catch (error) {
        console.error("Error fetching conversation details:", error);
        throw error.response?.data || error;
    }
};

export const createNewConversation = async (data) => {
    try {
        const response = await apiClient.post("/v2/conversations/new", data);
        return response.data.data;
    } catch (error) {
        console.error("Error creating conversation:", error);
        throw error.response?.data || error;
    }
};

export const fetchMessagesByConversationId = async (conversationId, cursor = null) => {
    try {
        console.log("Fetching messages for conversation:", cursor);
        
        // Convert timestamp to ISO string if cursor exists
        const cursorParam = cursor ? new Date(parseInt(cursor)).toISOString() : null;
        const url = `/v2/messages/conversation/${conversationId}${cursorParam ? `?cursor=${cursorParam}` : ''}`;
        
        const response = await apiClient.get(url);
        console.log("Response:", response.data.data);
        
        const { messages, cursor: nextCursor, pagination } = response.data.data;
        
        return {
            messages: messages || [],
            cursor: nextCursor,
            pagination: {
                totalCount: pagination.totalCount,
                fetchedCount: pagination.fetchedCount,
                remainingCount: pagination.remainingCount,
                hasMore: pagination.hasMore
            }
        };
    } catch (error) {
        console.error("Error fetching messages:", error);
        throw error.response?.data || error;
    }
};

export const sendNewMessage = async (conversationId, content) => {
    try {
        const response = await apiClient.post(`/v2/messages/conversation/${conversationId}`, { content });
        return response.data.data.message;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error.response?.data || error;
    }
};

export const markMessagesAsViewed = async (conversationId, messageIds) => {
    try {
        const response = await apiClient.post(`/v2/messages/conversation/${conversationId}/read`, { messageIds });
        return response.data.data.modifiedCount;
    } catch (error) {
        console.error("Error marking messages as read:", error);
        throw error.response?.data || error;
    }
};

export const deleteMessageById = async (messageId) => {
    try {
        const response = await apiClient.delete(`/v2/messages/${messageId}`);
        return response.data.data;
    } catch (error) {
        console.error("Error deleting message:", error);
        throw error.response?.data || error;
    }
};

export const updateMessageById = async (messageId, content) => {
    try {
        const response = await apiClient.patch(`/v2/messages/${messageId}`, { content });
        return response.data.data.updatedMessage;
    } catch (error) {
        console.error("Error updating message:", error);
        throw error.response?.data || error;
    }
};

