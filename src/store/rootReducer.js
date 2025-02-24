import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import authReducer from "../features/auth/authSlice";
import profileReducer from "../features/profile/profileSlice";
import userNetworkReducer from "../features/userNetwork/userNetworkSlice";
import postsReducer from "../features/posts/postsSlice";
import groupsReducer from "../features/groups/groupsSlice"
import opportunityReducer from '../features/opportunities/opportunitySlice';
import likesReducer from '../features/interactions/likesSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    profile: profileReducer,
    userNetwork: userNetworkReducer,
    posts: postsReducer,
    groups: groupsReducer,
    opportunities: opportunityReducer,
    likes: likesReducer,
});

export default rootReducer;
