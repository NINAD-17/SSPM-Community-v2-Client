import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateUserAvatar, updateUserProfile } from "./services/userService";

// Initial States
const initialState = {
    user: null,
    status: 'idle',
    error: null
};

// Async action for updating profile
export const updateProfile = createAsyncThunk(
    "user/updateProfile",
    async ({ formData, userId }, { rejectWithValue }) => {
        try {
            const response = await updateUserProfile(formData, userId);
            if (!response?.data?.profile) {
                throw new Error('No profile data received');
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

export const updateAvatar = createAsyncThunk(
    "user/updateAvatar",
    async ({ avatarData, userId }, { rejectWithValue }) => {
        try {
            const response = await updateUserAvatar(avatarData, userId);
            console.log({response});
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update avatar");
        }
    }
);

// Slice
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // User Login
        setUser: (state, action) => {
            state.user = action.payload;
            state.status = 'succeeded';
            state.error = null;
        },
        // User Logout
        clearUser: (state) => {
            state.user = null;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateProfile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload.profile;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateAvatar.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateAvatar.fulfilled, (state, action) => {
                state.user = action.payload.profile;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(updateAvatar.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;


