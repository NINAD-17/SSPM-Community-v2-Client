import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
    createPost, 
    deletePost, 
    fetchUserPosts, 
    fetchFeedPosts,
    uploadPostMedia
} from "./services/postsService";
import { toggleFollow } from "../userNetwork/services/userNetworkService";

const initialState = {
    feed: {
        data: [],
        totalPosts: 0,
        lastPostId: null,
        allPostsFetched: false,
        fetchCount: 0,
        status: 'idle',
        error: null
    },
    userPosts: {
        data: [],
        totalPosts: 0,
        lastPostId: null,
        allPostsFetched: false,
        fetchCount: 0,
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
    async ({ userId, lastPostId, limit = 10, fetchCount = 0 }, { rejectWithValue }) => {
        try {
            const response = await fetchUserPosts(userId, { lastPostId, limit, fetchCount });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadFeedPosts = createAsyncThunk(
    "posts/loadFeedPosts",
    async ({ lastPostId, limit = 10, fetchCount = 0 }, { rejectWithValue }) => {
        console.log("call: ", {fetchCount})
        try {
            const response = await fetchFeedPosts({ lastPostId, limit, fetchCount });
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

export const toggleFollowButton = createAsyncThunk(
    "posts/toggleFollow",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await toggleFollow(userId);
            console.log(response);
            if (!response?.data?.isFollowing && response?.data?.isFollowing !== false) {
                throw new Error('Invalid follow response');
            }
            return {
                userId,
                isFollowing: response.data.isFollowing
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to toggle follow");
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
        // for like update
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
                if (action.payload?.post) {
                    state.feed.data.unshift(action.payload.post);
                    state.userPosts.data.unshift(action.payload.post);
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
                const { posts, totalPosts, allPostsFetched, lastPostId, fetchCount } = action.payload.data;
                state.userPosts.status = 'succeeded';
                
                if (!state.userPosts.lastPostId) {
                    state.userPosts.data = posts;
                    state.userPosts.fetchCount = fetchCount;
                } else {
                    const newPosts = posts.filter(
                        newPost => !state.userPosts.data.some(
                            existingPost => existingPost._id === newPost._id
                        )
                    );
                    state.userPosts.data = [...state.userPosts.data, ...newPosts];
                    state.userPosts.fetchCount = fetchCount;
                }
                
                state.userPosts.totalPosts = totalPosts;
                state.userPosts.allPostsFetched = allPostsFetched;
                if (posts.length > 0 && !allPostsFetched) {
                    state.userPosts.lastPostId = lastPostId;
                }
                if (allPostsFetched) {
                    state.userPosts.status = 'idle';
                }
            })
            .addCase(loadFeedPosts.pending, (state) => {
                state.feed.status = 'loading';
            })
            .addCase(loadFeedPosts.fulfilled, (state, action) => {
                const { posts, totalPosts, allPostsFetched, totalFetchedPosts, lastPostId, fetchCount } = action.payload.data;
                console.log("slice: ", {fetchCount, totalPosts, allPostsFetched, totalFetchedPosts, lastPostId});
                state.feed.status = 'succeeded';
                
                if (!state.feed.lastPostId) {
                    state.feed.data = posts;
                    state.feed.fetchCount = fetchCount;
                } else {
                    const newPosts = posts.filter(
                        newPost => !state.feed.data.some(
                            existingPost => existingPost._id === newPost._id
                        )
                    );
                    state.feed.data = [...state.feed.data, ...newPosts];
                    state.feed.fetchCount = fetchCount;
                }
                
                state.feed.totalPosts = totalPosts;
                state.feed.allPostsFetched = allPostsFetched;
                if (posts.length > 0 && !allPostsFetched) {
                    state.feed.lastPostId = lastPostId;
                }
                if (allPostsFetched) {
                    state.feed.status = 'idle';
                }
            })
            .addCase(loadFeedPosts.rejected, (state, action) => {
                state.feed.status = 'failed';
                state.feed.error = action.payload;
            })
            // Handle removePost
            .addCase(removePost.fulfilled, (state, action) => {
                state.feed.data = state.feed.data.filter(
                    post => post._id !== action.payload
                );
                state.userPosts.data = state.userPosts.data.filter(
                    post => post._id !== action.payload
                );
            })
            .addCase(toggleFollowButton.fulfilled, (state, action) => {
                const { userId, isFollowing } = action.payload;
                
                // Update in feed posts
                state.feed.data = state.feed.data.map(post => {
                    if (post.userDetails._id === userId) {
                        return {
                            ...post,
                            userDetails: {
                                ...post.userDetails,
                                isFollowing
                            }
                        };
                    }
                    return post;
                });

                // Update in user posts
                state.userPosts.data = state.userPosts.data.map(post => {
                    if (post.userDetails._id === userId) {
                        return {
                            ...post,
                            userDetails: {
                                ...post.userDetails,
                                isFollowing
                            }
                        };
                    }
                    return post;
                });
            })
            .addCase(toggleFollowButton.rejected, (state, action) => {
                // Add error handling for follow toggle failure
                console.error('Follow toggle failed:', action.payload);
            })
    }
});

// Selectors
export const selectAllPosts = (state) => state.posts.posts;

export const { clearPosts, clearFeed, updatePostInState } = postsSlice.actions;
export default postsSlice.reducer;
