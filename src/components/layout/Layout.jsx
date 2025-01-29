import { useSelector } from 'react-redux';
import Navbar from './Navbar';

const Layout = ({ children, showNavbar = true }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {showNavbar && <Navbar />}
            <main className="container mx-auto px-4">
                {children}
            </main>
        </div>
    );
};

export default Layout; 