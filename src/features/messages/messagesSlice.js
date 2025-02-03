import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    conversations: {
        data: [],
        status: 'idle',
        error: null
    },
    currentChat: {
        data: null,
        messages: [],
        status: 'idle',
        error: null
    }
};

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Add cases later
    }
});

export default messagesSlice.reducer; 