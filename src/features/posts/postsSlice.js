import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
    createPost, 
    deletePost, 
    fetchUserPosts, 
    fetchFeedPosts,
    uploadPostMedia
} from "./services/postsService";

const initialState = {
    feed: {
        data: [],
        totalPosts: 0,
        lastPostId: null,
        allPostsFetched: false,
        status: 'idle',
        error: null
    },
    userPosts: {
        data: [],
        totalPosts: 0,
        lastPostId: null,
        allPostsFetched: false,
        status: 'idle',
        error: null
    }
};

// Async Thunks
export const createNewPost = createAsyncThunk(
    "posts/createPost",
    async ({ content, media, contentType = "richText" }, { rejectWithValue }) => {
        try {
            let mediaResponse = null;
            if (media?.length > 0) {
                const formData = new FormData();
                media.forEach(file => formData.append("media", file));
                mediaResponse = await uploadPostMedia(formData);
            }

            const response = await createPost({ 
                content, 
                media: mediaResponse,
                contentType 
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadUserPosts = createAsyncThunk(
    "posts/loadUserPosts",
    async ({ userId, lastPostId, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await fetchUserPosts(userId, { lastPostId, limit });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadFeedPosts = createAsyncThunk(
    "posts/loadFeedPosts",
    async ({ lastPostId, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await fetchFeedPosts({ lastPostId, limit });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removePost = createAsyncThunk(
    "posts/deletePost",
    async (postId, { rejectWithValue }) => {
        try {
            await deletePost(postId);
            return postId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        clearPosts: (state) => initialState,
        clearFeed: (state) => {
            state.feed = initialState.feed;
        },
        updatePostInState: (state, action) => {
            const { postId, updates } = action.payload;
            
            // Update in feed if exists
            const feedPost = state.feed.data.find(p => p._id === postId);
            if (feedPost) {
                Object.assign(feedPost, updates);
            }

            // Update in userPosts if exists
            const userPost = state.userPosts.data.find(p => p._id === postId);
            if (userPost) {
                Object.assign(userPost, updates);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle createNewPost
            .addCase(createNewPost.pending, (state) => {
                state.feed.status = 'loading';
                state.userPosts.status = 'loading';
            })
            .addCase(createNewPost.fulfilled, (state, action) => {
                state.feed.status = 'succeeded';
                state.userPosts.status = 'succeeded';
                if (action.payload?.data) {
                    state.feed.data.unshift(action.payload.data);
                    state.userPosts.data.unshift(action.payload.data);
                }
            })
            .addCase(createNewPost.rejected, (state, action) => {
                state.feed.status = 'failed';
                state.userPosts.status = 'failed';
                state.feed.error = action.payload;
                state.userPosts.error = action.payload;
            })
            // Handle loadUserPosts and loadFeedPosts
            .addCase(loadUserPosts.pending, (state) => {
                state.userPosts.status = 'loading';
            })
            .addCase(loadUserPosts.fulfilled, (state, action) => {
                state.userPosts.status = 'succeeded';
                state.userPosts.data = action.payload.data.posts;
                state.userPosts.totalPosts = action.payload.data.totalPosts;
                state.userPosts.allPostsFetched = action.payload.data.allPostsFetched;
                state.userPosts.lastPostId = action.payload.data.lastPostId;
            })
            .addCase(loadFeedPosts.pending, (state) => {
                state.feed.status = 'loading';
            })
            .addCase(loadFeedPosts.fulfilled, (state, action) => {
                const { posts, totalPosts, allPostsFetched, lastPostId } = action.payload.data;
                state.feed.status = 'succeeded';
                if (state.feed.lastPostId) {
                    const newPosts = posts.filter(
                        newPost => !state.feed.data.some(
                            existingPost => existingPost._id === newPost._id
                        )
                    );
                    state.feed.data = [...state.feed.data, ...newPosts];
                } else {
                    state.feed.data = posts;
                }
                state.feed.totalPosts = totalPosts;
                state.feed.allPostsFetched = allPostsFetched;
                state.feed.lastPostId = lastPostId;
            })
            // Handle removePost
            .addCase(removePost.fulfilled, (state, action) => {
                state.feed.data = state.feed.data.filter(
                    post => post._id !== action.payload
                );
                state.userPosts.data = state.userPosts.data.filter(
                    post => post._id !== action.payload
                );
            });
    }
});

// Selectors
export const selectAllPosts = (state) => state.posts.posts;

export const { clearPosts, clearFeed, updatePostInState } = postsSlice.actions;
export default postsSlice.reducer;
