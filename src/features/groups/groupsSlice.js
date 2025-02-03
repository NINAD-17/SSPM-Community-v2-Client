import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    groups: {
        data: [],
        status: 'idle',
        error: null
    },
    currentGroup: {
        data: null,
        status: 'idle',
        error: null
    },
    posts: {
        data: [],
        totalPosts: 0,
        lastPostId: null,
        allPostsFetched: false,
        status: 'idle',
        error: null
    }
};

export const groupsSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Add cases later
    }
});

export default groupsSlice.reducer; 