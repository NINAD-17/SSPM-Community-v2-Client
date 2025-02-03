import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "../features/userNetwork/components/UserCard";
import Layout from "../components/layout/Layout";
import { 
    loadConnections, 
    loadFollowers, 
    loadFollowings,
    loadPendingConnections,
    selectConnections,
    selectFollowers,
    selectFollowings,
    selectPendingConnections
} from "../features/userNetwork/userNetworkSlice";

const UserNetwork = () => {
    const dispatch = useDispatch();
    const [selectedCategory, setSelectedCategory] = useState("Connections");
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const connections = useSelector(selectConnections);
    const followers = useSelector(selectFollowers);
    const followings = useSelector(selectFollowings);
    const pendingRequests = useSelector(selectPendingConnections);

    const user = useSelector(state => state.user.user);

    useEffect(() => {
        if (user?._id) {
            dispatch(loadConnections(user._id));
            dispatch(loadFollowers(user._id));
            dispatch(loadFollowings(user._id));
            dispatch(loadPendingConnections());
        }
    }, [dispatch, user?._id]);

    const categories = [
        { 
            name: "Connections", 
            icon: "👥", 
            count: connections.data.length,
            status: connections.status 
        },
        { 
            name: "Followers", 
            icon: "👤", 
            count: followers.data.length,
            status: followers.status 
        },
        { 
            name: "Following", 
            icon: "👣", 
            count: followings.data.length,
            status: followings.status 
        },
        { 
            name: "Pending Requests", 
            icon: "📨", 
            count: pendingRequests.data.length,
            status: pendingRequests.status 
        },
    ];

    const getCategoryData = () => {
        switch (selectedCategory) {
            case "Connections":
                return connections;
            case "Followers":
                return followers;
            case "Following":
                return followings;
            case "Pending Requests":
                return pendingRequests;
            default:
                return { data: [], status: 'idle', error: null };
        }
    };

    const currentCategory = getCategoryData();
    const filteredUsers = Array.isArray(currentCategory?.data) 
        ? currentCategory.data.filter(user => 
            user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user?.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user?.currentlyWorkingAt?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setIsOpen(false);
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Categories Sidebar */}
                    <div className="md:w-72">
                        <div className="bg-white rounded-xl shadow-md">
                            <div className="p-4 border-b border-gray-200">
                                <h1 className="text-xl font-bold text-gray-800">
                                    Manage my network
                                </h1>
                            </div>
                            <div className="md:hidden p-4">
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="w-full flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                                >
                                    <span>{selectedCategory}</span>
                                    <span className="material-symbols-outlined">
                                        {isOpen ? "expand_less" : "expand_more"}
                                    </span>
                                </button>
                            </div>
                            <div
                                className={`${
                                    isOpen ? "block" : "hidden"
                                } md:block`}
                            >
                                {categories.map((category) => (
                                    <button
                                        key={category.name}
                                        onClick={() =>
                                            handleCategoryClick(category.name)
                                        }
                                        className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 ${
                                            selectedCategory === category.name
                                                ? "bg-blue-50 border-l-4 border-blue-500"
                                                : ""
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">
                                                {category.icon}
                                            </span>
                                            <span className="font-medium text-gray-700">
                                                {category.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {category.status === "loading" ? (
                                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                                                    {category.count}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* User List */}
                    <div className="flex-1 md:max-w-[calc(100%-300px)]">
                        <div className="bg-white rounded-xl shadow-md p-6 pt-2">
                            <div className="md:flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {selectedCategory}
                                </h2>
                                <div className="relative mt-3">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <svg
                                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {currentCategory.status === "loading" ? (
                                    <div className="flex justify-center py-8">
                                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : currentCategory.error ? (
                                    <div className="text-center py-8 text-red-500">
                                        {currentCategory.error}
                                    </div>
                                ) : filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <UserCard
                                            key={user._id}
                                            user={user}
                                            type={selectedCategory}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No {selectedCategory.toLowerCase()}{" "}
                                        found
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UserNetwork;
