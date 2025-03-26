import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    fetchGroupDetails,
    fetchGroupPosts,
    createGroupPost,
    deleteGroupPost,
    updateGroupPost as updateGroupPostAPI,
    joinGroup as joinGroupAPI,
    leaveGroup as leaveGroupAPI,
    fetchRecommendedGroups,
    fetchGroupMembers,
    fetchGroupAdmins,
    fetchAllGroups,
    fetchAllUserJoinedGroups,
    // updateGroup
} from './services/groupService';
import { toast } from 'sonner';

const initialState = {
    // Current viewed group data
    currentGroup: {
        data: null,
        members: {
            items: [], // For both preview and modal
            status: 'idle',
            error: null,
            totalCount: 0,
            lastMemberId: null,
            allFetched: false,
            fetchCount: 0
        },
        admins: {
            items: [], // For both preview and modal
            status: 'idle',
            error: null,
            totalCount: 0,
            lastAdminId: null,
            allFetched: false,
            fetchCount: 0
        },
        posts: {
            items: [],
            totalCount: 0,
            totalFetchedPosts: 0,
            lastId: null,
            allFetched: false,
            fetchCount: 0
        },
        status: 'idle',
        error: null
    },
    // Groups listing page data
    groupsList: {
        all: {
            items: [],
            totalCount: 0,
            lastId: null,
            allFetched: false,
            searchQuery: '',
            fetchCount: 0
        },
        joined: {
            items: [],
            totalCount: 0,
            lastId: null,
            allFetched: false,
            fetchCount: 0
        },
        recommended: [], // Limited list
        status: 'idle',
        error: null
    }
};

// Current Group Thunks
export const loadGroupDetails = createAsyncThunk(
    'groups/loadGroupDetails',
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await fetchGroupDetails(groupId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to load group details');
        }
    }
);

export const loadGroupPosts = createAsyncThunk(
    'groups/loadGroupPosts',
    async ({ groupId, lastPostId = null, limit = 10, fetchCount = 0, sortBy = 'createdAt', sortType = 'desc' }, { rejectWithValue }) => {
        try {
            const response = await fetchGroupPosts(groupId, lastPostId, limit, fetchCount, sortBy, sortType);
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to load group posts');
        }
    }
);

export const loadGroupMembers = createAsyncThunk(
    'groups/loadGroupMembers',
    async ({ groupId, lastMemberId = null, limit = 10, fetchCount = 0 }, { rejectWithValue }) => {
        try {
            const response = await fetchGroupMembers(groupId, lastMemberId, limit, fetchCount);
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to load group members');
        }
    }
);

export const loadGroupAdmins = createAsyncThunk(
    'groups/loadGroupAdmins',
    async ({ groupId, lastAdminId = null, limit = 10, fetchCount = 0 }, { rejectWithValue }) => {
        try {
            const response = await fetchGroupAdmins(groupId, lastAdminId, limit, fetchCount);
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to load group admins');
        }
    }
);

export const createNewGroupPost = createAsyncThunk(
    'groups/createNewGroupPost',
    async ({ groupId, postData }, { rejectWithValue }) => {
        try {
            const response = await createGroupPost(groupId, postData);
            return response.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error?.response?.data?.message || 'Failed to create post');
        }
    }
);

export const updateGroupPost = createAsyncThunk(
    'groups/updateGroupPost',
    async ({ groupId, postId, postData }, { rejectWithValue }) => {
        try {
            const response = await updateGroupPostAPI(groupId, postId, postData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to update post');
        }
    }
);

export const removeGroupPost = createAsyncThunk(
    'groups/removeGroupPost',
    async ({ postId, groupId }, { rejectWithValue }) => {
        try {
            await deleteGroupPost(postId, groupId);
            return { postId, groupId };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete post");
        }
    }
);

// Group Membership Thunks
export const joinGroup = createAsyncThunk(
    'groups/joinGroup',
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await joinGroupAPI(groupId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to join group');
        }
    }
);

export const leaveGroup = createAsyncThunk(
    'groups/leaveGroup',
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await leaveGroupAPI(groupId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to leave group');
        }
    }
);

// Groups List Page Thunks
export const loadAllGroups = createAsyncThunk(
    'groups/loadAllGroups',
    async ({ lastId = null, limit = 10, search = '', fetchCount = 0 }, { rejectWithValue }) => {
        try {
            const response = await fetchAllGroups(lastId, limit, search);
            console.log("Loaded Groups in slice: ", response.data)
            return { 
                groups: response.data.allGroups || [], 
                totalCount: response.data.totalGroups || 0,
                hasMore: response.data.totalGroups > (response.data.allGroups || []).length,
                fetchCount, 
                search 
            };
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to load groups');
        }
    }
);

export const loadUserJoinedGroups = createAsyncThunk(
    'groups/loadUserJoinedGroups',
    async ({ lastId = null, limit = 10, fetchCount = 0 }, { rejectWithValue }) => {
        try {
            const response = await fetchAllUserJoinedGroups(lastId, limit);
            return { ...response.data, fetchCount };
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to load joined groups');
        }
    }
);

