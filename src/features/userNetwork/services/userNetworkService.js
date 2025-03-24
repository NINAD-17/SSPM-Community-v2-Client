import apiClient from "../../../api/apiClient";

export const fetchFollowers = async (userId) => {
    try {
        const response = await apiClient.get(`/v2/followers/${userId}`);
        // console.log("Fetched followers: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching followers:", error.response?.data || error);
        throw error;
    }
};

export const fetchFollowings = async (userId) => {
    try {
        const response = await apiClient.get(`/v2/followers/followings/${userId}`);
        // console.log("Fetched followings: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching followings:", error.response?.data || error);
        throw error;
    }
};

export const fetchConnections = async () => {
    try {
        const response = await apiClient.get("/v2/connections/all");
        // console.log("Fetched connections: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching connections:", error.response?.data || error);
        throw error;
    }
};

export const fetchPendingRequests = async () => {
    try {
        const response = await apiClient.get("/v2/connections/pending-requests");
        // console.log("Fetched pending requests: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching pending requests:", error.response?.data || error);
        throw error;
    }
};

export const acceptRequest = async (connectionId) => {
    try {
        const response = await apiClient.patch(`/v2/connections/${connectionId}/accept`);
        // console.log("Accept request response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error accepting connection request:", error.response?.data || error);
        throw error;
    }
};

export const rejectRequest = async (connectionId) => {
    try {
        const response = await apiClient.delete(`/v2/connections/${connectionId}/decline`);
        // console.log("Reject request response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error rejecting connection request:", error.response?.data || error);
        throw error;
    }
};

export const removeConnection = async (connectionId) => {
    try {
        const response = await apiClient.delete(`/v2/connections/${connectionId}/remove`);
        // console.log("Remove connection response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error removing connection:", error.response?.data || error);
        throw error;
    }
};

export const toggleFollow = async (userId) => {
    try {
        const response = await apiClient.post(`/v2/followers/follow/${userId}`);
        console.log("Toggle follow response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error toggling follow:", error.response?.data || error);
        throw error;
    }
};

export const removeFollower = async (userId) => {
    try {
        const response = await apiClient.delete(`/v2/followers/follower/${userId}/remove`);
        console.log("Remove follower response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error removing follower:", error.response?.data || error);
        throw error;
    }
};

export const fetchInvitations = async () => {
    const response = await apiClient.get(`/v2/connections/invitations`);
    // console.log("fetched Invitations: ", response.data);
    return response.data;
}

export const fetchInvitationsSent = async () => {
    try {
        const response = await apiClient.get("/v2/connections/invitations");
        // console.log("Fetched invitations sent: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching invitations sent:", error.response?.data || error);
        throw error;
    }
};

export const sendConnectionRequest = async (userId) => {
    try {
        const response = await apiClient.post(`/v2/connections/request/${userId}/send`);
        console.log("Send connection request response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending connection request:", error.response?.data || error);
        throw error;
    }
};

const userNetworkService = {
    fetchFollowers,
    fetchFollowings,
    fetchConnections,
    fetchPendingRequests,
    fetchInvitationsSent,
    toggleFollow,
    removeFollower,
    removeConnection,
    sendConnectionRequest,
    acceptRequest,
    rejectRequest,
};

export default userNetworkService;
