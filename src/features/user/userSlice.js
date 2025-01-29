import { createSlice } from "@reduxjs/toolkit";

// Initial States
const initialState = {
    user: null,
    status: 'idle',
    error: null
};

// Slice
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // User Login
        setUser: (state, action) => {
            state.user = action.payload;
            state.status = 'succeeded';
            state.error = null;
        },
        // User Logout
        clearUser: (state) => {
            state.user = null;
            state.status = 'idle';
            state.error = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;

