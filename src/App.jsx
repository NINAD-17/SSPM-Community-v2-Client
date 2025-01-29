import "./App.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUserInfo } from "./features/auth/authSlice";
import { refreshAccessToken } from "./features/auth/services/authService";

function App() {
    const dispatch = useDispatch();

    const checkAuthentication = async() => {
        try {
            // Try to fetch user info with current access token
            await dispatch(fetchUserInfo()).unwrap();
        } catch (error) {
            // Handle token expiration
            if (error?.response?.data?.expired) {
                try {
                    // Try to refresh the access token
                    await refreshAccessToken();
                    console.log("Access token refreshed");
                    
                    // If successful, try fetching user info again
                    await dispatch(fetchUserInfo()).unwrap();
                } catch (refreshError) {
                    // If refresh fails, user needs to login again
                    console.log("Authentication failed, please login again", refreshError);
                }
            }
        }
    }

    useEffect(() => {
        checkAuthentication();
    }, []);

    return (
        <>
            
        </>
    );
}

export default App;
