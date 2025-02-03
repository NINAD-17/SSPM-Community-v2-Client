import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    fetchGroups, 
    createGroup, 
    joinGroup, 
    leaveGroup,
    fetchGroupDetails,
    fetchGroupPosts,
    createGroupPost,
    deletePost,
    fetchRecommendedGroups
} from './services/groupService';

export const loadGroups = createAsyncThunk(
    'groups/loadGroups',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchGroups();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createNewGroup = createAsyncThunk(
    'groups/createGroup',
    async (groupData, { rejectWithValue }) => {
        try {
            const response = await createGroup(groupData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const joinGroupAction = createAsyncThunk(
    'groups/joinGroup',
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await joinGroup(groupId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const leaveGroupAction = createAsyncThunk(
    'groups/leaveGroup',
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await leaveGroup(groupId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadGroupDetails = createAsyncThunk(
    'groups/loadGroupDetails',
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await fetchGroupDetails(groupId);
            console.log("loadGroup: ", {response})
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadGroupPosts = createAsyncThunk(
    'groups/loadGroupPosts',
    async ({ groupId, lastPostId }, { rejectWithValue }) => {
        try {
            console.log("load params: ", {groupId, lastPostId})
            const response = await fetchGroupPosts(groupId, lastPostId);
            console.log("group posts resp data: ", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createNewGroupPost = createAsyncThunk(
    'groups/createPost',
    async ({ groupId, postData }, { rejectWithValue }) => {
        try {
            const response = await createGroupPost(groupId, postData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteGroupPost = createAsyncThunk(
    'groups/deletePost',
    async (postId, { rejectWithValue }) => {
        try {
            await deletePost(postId);
            return postId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadGroupRecommendations = createAsyncThunk(
    'groups/loadRecommendations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchRecommendedGroups();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    // All groups for listing/discovery
    groups: [],
    
    // Groups the logged-in user is a member of
    userGroups: [], 
    
    // Group recommendations/suggestions
    suggestions: [],
    
    // Currently viewed group details
    currentGroup: null,
    
    // Posts of current group
    groupPosts: {
        posts: [],
        totalPosts: 0,
        lastPostId: null,
        allPostsFetched: false
    },
    
    status: 'idle',
    error: null
};

const groupsSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        clearGroupPosts: (state) => {
            state.groupPosts = initialState.groupPosts;
        },
        clearCurrentGroup: (state) => {
            state.currentGroup = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Load all groups
            .addCase(loadGroups.fulfilled, (state, action) => {
                state.groups = action.payload.data;
            })
            
            // // Load user's groups
            // .addCase(loadUserGroups.fulfilled, (state, action) => {
            //     state.userGroups = action.payload.data;
            // })
            
            // // Load group suggestions
            // .addCase(loadGroupSuggestions.fulfilled, (state, action) => {
            //     state.suggestions = action.payload.data;
            // })
            
            // Current group operations
            .addCase(loadGroupDetails.fulfilled, (state, action) => {
                console.log("payload: ", action.payload)
                state.currentGroup = action.payload.data.group;
                // state.currentGroup = action.payload.data;
            })
            
            // Group posts operations
            .addCase(loadGroupPosts.fulfilled, (state, action) => {
                console.log("ld posts: ", action.payload);
                const { posts, totalPosts, lastPostId, allPostsFetched } = action.payload.data;
                
                // If we're loading more posts (pagination)
                if (state.groupPosts.lastPostId) {
                    state.groupPosts.posts.push(...posts);
                    console.log("slice grp pst: ", state.groupPosts.posts)
                } else {
                    // Initial load
                    state.groupPosts.posts = posts;
                    console.log("slice grp pst: ", {posts}, state.groupPosts.posts);
                }
                
                state.groupPosts.totalPosts = totalPosts;
                state.groupPosts.lastPostId = lastPostId;
                state.groupPosts.allPostsFetched = allPostsFetched;
            })
            .addCase(deleteGroupPost.fulfilled, (state, action) => {
                state.groupPosts.posts = state.groupPosts.posts.filter(
                    post => post._id !== action.payload
                );
                state.groupPosts.totalPosts--;
            })
            .addCase(loadGroupRecommendations.fulfilled, (state, action) => {
                state.suggestions = action.payload.data.recommendations;
            })
            // ... other cases
    }
});

export const { clearGroupPosts } = groupsSlice.actions;

export default groupsSlice.reducer; 