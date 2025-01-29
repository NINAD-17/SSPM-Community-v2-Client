import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import authReducer from "../features/auth/authSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
});

export default rootReducer;
