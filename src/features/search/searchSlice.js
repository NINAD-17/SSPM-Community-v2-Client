import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    query: '',
    results: {
        users: [],
        groups: [],
        posts: [],
        status: 'idle',
        error: null
    }
};

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setQuery: (state, action) => {
            state.query = action.payload;
        }
    },
    extraReducers: (builder) => {
        // Add cases later
    }
});

export const { setQuery } = searchSlice.actions;
export default searchSlice.reducer; 