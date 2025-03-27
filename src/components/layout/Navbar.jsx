import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import defaultAvatar from "../../assets/user.png";

function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef(null);
    const { user } = useSelector((state) => state.user);

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    // Focus search input when opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search functionality
        console.log("Searching for:", searchQuery);
        // Reset search on mobile after search
        if (window.innerWidth < 768) {
            setIsSearchOpen(false);
            setSearchQuery("");
        }
    };

    // Close search on cancel
    const handleSearchCancel = () => {
        setIsSearchOpen(false);
        setSearchQuery("");
    };

    const SearchInput = ({ showLabel = true }) => (
        <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
                <input
                    ref={isSearchOpen ? searchInputRef : null}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full py-2 pl-10 pr-4 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 material-symbols-outlined">
                    search
                </span>
                {isSearchOpen && (
                    <button
                        type="button"
                        onClick={handleSearchCancel}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                )}
            </div>
            {showLabel && (
                <label className="text-xs text-gray-500 mt-1 block text-center">
                    {isSearchOpen && "Press Enter to search"}
                </label>
            )}
        </form>
    );

    const isPathActive = (path) => {
        if (path === '/home') {
            return location.pathname === '/home';
        }
        return location.pathname.startsWith(path);
    };

    const NavigationItem = ({ icon, label, path, isActive }) => (
        <li 
            onClick={() => navigate(path)}
            className={`cursor-pointer flex flex-col items-center transition-colors ${
                isActive ? 'text-blue-600' : 'text-blue-800 hover:text-blue-400'
            }`}
        >
            <span className="material-symbols-outlined">{icon}</span>
            <h3 className="text-xs xl:text-sm mt-0.5">{label}</h3>
        </li>
    );

    return (
        <nav className="fixed top-0 z-[49] w-full bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                {/* Left Section */}
                <div className="flex items-center gap-4 flex-1 md:flex-initial">
                    {!isSearchOpen && (
                        <div
                            className="font-bold text-2xl md:text-3xl cursor-pointer text-blue-600"
                            onClick={() => navigate("/home")}
                        >
                            SSPM COMMUNITY
                        </div>
                    )}
                </div>

                {/* Desktop Search */}
                <div className="hidden md:block flex-1 max-w-xl px-4">
                    <SearchInput showLabel={false} />
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Mobile Search Button */}
                    {!isSearchOpen && (
                        <button
                            className="md:hidden text-blue-800 hover:text-blue-400 flex flex-col items-center"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <span className="material-symbols-outlined">search</span>
                            <h3 className="text-xs mt-0.5">Search</h3>
                        </button>
                    )}

                    {/* Mobile Search Input */}
                    {isSearchOpen && (
                        <div className="absolute inset-x-0 top-0 bg-white p-3 md:hidden z-[110]">
                            <SearchInput />
                        </div>
                    )}

                    {/* Desktop Navigation */}
                    <ul className="hidden sm:flex items-center space-x-6">
                        <NavigationItem 
                            icon="home" 
                            label="Home"
                            path="/home"
                            isActive={isPathActive('/home')}
                        />
                        <NavigationItem 
                            icon="group" 
                            label="Groups"
                            path="/groups"
                            isActive={isPathActive('/groups')}
                        />
                        <NavigationItem 
                            icon="chat" 
                            label="Messages"
                            path="/messages"
                            isActive={isPathActive('/messages')}
                        />
                        <NavigationItem 
                            icon="work" 
                            label="Jobs"
                            path="/opportunities"
                            isActive={isPathActive('/opportunities')}
                        />
                        <NavigationItem 
                            icon="notifications" 
                            label="Alerts"
                            path="/notifications"
                            isActive={isPathActive('/notifications')}
                        />
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger className="outline-none">
                                <div className="flex flex-col items-center text-blue-800 hover:text-blue-400 cursor-pointer">
                                    <img
                                        src={user?.avatar || defaultAvatar}
                                        alt="Profile"
                                        className="h-6 w-6 rounded-full object-cover border border-blue-200 hover:border-blue-400"
                                    />
                                    <h3 className="text-xs xl:text-sm mt-0.5">Profile</h3>
                                </div>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                                <DropdownMenu.Content className="bg-white rounded-lg shadow-lg py-1 mt-2 w-48">
                                    <DropdownMenu.Item className="outline-none">
                                        <button
                                            onClick={() => navigate(`/user/profile/${user?._id}`)}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                                        >
                                            View Profile
                                        </button>
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item className="outline-none">
                                        <button
                                            onClick={() => navigate("/user/network")}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                                        >
                                            My Network
                                        </button>
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Separator className="my-1 border-t border-gray-200" />
                                    <DropdownMenu.Item className="outline-none">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                                        >
                                            Log Out
                                        </button>
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                    </ul>

                    {/* Mobile Menu */}
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger className="sm:hidden ml-3 text-blue-800 hover:text-blue-400 flex flex-col items-center cursor-pointer">
                            <span className="material-symbols-outlined text-blue-800 hover:text-blue-400">
                                menu
                            </span>
                            <h3 className="text-xs">Menu</h3>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content className="bg-white rounded-lg shadow-lg py-1 mt-2 w-56 mr-4">
                                <div className="px-4 py-2 border-b border-gray-200">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={user?.avatar || defaultAvatar}
                                            alt=""
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {user?.firstName} {user?.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {user?.headline || "No headline"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <DropdownMenu.Item className="outline-none">
                                    <button
                                        onClick={() => navigate("/home")}
                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 flex items-center"
                                    >
                                        <span className="material-symbols-outlined mr-3">home</span>
                                        Home
                                    </button>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="outline-none">
                                    <button
                                        onClick={() => navigate(`/user/profile/${user?._id}`)}
                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 flex items-center"
                                    >
                                        <span className="material-symbols-outlined mr-3">person</span>
                                        View Profile
                                    </button>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="outline-none">
                                    <button
                                        onClick={() => navigate("/user/network")}
                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 flex items-center"
                                    >
                                        <span className="material-symbols-outlined mr-3">group</span>
                                        My Network
                                    </button>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="outline-none">
                                    <button
                                        onClick={() => navigate("/groups")}
                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 flex items-center"
                                    >
                                        <span className="material-symbols-outlined mr-3">groups</span>
                                        Groups
                                    </button>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="outline-none">
                                    <button
                                        onClick={() => navigate("/messages")}
                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 flex items-center"
                                    >
                                        <span className="material-symbols-outlined mr-3">chat</span>
                                        Messages
                                    </button>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="outline-none">
                                    <button
                                        onClick={() => navigate("/notifications")}
                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 flex items-center"
                                    >
                                        <span className="material-symbols-outlined mr-3">notifications</span>
                                        Notifications
                                    </button>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="outline-none">
                                    <button
                                        onClick={() => navigate("/opportunities")}
                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 flex items-center"
                                    >
                                        <span className="material-symbols-outlined mr-3">work</span>
                                        Opportunities
                                    </button>
                                </DropdownMenu.Item>
                                <DropdownMenu.Separator className="my-1 border-t border-gray-200" />
                                <DropdownMenu.Item className="outline-none">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center"
                                    >
                                        <span className="material-symbols-outlined mr-3">logout</span>
                                        Log Out
                                    </button>
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;