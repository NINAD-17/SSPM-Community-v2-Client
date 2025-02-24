import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProfile } from "./services/profileService";

const initialState = {
    profile: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    // lastFetched: null, // Add timestamp for caching
};

export const fetchUserProfile = createAsyncThunk(
    "profile/fetchUserProfile",
    async (userId, { getState, rejectWithValue }) => {
        try {
            // Check if we already have this profile and it's recent (within 5 minutes)
            // const { profile, lastFetched } = getState().profile;
            // const isCacheValid = lastFetched && (Date.now() - lastFetched) < 300000; // 5 minutes
            
            // if (profile?._id === userId && isCacheValid) {
            //     return profile;
            // }

            const response = await fetchProfile(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch profile"
            );
        }
    }
);

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.profile = null;
            state.status = "idle";
            state.error = null;
            // state.lastFetched = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                console.log("ooprof: ", action.payload)
                state.profile = action.payload.profile;
                state.status = "succeeded";
                state.error = null;
                // state.lastFetched = Date.now();
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Something went wrong";
                state.profile = null;
            });
    },
});

// Selectors
// export const selectProfile = (state) => state.profile.profile;
// export const selectProfileStatus = (state) => state.profile.status;
// export const selectProfileError = (state) => state.profile.error;

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
