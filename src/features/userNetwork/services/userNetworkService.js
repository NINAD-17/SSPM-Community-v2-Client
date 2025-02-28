import apiClient from "../../../api/apiClient";

export const fetchFollowers = async (userId) => {
    const response = await apiClient.get(`/v2/followers/${userId}`);
    console.log("fetched followers: ", response.data)
    return response.data;
};

export const fetchFollowings = async (userId) => {
    const response = await apiClient.get(`/v2/followers/followings/${userId}`);
    console.log("fetched followings: ", response.data);
    return response.data;
};

export const toggleFollow = async(userId) => {
    const response = await apiClient.post(`/v2/followers/follow/${userId}`);
    return response.data;
}

export const removeFollower = async(userId) => {
    const response = await apiClient.delete(`/v2/followers/follower/${userId}/remove`);
    return response.data;
}

export const fetchConnections = async () => {
    const response = await apiClient.get(`/v2/connections/all`);
    console.log("fetched connections: ", response.data.data);
    return response.data;
};

export const fetchInvitations = async () => {
    const response = await apiClient.get(`/v2/connections/invitations`);
    console.log("fetched Invitations: ", response.data);
    return response.data;
}

export const fetchPendingConnections = async () => {
    const response = await apiClient.get(`/v2/connections/pending-requests`);
    console.log("fetched pending requests: ", response.data);
    return response.data;
}

export const removeConnection = async(connectionId) => {
    const response = await apiClient.delete(`/v2/connections/${connectionId}/remove`);
    return response.data;
}

export const sendConnectionRequest = async (userId) => {
    const response = await apiClient.post(`/v2/connections/request/${userId}/send`);
    return response.data;
};

export const acceptConnectionRequest = async (connectionId) => {
    const response = await apiClient.post(`/v2/connections/${connectionId}/accept`);
    const connectedUser = await apiClient.get(`/v2/users/${response?.data?.connection?.requester}/profile`)
    return {profile: connectedUser.data.profile, connectionId};
};

export const declineConnectionRequest = async (connectionId) => {
    const response = await apiClient.post(
        `/v2/connections/${connectionId}/decline`
    );
    return response.data;
};

const userNetworkService = {
    fetchFollowers,
    fetchFollowings,
    fetchConnections,
    toggleFollow,
    removeConnection,
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
};

export default userNetworkService;
