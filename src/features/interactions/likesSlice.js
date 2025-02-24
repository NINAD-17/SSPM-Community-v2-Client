import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toggleLike } from "./services/likesService";

const initialState = {
    status: 'idle',
    error: null
}

export const togglePostLike = createAsyncThunk(
    "likes/toggle",
    async ({ postId, postType = "UserPost" }, { rejectWithValue }) => {
        try {
            const response = await toggleLike(postId, postType);
            return {
                postId,
                liked: response.data.liked
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const likesSlice = createSlice({
    name: "likes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(togglePostLike.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(togglePostLike.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(togglePostLike.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export default likesSlice.reducer; 