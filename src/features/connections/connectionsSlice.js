import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserConnections } from '../user/services/userService';

// Async thunk for fetching user connections
export const loadUserConnections = createAsyncThunk(
  'connections/loadUserConnections',
  async ({ userId, lastConnectionId, limit }, { rejectWithValue }) => {
    try {
      const response = await fetchUserConnections(userId, lastConnectionId, limit);
      const transformedConnections = response.data.connections.map(conn => ({
        _id: conn.user._id,
        firstName: conn.user.firstName,
        lastName: conn.user.lastName,
        avatar: conn.user.avatar,
        headline: conn.user.headline || '',
        email: conn.user.email
      }));
      
      return {
        connections: transformedConnections,
        totalConnections: transformedConnections.length,
        hasMore: false // API doesn't currently support pagination
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load connections');
    }
  }
);

const initialState = {
  connections: [],
  totalConnections: 0,
  hasMore: false,
  isLoading: false,
  error: null
};

const connectionsSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    clearConnections: (state) => {
      state.connections = [];
      state.totalConnections = 0;
      state.hasMore = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserConnections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadUserConnections.fulfilled, (state, action) => {
        state.isLoading = false;
        // If lastConnectionId was provided, append to existing connections
        // Otherwise, replace the connections array
        if (action.meta.arg.lastConnectionId) {
          state.connections = [...state.connections, ...action.payload.connections];
        } else {
          state.connections = action.payload.connections;
        }
        state.totalConnections = action.payload.totalConnections;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(loadUserConnections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to load connections';
      });
  }
});

export const { clearConnections } = connectionsSlice.actions;
export default connectionsSlice.reducer; 