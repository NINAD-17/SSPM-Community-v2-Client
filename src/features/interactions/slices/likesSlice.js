import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toggleLike, fetchPostLikes } from "../services/likesService";

const initialState = {
    byPostId: {}, // { postId: { count: number, likedByMe: boolean } }
    status: 'idle',
    error: null
};

export const togglePostLike = createAsyncThunk(
    "likes/toggle",
    async ({ postId, postType }, { rejectWithValue }) => {
        try {
            const response = await toggleLike(postId, postType);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const likesSlice = createSlice({
    name: "likes",
    initialState,
    reducers: {
        clearLikes: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(togglePostLike.fulfilled, (state, action) => {
                const { postId, liked, count } = action.payload.data;
                state.byPostId[postId] = { count, likedByMe: liked };
            });
    }
}); 