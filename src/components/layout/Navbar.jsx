import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";

function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isProfileHover, setProfileHover] = useState(false);
    const [isProfileClicked, setIsProfileClicked] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { user } = useSelector((state) => state.user);
    const { status } = useSelector((state) => state.auth);

    // For debugging
    useEffect(() => {
        console.log('Current user:', user);
        console.log('Auth status:', status);
    }, [user, status]);

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();

            toast.success("Logged out successfully");

            navigate("/login");
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isProfileClicked && !event.target.closest('.profile-menu')) {
                setIsProfileClicked(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isProfileClicked]);

    // Close the dropdown on screen resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 640) {
                setIsProfileClicked(false);
                setIsSearchOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <nav className="fixed top-0 z-10 bg-white w-full h-16 flex justify-between items-center p-6 border-b border-blue-200">
            <div className="left flex items-center">
                {isSearchOpen ? (
                    <input
                        className="p-2 rounded-2xl border border-blue-400 focus:outline-blue-600 sm:hidden"
                        type="text"
                        placeholder="Search"
                    />
                ) : (
                    <div
                        className="logo font-bold text-2xl md:text-3xl cursor-pointer text-blue-600"
                        onClick={() => navigate("/home")}
                    >
                        SSPM COMMUNITY
                    </div>
                )}
                <div className="hidden md:block ml-3">
                    <form action="">
                        <input
                            className="p-2 rounded-2xl border border-blue-400 focus:outline-blue-600"
                            type="text"
                            placeholder="Search"
                        />
                    </form>
                </div>
            </div>
            <div className="right flex items-center">
                <ul className="hidden sm:flex space-x-4 text-lg text-blue-800">
                    <li className="cursor-pointer flex flex-col items-center hover:text-blue-400">
                        <span className="material-symbols-outlined">
                            notifications
                        </span>
                        <h3 className="text-xs xl:text-sm mt-0.5">
                            Notifications
                        </h3>
                    </li>
                    <li className="cursor-pointer flex flex-col items-center hover:text-blue-400">
                        <span className="material-symbols-outlined">work</span>
                        <h3 className="text-xs xl:text-sm mt-0.5">
                            Opportunities
                        </h3>
                    </li>
                    <li
                        className="cursor-pointer flex flex-col items-center overflow-hidden"
                        onMouseEnter={() => setProfileHover(true)}
                        onMouseLeave={() => setProfileHover(false)}
                        onClick={() => setIsProfileClicked(!isProfileClicked)}
                    >
                        {isProfileClicked ? (
                            <>
                                <div className="flex flex-col items-center justify-center ml-2">
                                    <span className="material-symbols-outlined text-2xl h-6 hover:text-blue-400">
                                        close
                                    </span>
                                    <h3 className="text-xs xl:text-sm mt-0.5 hover:text-blue-400">
                                        Close
                                    </h3>
                                </div>
                                <div className="absolute bg-white border-blue-200 border w-56 top-16 right-1 rounded-md px-4 shadow-lg">
                                    <h2 className="text-center font-semibold mt-2">{`${user.firstName} ${user.lastName}`}</h2>
                                    <button
                                        className="w-full bg-blue-400 text-sm py-2 font-semibold rounded-xl mt-3 mb-3 text-white hover:bg-red-500"
                                        onClick={handleLogout}
                                    >
                                        Log Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <img
                                    className={`h-6 w-6 rounded-full border object-cover ${isProfileHover ? "border-blue-500" : ""}`}
                                    src={`${user !== null && user.avatar ? user.avatar : "../../assets/user.png"}`}
                                    alt=""
                                />
                                <h3 className="text-xs xl:text-sm mt-0.5 hover:text-blue-400">
                                    Profile
                                </h3>
                            </>
                        )}
                    </li>
                </ul>
                <div className="sm:hidden flex items-center">
                    <span
                        className="material-symbols-outlined cursor-pointer text-blue-800 hover:text-blue-400 text-xl mr-4"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                        search
                    </span>
                    <RadixDropdown.Root>
                        <RadixDropdown.Trigger className="cursor-pointer">
                            <span className="material-symbols-outlined text-blue-800 hover:text-blue-400 text-xl">
                                menu
                            </span>
                        </RadixDropdown.Trigger>
                        <RadixDropdown.Content className="p-2 bg-white rounded shadow-lg">
                            <RadixDropdown.Item
                                className="p-2 text-blue-800 hover:bg-blue-100 flex items-center cursor-pointer"
                                onClick={() => navigate("/home")}
                            >
                                <span className="material-symbols-outlined mr-2">
                                    home
                                </span>{" "}
                                Home
                            </RadixDropdown.Item>
                            <RadixDropdown.Item className="p-2 text-blue-800 hover:bg-blue-100 flex items-center cursor-pointer">
                                <span className="material-symbols-outlined mr-2">
                                    notifications
                                </span>{" "}
                                Notifications
                            </RadixDropdown.Item>
                            <RadixDropdown.Item className="p-2 text-blue-800 hover:bg-blue-100 flex items-center cursor-pointer">
                                <span className="material-symbols-outlined mr-2">
                                    work
                                </span>{" "}
                                Opportunities
                            </RadixDropdown.Item>
                            <RadixDropdown.Item
                                className="p-2 text-blue-800 hover:bg-blue-100 flex items-center cursor-pointer"
                                onClick={() =>
                                    setIsProfileClicked(!isProfileClicked)
                                }
                            >
                                <span className="material-symbols-outlined mr-2">
                                    account_circle
                                </span>{" "}
                                Profile
                            </RadixDropdown.Item>
                            <RadixDropdown.Separator className="my-1 border-t border-gray-200" />
                            <RadixDropdown.Item
                                className="p-2 text-blue-800 hover:bg-blue-100 flex items-center cursor-pointer"
                                onClick={handleLogout}
                            >
                                <span className="material-symbols-outlined mr-2">
                                    logout
                                </span>{" "}
                                Log Out
                            </RadixDropdown.Item>
                        </RadixDropdown.Content>
                    </RadixDropdown.Root>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
