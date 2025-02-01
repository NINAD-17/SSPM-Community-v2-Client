import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    initiateRegistration,
    verifyRegistrationOTP,
    completeRegistration,
    initiateLogin,
    verifyLoginOTP,
    verifyAndFetchTokenUser,
    logoutUser,
} from "./services/authService";
import { setUser, clearUser } from "../user/userSlice";

// Initial State
const initialState = {
    isAuthenticated: false,
    fetchStatus: "idle", // For initial auth check
    actionStatus: "idle", // For login/register actions
    registrationStep: 'email', // email, otp, form
    loginStep: 'credentials', // credentials, otp
    verifiedEmail: null,
    error: null,
};

// Async Actions
export const registerInit = createAsyncThunk(
    "auth/registerInit",
    async(email, { rejectWithValue}) => {
        try {
            const response = await initiateRegistration(email);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Initiation Failed")
        }
    }
)

export const registerVerifyOTP = createAsyncThunk(
    "auth/registerVerifyOTP",
    async (otpData, { rejectWithValue }) => {
        try {
            const response = await verifyRegistrationOTP(otpData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Verification Failed")
        }
    });

export const registerComplete = createAsyncThunk(
    "auth/registerComplete",
    async (userData, { dispatch, rejectWithValue }) => {
        try {
            const response = await completeRegistration(userData);
            dispatch(setUser(response.data.user));
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Registration failed"
            );
        }
    }
);

export const loginInit = createAsyncThunk(
    "auth/loginInit",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await initiateLogin(credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Login initiation failed');
        }
    }
);

export const loginVerifyOTP = createAsyncThunk(
    "auth/loginVerifyOTP",
    async (otpData, { dispatch, rejectWithValue }) => {
        try {
            const response = await verifyLoginOTP(otpData);
            dispatch(setUser(response.data.user));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'OTP verification failed');
        }
    }
);

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            await logoutUser();
            dispatch(clearUser());
            return;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Logout failed');
        }
    }
);

export const fetchUserInfo = createAsyncThunk(
    "auth/fetchUserInfo",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await verifyAndFetchTokenUser();
            dispatch(setUser(response.data.user));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch user info');
        }
    }
);

// Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuth: (state) => {
            state.registrationStep = 'email';
            state.loginStep = 'credentials';
            state.verifiedEmail = null;
            state.error = null;
            state.actionStatus = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            // Registration Flow
            .addCase(registerInit.pending, (state) => {
                state.actionStatus = "loading";
                state.error = null;
            })
            .addCase(registerInit.fulfilled, (state, action) => {
                state.actionStatus = "succeeded";
                state.registrationStep = 'otp';
                state.verifiedEmail = action.payload.email;
                state.error = null;
            })
            .addCase(registerInit.rejected, (state, action) => {
                state.actionStatus = "failed";
                state.error = action.payload || action.error.message;
            })
            // Registration OTP Verification
            .addCase(registerVerifyOTP.pending, (state) => {
                state.actionStatus = "loading";
                state.error = null;
            })
            .addCase(registerVerifyOTP.fulfilled, (state) => {
                state.actionStatus = "succeeded";
                state.registrationStep = 'form';
                state.error = null;
            })
            .addCase(registerVerifyOTP.rejected, (state, action) => {
                state.actionStatus = "failed";
                state.error = action.payload || action.error.message;
            })
            // Registration Completion
            .addCase(registerComplete.pending, (state) => {
                state.actionStatus = "loading";
                state.error = null;
            })
            .addCase(registerComplete.fulfilled, (state) => {
                state.actionStatus = "succeeded";
                state.isAuthenticated = true;
                state.registrationStep = 'email'; // Reset
                state.verifiedEmail = null;
                state.error = null;
            })
            .addCase(registerComplete.rejected, (state, action) => {
                state.actionStatus = "failed";
                state.error = action.payload || action.error.message;
            })
            // Login Flow
            .addCase(loginInit.pending, (state) => {
                state.actionStatus = "loading";
                state.error = null;
            })
            .addCase(loginInit.fulfilled, (state, action) => {
                state.actionStatus = "succeeded";
                state.loginStep = 'otp';
                state.verifiedEmail = action.payload.email;
                state.error = null;
            })
            .addCase(loginInit.rejected, (state, action) => {
                state.actionStatus = "failed";
                state.error = action.payload || action.error.message;
            })
            // Login OTP Verification
            .addCase(loginVerifyOTP.pending, (state) => {
                state.actionStatus = "loading";
                state.error = null;
            })
            .addCase(loginVerifyOTP.fulfilled, (state) => {
                state.isAuthenticated = true;
                state.actionStatus = "succeeded";
                state.error = null;
                state.step = 0; // Reset step after successful login
            })
            .addCase(loginVerifyOTP.rejected, (state, action) => {
                state.actionStatus = "failed";
                state.error = action.payload || action.error.message;
            })
            // Fetch User Info
            .addCase(fetchUserInfo.pending, (state) => {
                state.fetchStatus = "loading";
            })
            .addCase(fetchUserInfo.fulfilled, (state) => {
                state.isAuthenticated = true;
                state.fetchStatus = "succeeded";
                state.error = null;
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.error = action.error.message;
            });
    },
});

export default authSlice.reducer;
