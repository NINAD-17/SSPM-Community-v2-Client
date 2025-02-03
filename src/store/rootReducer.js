import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import authReducer from "../features/auth/authSlice";
import profileReducer from "../features/profile/profileSlice";
import userNetworkReducer from "../features/userNetwork/userNetworkSlice";
import postsReducer from "../features/posts/postsSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    profile: profileReducer,
    userNetwork: userNetworkReducer,
    posts: postsReducer,
});

export default rootReducer;
