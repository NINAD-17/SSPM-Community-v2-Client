import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, logoutUser } from "./services/authService";

const initialState = {
    user: null,
    status: "idle",
    error: null,
};

// Async actions
export const login = createAsyncThunk("auth/login", async (credentials) => {
    return await loginUser(credentials);
});

export const register = createAsyncThunk("auth/register", async (userData) => {
    return await registerUser(userData);
});

export const logout = createAsyncThunk("auth/logout", async () => {
    return await logoutUser();
});

// Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = "loading";
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(register.pending, (state) => {
                state.status = "loading";
            })
            .addCase(register.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(logout.pending, (state) => {
                state.status = "loading";
            })
            .addCase(logout.fulfilled, (state) => {
                state.status = "succeeded";
                state.user = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default authSlice.reducer;
