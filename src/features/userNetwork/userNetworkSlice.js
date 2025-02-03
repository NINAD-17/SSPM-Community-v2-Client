import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchFollowers,
    fetchFollowings,
    fetchConnections,
    toggleFollow,
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
} from "./services/userNetworkService";
import { fetchInvitations, fetchPendingConnections, removeConnection, removeFollower } from "./services/userNetworkService";
// import { userNetworkService } from "./services/userNetworkService";

const initialState = {
    followers: {
        data: [],
        status: 'idle',
        error: null
    },
    followings: {
        data: [],
        status: 'idle',
        error: null
    },
    connections: {
        data: [],
        status: 'idle',
        error: null
    },
    invitations: {
        data: [],
        status: 'idle',
        error: null
    },
    pendingConnections: {
        data: [],
        status: 'idle',
        error: null
    }
};

export const loadFollowers = createAsyncThunk(
    "userNetwork/loadFollowers",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await fetchFollowers(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadFollowings = createAsyncThunk(
    "userNetwork/loadFollowings",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await fetchFollowings(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to load followings"
            );
        }
    }
);

export const loadConnections = createAsyncThunk(
    "userNetwork/loadConnections",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await fetchConnections(userId);
            console.log("In slice connections: ", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to load connections"
            );
        }
    }
);

export const loadPendingConnections = createAsyncThunk(
    "userNetwork/loadPendingConnections",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchPendingConnections();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to load pending connections"
            );
        }
    }
);

export const loadInvitations = createAsyncThunk(
    "userNetwork/loadInvitations",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchInvitations();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to load invitations"
            );
        }
    }
);

export const toggleFollowButton = createAsyncThunk(
    "userNetwork/toggleFollow",
    async (followerId, { rejectWithValue }) => {
        try {
            const response = await toggleFollow(followerId);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to toggle follow"
            );
        }
    }
);

export const removeFollowerButton = createAsyncThunk(
    "userNetwork/removeFollower",
    async (followerId, { rejectWithValue }) => {
        try {
            const response = await removeFollower(followerId);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to remove follower"
            );
        }
    }
);

export const removeConnectionButton = createAsyncThunk(
    "userNetwork/removeConnection",
    async (connectionId, { rejectWithValue }) => {
        try {
            const response = await removeConnection(connectionId);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to remove connection"
            );
        }
    }
);

export const acceptConnectionRequestButton = createAsyncThunk(
    "userNetwork/acceptConnectionRequest",
    async (connectionId, { rejectWithValue }) => {
        try {
            const response = await acceptConnectionRequest(connectionId);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to accept connection request"
            );
        }
    }
);

export const rejectConnectionRequestButton = createAsyncThunk(
    "userNetwork/rejectConnectionRequest",
    async (connectionId, { rejectWithValue }) => {
        try {
            const response = await declineConnectionRequest(connectionId);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to reject connection request"
            );
        }
    }
);

const userNetworkSlice = createSlice({
    name: "userNetwork",
    initialState,
    reducers: {
        clearUserNetwork: (state) => {
            Object.keys(state).forEach(key => {
                state[key] = {
                    data: [],
                    status: 'idle',
                    error: null
                };
            });
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadFollowers.pending, (state) => {
                state.followers.status = "loading";
                state.followers.error = null;
            })
            .addCase(loadFollowers.fulfilled, (state, action) => {
                state.followers.status = "succeeded";
                state.followers.data = action.payload;
                state.followers.error = null;
            })
            .addCase(loadFollowers.rejected, (state, action) => {
                state.followers.status = "failed";
                state.followers.error = action.payload;
            })
            .addCase(loadFollowings.pending, (state) => {
                state.followings.status = "loading";
                state.followings.error = null;
            })
            .addCase(loadFollowings.fulfilled, (state, action) => {
                state.followings.status = "succeeded";
                state.followings.data = action.payload;
                state.followings.error = null;
            })
            .addCase(loadFollowings.rejected, (state, action) => {
                state.followings.status = "failed";
                state.followings.error = action.payload || action.error.message;
            })
            .addCase(loadConnections.pending, (state) => {
                state.connections.status = "loading";
                state.connections.error = null;
            })
            .addCase(loadConnections.fulfilled, (state, action) => {
                state.connections.status = "succeeded";
                state.connections.data = action.payload;
                state.connections.error = null;
            })
            .addCase(loadConnections.rejected, (state, action) => {
                state.connections.status = "failed";
                state.connections.error = action.payload || action.error.message;
            })
            .addCase(removeConnectionButton.pending, (state) => {
                state.connections.status = "loading";
            })
            .addCase(removeConnectionButton.fulfilled, (state, action) => {
                const { connectionId } = action.payload;
                state.connections.data = state.connections.data.filter(
                    (connection) => connection._id !== connectionId
                );
            })
            .addCase(toggleFollowButton.pending, (state) => {
                state.connections.status = "loading";
            })
            .addCase(toggleFollowButton.fulfilled, (state, action) => {
                const { userId, isFollowed } = action.payload;
                if (isFollowed) {
                    state.followings.data.push(userId);
                } else {
                    state.followings.data = state.followings.data.filter(
                        (id) => id !== userId
                    );
                }
            })
            .addCase(removeFollowerButton.pending, (state) => {
                state.followers.status = "loading";
            })
            .addCase(removeFollowerButton.fulfilled, (state, action) => {
                const { followerId } = action.payload;
                state.followers.data = state.followers.data.filter(
                    (id) => id !== followerId
                );
            })
            .addCase(acceptConnectionRequestButton.pending, (state) => {
                state.pendingConnections.status = "loading";
            })
            .addCase(acceptConnectionRequestButton.fulfilled, (state, action) => {
                const { profile, connectionId } = action.payload;
                state.pendingConnections.data = state.pendingConnections.data
                    .filter(conn => conn._id !== connectionId);
                state.connections.data.push(profile);
            })
            .addCase(rejectConnectionRequestButton.pending, (state) => {
                state.pendingConnections.status = "loading";
            })
            .addCase(rejectConnectionRequestButton.fulfilled, (state, action) => {
                const { connectionId } = action.payload;
                state.pendingConnections.data = state.pendingConnections.data
                    .filter(conn => conn._id !== connectionId);
            })
    },
});

export const selectFollowers = (state) => state.userNetwork.followers;
export const selectFollowings = (state) => state.userNetwork.followings;
export const selectConnections = (state) => state.userNetwork.connections;
export const selectInvitations = (state) => state.userNetwork.invitations;
export const selectPendingConnections = (state) =>
    state.userNetwork.pendingConnections;


export const { clearUserNetwork } = userNetworkSlice.actions;
export default userNetworkSlice.reducer;

