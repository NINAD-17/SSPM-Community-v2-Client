import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const { isAuthenticated, status } = useSelector((state) => state.auth);
    const location = useLocation();

    // Show loading while checking authentication
    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-800"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        // Redirect to the page they came from or home
        const from = location.state?.from?.pathname || '/home';
        return <Navigate to={from} replace />;
    }

    return children;
};

export default PublicRoute; 