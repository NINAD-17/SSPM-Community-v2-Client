import { useSelector } from 'react-redux';
import Navbar from './Navbar';

const Layout = ({ children, showNavbar = true }) => {
    return (
        <div className="min-h-screen bg-blue-50">
            {showNavbar && <Navbar />}
            <main className="mt-16 bg-blue-50">
                {children}
            </main>
        </div>
    );
};

export default Layout; 