export const loadRecommendedGroups = createAsyncThunk(
    'groups/loadRecommendedGroups',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchRecommendedGroups();
            console.log('Recommendations response in thunk:', response.data);
            
            // Handle potential structure differences more safely
            if (response.data && response.data.recommendations) {
                return response.data.recommendations || [];
            } else if (Array.isArray(response.data)) {
                return response.data;
            } else {
                console.warn('Unexpected recommendations data structure:', response);
                return [];
            }
        } catch (error) {
            console.error('Error in loadRecommendedGroups thunk:', error);
            return rejectWithValue(error?.response?.data?.message || 'Failed to load recommendations');
        }
    }
);

const groupsSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        clearCurrentGroup: (state) => {
            state.currentGroup = initialState.currentGroup;
        },
        clearGroupsList: (state) => {
            state.groupsList = initialState.groupsList;
        },
        updateGroupPostInState: (state, action) => {
            const { postId, updates } = action.payload;
            const post = state.currentGroup.posts.items.find(p => p._id === postId);
            if (post) {
                Object.assign(post, updates);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Load Group Details
            .addCase(loadGroupDetails.pending, (state) => {
                state.currentGroup.status = 'loading';
            })
            .addCase(loadGroupDetails.fulfilled, (state, action) => {
                console.log('loadGroupDetails.fulfilled:', action.payload);
                state.currentGroup.status = 'succeeded';
                state.currentGroup.data = action.payload.group;
                state.currentGroup.error = null;
            })
            .addCase(loadGroupDetails.rejected, (state, action) => {
                state.currentGroup.status = 'failed';
                state.currentGroup.error = action.payload;
                toast.error(action.payload);
            })

            // Load Group Members
            .addCase(loadGroupMembers.pending, (state) => {
                state.currentGroup.members.status = 'loading';
            })
            .addCase(loadGroupMembers.fulfilled, (state, action) => {
                console.log('loadGroupMembers.fulfilled:', action.payload);
                const { members, totalMembers, lastMemberId, allMembersFetched, fetchCount } = action.payload;
                
                if (fetchCount === 0) {
                    state.currentGroup.members.items = members;
                } else {
                    state.currentGroup.members.items = [...state.currentGroup.members.items, ...members];
                }
                
                state.currentGroup.members.totalCount = totalMembers;
                state.currentGroup.members.lastMemberId = lastMemberId;
                state.currentGroup.members.allFetched = allMembersFetched;
                state.currentGroup.members.fetchCount = fetchCount;
                state.currentGroup.members.status = 'succeeded';
                state.currentGroup.members.error = null;
            })
            .addCase(loadGroupMembers.rejected, (state, action) => {
                state.currentGroup.members.status = 'failed';
                state.currentGroup.members.error = action.payload;
                toast.error(action.payload);
            })
            
            // Load Group Admins
            .addCase(loadGroupAdmins.pending, (state) => {
                state.currentGroup.admins.status = 'loading';
            })
            .addCase(loadGroupAdmins.fulfilled, (state, action) => {
                console.log('loadGroupAdmins.fulfilled:', action.payload);
                const { admins, totalAdmins, lastAdminId, allAdminsFetched, fetchCount } = action.payload;
                
                if (fetchCount === 0) {
                    state.currentGroup.admins.items = admins;
                } else {
                    state.currentGroup.admins.items = [...state.currentGroup.admins.items, ...admins];
                }
                
                state.currentGroup.admins.totalCount = totalAdmins;
                state.currentGroup.admins.lastAdminId = lastAdminId;
                state.currentGroup.admins.allFetched = allAdminsFetched;
                state.currentGroup.admins.fetchCount = fetchCount;
                state.currentGroup.admins.status = 'succeeded';
                state.currentGroup.admins.error = null;
            })
            .addCase(loadGroupAdmins.rejected, (state, action) => {
                state.currentGroup.admins.status = 'failed';
                state.currentGroup.admins.error = action.payload;
                toast.error(action.payload);
            })

            // Load Group Posts
            .addCase(loadGroupPosts.pending, (state) => {
                state.currentGroup.status = 'loading';
            })
            .addCase(loadGroupPosts.fulfilled, (state, action) => {
                console.log('loadGroupPosts.fulfilled:', action.payload);
                const { posts, totalPosts, totalFetchedPosts, fetchCount, lastPostId, allPostsFetched } = action.payload;
                
                if (fetchCount === 0) {
                    state.currentGroup.posts.items = posts;
                } else {
                    state.currentGroup.posts.items = [...state.currentGroup.posts.items, ...posts];
                }
                
                state.currentGroup.posts.totalCount = totalPosts;
                state.currentGroup.posts.lastId = lastPostId;
                state.currentGroup.posts.allFetched = allPostsFetched;
                state.currentGroup.posts.totalFetchedPosts = totalFetchedPosts;
                state.currentGroup.posts.fetchCount = fetchCount;
                state.currentGroup.status = 'succeeded';
                state.currentGroup.error = null;
            })
            .addCase(loadGroupPosts.rejected, (state, action) => {
                state.currentGroup.status = 'failed';
                state.currentGroup.error = action.payload;
                toast.error(action.payload);
            })

            // Create/Update/Delete Group Post
            .addCase(createNewGroupPost.fulfilled, (state, action) => {
                console.log("Create New Gr post: ", action.payload);
                
                // Transform the post data to match the expected structure
                const newPost = {
                    ...action.payload.post,
                    user: {
                        _id: action.payload.post.userId,
                        firstName: state.user?.user?.firstName,
                        lastName: state.user?.user?.lastName,
                        avatar: state.user?.user?.avatar,
                        headline: state.user?.user?.headline
                    },
                    likesCount: 0,
                    commentsCount: 0,
                    isLiked: false
                };

                // Add the transformed post to the beginning of the list
                state.currentGroup.posts.items.unshift(newPost);
                state.currentGroup.posts.totalCount += 1;
                if (state.currentGroup.data) {
                    state.currentGroup.data.postsCount += 1;
                }
            })
            .addCase(updateGroupPost.fulfilled, (state, action) => {
                const index = state.currentGroup.posts.items.findIndex(
                    post => post._id === action.payload._id
                );
                if (index !== -1) {
                    state.currentGroup.posts.items[index] = action.payload;
                }
            })
            .addCase(removeGroupPost.fulfilled, (state, action) => {
                const { postId } = action.payload;
                state.currentGroup.posts.items = state.currentGroup.posts.items.filter(
                    post => post._id !== postId
                );
                state.currentGroup.posts.totalCount -= 1;
                if (state.currentGroup.data) {
                    state.currentGroup.data.postsCount = Math.max(0, state.currentGroup.data.postsCount - 1);
                }
            })
            .addCase(removeGroupPost.rejected, (state, action) => {
                toast.error(action.payload || "Failed to delete post");
            })

            // Group Membership
            .addCase(joinGroup.fulfilled, (state, action) => {
                console.log("Join group: ", action.payload)
                if (state.currentGroup.data) {
                    state.currentGroup.data.isMember = true;
                    state.currentGroup.data.membersCount += 1;
                }
                // Update in groups list if exists
                const groupInList = state.groupsList.all.items.find(g => g._id === action.payload.groupId);
                if (groupInList) {
                    groupInList.isMember = true;
                    groupInList.membersCount += 1;
                }
            })
            .addCase(leaveGroup.fulfilled, (state, action) => {
                console.log("Leave: ", action.payload)
                if (state.currentGroup.data) {
                    state.currentGroup.data.isMember = false;
                    state.currentGroup.data.membersCount = Math.max(0, state.currentGroup.data.membersCount - 1);
                }
                // Update in groups list if exists
                const groupInList = state.groupsList.all.items.find(g => g._id === action.payload.groupId);
                if (groupInList) {
                    groupInList.isMember = false;
                    groupInList.membersCount = Math.max(0, groupInList.membersCount - 1);
                }
            })

            // Groups List Page
            .addCase(loadAllGroups.pending, (state) => {
                state.groupsList.status = 'loading';
            })
            .addCase(loadAllGroups.fulfilled, (state, action) => {
                const { groups, totalCount, hasMore, fetchCount, search } = action.payload;
                
                if (fetchCount === 0 || state.groupsList.all.searchQuery !== search) {
                    state.groupsList.all.items = groups;
                } else {
                    state.groupsList.all.items = [...state.groupsList.all.items, ...groups];
                }
                
                state.groupsList.all.totalCount = totalCount;
                state.groupsList.all.lastId = groups.length > 0 ? groups[groups.length - 1]?._id : null;
                state.groupsList.all.allFetched = !hasMore;
                state.groupsList.all.fetchCount = fetchCount;
                state.groupsList.all.searchQuery = search;
                state.groupsList.status = 'succeeded';
                state.groupsList.error = null;
            })
            .addCase(loadAllGroups.rejected, (state, action) => {
                state.groupsList.status = 'failed';
                state.groupsList.error = action.payload;
            })

            .addCase(loadUserJoinedGroups.fulfilled, (state, action) => {
                const { groups, totalCount, hasMore, fetchCount } = action.payload;
                
                if (fetchCount === 0) {
                    state.groupsList.joined.items = groups;
                } else {
                    state.groupsList.joined.items = [...state.groupsList.joined.items, ...groups];
                }
                
                state.groupsList.joined.totalCount = totalCount;
                state.groupsList.joined.lastId = groups[groups.length - 1]?._id;
                state.groupsList.joined.allFetched = !hasMore;
                state.groupsList.joined.fetchCount = fetchCount;
            })

            .addCase(loadRecommendedGroups.pending, (state) => {
                state.groupsList.status = 'loading';
            })
            .addCase(loadRecommendedGroups.fulfilled, (state, action) => {
                state.groupsList.recommended = action.payload;
                state.groupsList.status = 'succeeded';
                state.groupsList.error = null;
            })
            .addCase(loadRecommendedGroups.rejected, (state, action) => {
                state.groupsList.status = 'failed';
                state.groupsList.error = action.payload;
            });
    }
});

export const { 
    clearCurrentGroup, 
    clearGroupsList, 
    updateGroupPostInState 
} = groupsSlice.actions;

export default groupsSlice.reducer; 