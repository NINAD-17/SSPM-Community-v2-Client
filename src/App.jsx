import "./App.css";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "./features/auth/authSlice";
import { refreshAccessToken } from "./features/auth/services/authService";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";
import { Toaster } from 'sonner';

function App() {
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.auth);

    // Memoize checkAuthentication to prevent recreation on every render
    const checkAuthentication = useCallback(async () => {
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
                    console.error("Authentication failed", refreshError);
                }
            }
        }
    }, [dispatch]); // dispatch is stable and won't cause infinite loops

    useEffect(() => {
        checkAuthentication();
    }, [checkAuthentication]); // Now checkAuthentication is memoized and safe to use in deps

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-800"></div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" richColors />
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route 
                        path="/login" 
                        element={
                            <PublicRoute>
                                <LoginPage />
                            </PublicRoute>
                        } 
                    />
                    <Route 
                        path="/register" 
                        element={
                            <PublicRoute>
                                <RegisterPage />
                            </PublicRoute>
                        } 
                    />

                    {/* Protected Routes */}
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
