import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    loginUser,
    logoutUser,
    registerUser,
    verifyAndFetchTokenUser,
} from "./services/authService";
import { setUser, clearUser } from "../user/userSlice";

// Initial State
const initialState = {
    isAuthenticated: false,
    status: "idle",
    error: null,
};

// Async Actions
export const login = createAsyncThunk(
    "user/login", 
    async (credentials, { dispatch, rejectWithValue }) => {
        try {
            const data = await loginUser(credentials);
            dispatch(setUser(data.user));
            return data;
        } catch (error) {
            // Clear any existing user data on login failure
            dispatch(clearUser());
            return rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);

export const register = createAsyncThunk(
    "user/register", 
    async (userData, { dispatch, rejectWithValue }) => {
        try {
            const data = await registerUser(userData);
            dispatch(setUser(data.user));
            return data;
        } catch (error) {
            dispatch(clearUser());
            return rejectWithValue(error.response?.data || 'Registration failed');
        }
    }
);

export const logout = createAsyncThunk(
    "user/logout", 
    async (_, { dispatch, rejectWithValue }) => {
        try {
            await logoutUser();
            dispatch(clearUser());
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Logout failed');
        }
    }
);

export const fetchUserInfo = createAsyncThunk(
    "user/fetchUser", 
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const data = await verifyAndFetchTokenUser();
            dispatch(setUser(data.user));
            return data;
        } catch (error) {
            dispatch(clearUser());
            return rejectWithValue(error.response?.data || 'Failed to fetch user info');
        }
    }
);

// Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Login actions
            .addCase(login.pending, (state) => {
                state.status = "loading";
            })
            .addCase(login.fulfilled, (state) => {
                state.isAuthenticated = true;
                state.status = "succeeded";
                state.error = null;
                // User state is already handled in the thunk
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // Logout Actions
            .addCase(logout.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.status = "succeeded";
                state.error = null;
                // User state is already handled in the thunk
            })
            // Register Actions
            .addCase(register.pending, (state) => {
                state.status = "loading";
            })
            .addCase(register.fulfilled, (state) => {
                state.isAuthenticated = true;
                state.status = "succeeded";
                state.error = null;
                // User state is already handled in the thunk
            })
            .addCase(register.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            // Fetch User Info Actions
            .addCase(fetchUserInfo.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchUserInfo.fulfilled, (state) => {
                state.isAuthenticated = true;
                state.status = "succeeded";
                state.error = null;
                // User state is already handled in the thunk
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.status = "failed";
                state.error = action.error.message;
                // User state is already handled in the thunk
            });
    },
});

export default authSlice.reducer;
