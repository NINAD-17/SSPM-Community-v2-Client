import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, fetchStatus } = useSelector((state) => state.auth);
    const location = useLocation();

    // Only show loading on initial auth check
    if (fetchStatus === "loading" && fetchStatus !== "failed") {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-800"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login but save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute; 