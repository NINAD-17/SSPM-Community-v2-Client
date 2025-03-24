import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchConnections,
    fetchFollowers,
    fetchFollowings,
    fetchPendingRequests,
    fetchInvitationsSent,
    acceptRequest,
    rejectRequest,
    removeConnection,
    toggleFollow,
    removeFollower
} from "./services/userNetworkService";
// import { userNetworkService } from "./services/userNetworkService";

const initialState = {
    connections: {
        data: [],
        status: "idle",
        error: null,
    },
    followers: {
        data: [],
        status: "idle",
        error: null,
    },
    followings: {
        data: [],
        status: "idle",
        error: null,
    },
    pendingConnections: {
        data: [],
        status: "idle",
        error: null,
    },
    invitationsSent: {
        data: [],
        status: "idle",
        error: null,
    },
};

export const loadConnections = createAsyncThunk(
    "userNetwork/loadConnections",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchConnections();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const loadFollowers = createAsyncThunk(
    "userNetwork/loadFollowers",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await fetchFollowers(userId);
            return response.data?.followers || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const loadFollowings = createAsyncThunk(
    "userNetwork/loadFollowings",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await fetchFollowings(userId);
            return response.data?.followings || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const loadPendingConnections = createAsyncThunk(
    "userNetwork/loadPendingConnections",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchPendingRequests();
            return response.data?.pendingRequests || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const loadInvitationsSent = createAsyncThunk(
    "userNetwork/loadInvitationsSent",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchInvitationsSent();
            return response.data?.invitations || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const acceptConnectionRequest = createAsyncThunk(
    "userNetwork/acceptConnectionRequest",
    async (connectionId, { rejectWithValue }) => {
        try {
            const response = await acceptRequest(connectionId);
            return { connectionId, data: response.data || {} };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const rejectConnectionRequest = createAsyncThunk(
    "userNetwork/rejectConnectionRequest",
    async (connectionId, { rejectWithValue }) => {
        try {
            await rejectRequest(connectionId);
            return connectionId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const removeUserConnection = createAsyncThunk(
    "userNetwork/removeUserConnection",
    async (connectionId, { rejectWithValue }) => {
        try {
            await removeConnection(connectionId);
            return connectionId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const toggleFollowButton = createAsyncThunk(
    "userNetwork/toggleFollow",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await toggleFollow(userId);
            return { 
                userId, 
                isFollowing: response.data?.isFollowing, 
                user: response.data?.user 
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const removeUserFollower = createAsyncThunk(
    "userNetwork/removeFollower",
    async (userId, { rejectWithValue }) => {
        try {
            await removeFollower(userId);
            return { userId };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const userNetworkSlice = createSlice({
    name: "userNetwork",
    initialState,
    reducers: {
        clearNetworkData: () => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            // Connection reducers
            .addCase(loadConnections.pending, (state) => {
                state.connections.status = "loading";
            })
            .addCase(loadConnections.fulfilled, (state, action) => {
                state.connections.status = "succeeded";
                state.connections.data = action.payload.connections || [];
                state.connections.error = null;
            })
            .addCase(loadConnections.rejected, (state, action) => {
                state.connections.status = "failed";
                state.connections.error = action.payload;
            })

            // Followers reducers
            .addCase(loadFollowers.pending, (state) => {
                state.followers.status = "loading";
            })
            .addCase(loadFollowers.fulfilled, (state, action) => {
                state.followers.status = "succeeded";
                state.followers.data = action.payload || [];
                state.followers.error = null;
            })
            .addCase(loadFollowers.rejected, (state, action) => {
                state.followers.status = "failed";
                state.followers.error = action.payload;
            })

            // Followings reducers
            .addCase(loadFollowings.pending, (state) => {
                state.followings.status = "loading";
            })
            .addCase(loadFollowings.fulfilled, (state, action) => {
                state.followings.status = "succeeded";
                state.followings.data = action.payload || [];
                state.followings.error = null;
            })
            .addCase(loadFollowings.rejected, (state, action) => {
                state.followings.status = "failed";
                state.followings.error = action.payload;
            })

            // Pending connections reducers
            .addCase(loadPendingConnections.pending, (state) => {
                state.pendingConnections.status = "loading";
            })
            .addCase(loadPendingConnections.fulfilled, (state, action) => {
                state.pendingConnections.status = "succeeded";
                state.pendingConnections.data = action.payload || [];
                state.pendingConnections.error = null;
            })
            .addCase(loadPendingConnections.rejected, (state, action) => {
                state.pendingConnections.status = "failed";
                state.pendingConnections.error = action.payload;
            })

            // Invitations sent reducers
            .addCase(loadInvitationsSent.pending, (state) => {
                state.invitationsSent.status = "loading";
            })
            .addCase(loadInvitationsSent.fulfilled, (state, action) => {
                state.invitationsSent.status = "succeeded";
                state.invitationsSent.data = action.payload || [];
                state.invitationsSent.error = null;
            })
            .addCase(loadInvitationsSent.rejected, (state, action) => {
                state.invitationsSent.status = "failed";
                state.invitationsSent.error = action.payload;
            })

            // Accept connection request
            .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
                // Move from pending to connections
                const connectionId = action.payload.connectionId;
                const acceptedRequest = state.pendingConnections.data.find(
                    req => req._id === connectionId
                );
                
                if (acceptedRequest) {
                    // Remove from pending
                    state.pendingConnections.data = state.pendingConnections.data.filter(
                        req => req._id !== connectionId
                    );
                    
                    // Add to connections with accepted status
                    const userData = acceptedRequest.requester || acceptedRequest.user;
                    if (userData) {
                        state.connections.data.push({
                            _id: connectionId,
                            status: 'accepted',
                            user: userData
                        });
                    }
                }
            })

            // Reject connection request
            .addCase(rejectConnectionRequest.fulfilled, (state, action) => {
                // Remove from pending connections and sent invitations
                const connectionId = action.payload;
                
                state.pendingConnections.data = state.pendingConnections.data.filter(
                    req => req._id !== connectionId
                );
                
                state.invitationsSent.data = state.invitationsSent.data.filter(
                    inv => inv._id !== connectionId
                );
            })

            // Remove connection
            .addCase(removeUserConnection.fulfilled, (state, action) => {
                // Remove from connections
                const connectionId = action.payload;
                state.connections.data = state.connections.data.filter(
                    conn => conn._id !== connectionId
                );
            })

            // Toggle follow
            .addCase(toggleFollowButton.fulfilled, (state, action) => {
                const { userId, isFollowing, user } = action.payload;
                
                if (isFollowing) {
                    // If now following, add to followings list if not already there
                    const alreadyFollowing = state.followings.data.some(
                        following => following._id === userId
                    );
                    
                    if (!alreadyFollowing && user) {
                        state.followings.data.push(user);
                    }
                } else {
                    // If unfollowed, remove from followings list
                    state.followings.data = state.followings.data.filter(
                        following => following._id !== userId
                    );
                }
            })

            // Remove follower
            .addCase(removeUserFollower.fulfilled, (state, action) => {
                const { userId } = action.payload;
                state.followers.data = state.followers.data.filter(
                    follower => follower._id !== userId
                );
            });
    },
});

export const { clearNetworkData } = userNetworkSlice.actions;

// Selectors
export const selectConnections = (state) => state.userNetwork.connections;
export const selectFollowers = (state) => state.userNetwork.followers;
export const selectFollowings = (state) => state.userNetwork.followings;
export const selectPendingConnections = (state) => state.userNetwork.pendingConnections;
export const selectInvitationsSent = (state) => state.userNetwork.invitationsSent;

export default userNetworkSlice.reducer;

