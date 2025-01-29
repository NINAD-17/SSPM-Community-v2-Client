import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial States
const initialState = {
    user: null,
    state: "idle",
    error: null,
};

// Async Actions

// Slice
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // User Login
        setUser(state, action) {
            state.user = action.payload;
            state.state = "succeeded";
        },
        // User Logout
        clearUser(state) {
            state.user = null;
            state.state = "succeeded";
        },
        // Error Handling
        setError(state, action) {
            state.error = action.payload;
            state.state = "failed";
        },
    },
});

export const { setUser, clearUser, setError } = userSlice.actions;

export default userSlice.reducer;

