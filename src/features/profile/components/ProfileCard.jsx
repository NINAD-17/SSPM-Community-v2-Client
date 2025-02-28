import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { academicYearCalc } from "../../../utils/academicYear";
import defaultAvatar from "../../../assets/user.png";
import { toggleFollowButton } from "../../userNetwork/userNetworkSlice";
import { sendConnectionRequest, removeConnection } from "../../userNetwork/services/userNetworkService";
import { toast } from "sonner";

const ProfileCard = ({ userId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loggedInUser = useSelector((state) => state.user.user);
    const profile = useSelector((state) => state.profile.profile);
    const profileStatus = useSelector((state) => state.profile.status);

    const handleFollowToggle = async () => {
        try {
            await dispatch(toggleFollowButton(userId)).unwrap();
            toast.success(profile.isFollowing ? "Unfollowed successfully" : "Followed successfully");
        } catch (error) {
            toast.error("Failed to update follow status");
        }
    };

    const handleConnectionAction = async () => {
        try {
            if (!profile.connectionStatus) {
                // Send new connection request
                await sendConnectionRequest(userId);
                toast.success("Connection request sent!");
            } else if (profile.connectionStatus.status === "pending") {
                if (profile.connectionStatus.initiatedByMe) {
                    // Cancel sent request
                    await removeConnection(profile.connectionStatus.connectionId);
                    toast.success("Connection request cancelled");
                } else {
                    // Accept received request
                    await acceptConnectionRequest(profile.connectionStatus.connectionId);
                    toast.success("Connection request accepted");
                }
            } else if (profile.connectionStatus.status === "accepted") {
                // Remove connection
                await removeConnection(profile.connectionStatus.connectionId);
                toast.success("Connection removed");
            }
        } catch (error) {
            toast.error("Failed to update connection");
        }
    };

    const getConnectionButtonText = () => {
        if (!profile.connectionStatus) return "Connect";
        
        switch (profile.connectionStatus.status) {
            case "pending":
                return profile.connectionStatus.initiatedByMe ? "Cancel Request" : "Accept Request";
            case "accepted":
                return "Remove Connection";
            default:
                return "Connect";
        }
    };

    const user = userId === loggedInUser?._id ? loggedInUser : profile;
    console.log("pp: ", profile);

    if (!user) {
        return (
            <div className="bg-white shadow rounded-xl p-6 pb-3 animate-pulse">
                <div className="h-24 w-24 sm:h-20 sm:w-20 rounded-full mx-auto bg-gray-200" />
                <div className="h-6 w-32 bg-gray-200 mx-auto mt-2 rounded" />
                <div className="h-4 w-24 bg-gray-200 mx-auto mt-2 rounded" />
            </div>
        );
    }

    const {
        firstName,
        lastName,
        headline,
        avatar, // Changed from picturePath to match our current state
        status,
        branch,
        role,
        isAlumni,
        graduationYear,
        isFollowing,
        connectionStatus
    } = user;

    return (
        <div className="bg-white shadow rounded-xl p-6 pb-3">
            <img
                src={avatar || defaultAvatar}
                alt="Profile"
                className="h-24 w-24 sm:h-20 sm:w-20 rounded-full mx-auto object-cover border border-gray-400"
            />
            <h2
                className="text-xl font-semibold mt-2 text-center hover:underline sm:text-lg lg:text-xl cursor-pointer"
                onClick={() => navigate(`/user/profile/${userId}`)}
            >
                {`${firstName} ${lastName}`}
            </h2>
            <p className="text-md text-center text-gray-600 sm:text-sm lg:text-base">
                {headline}
            </p>
            <hr className="border-blue-400 my-2" />
            <div className="text-base sm:text-sm lg:text-base space-y-0">
                <div className="flex justify-between">
                    <p className="text-gray-700">Status </p>
                    <p className="font-semibold text-gray-700">{ role === "student" && isAlumni ? "Alumni": "Student"}</p>
                </div>
                {status === "Student" && (
                    <div className="flex justify-between">
                        <p className="text-gray-700">Currently In </p>
                        <p className="font-semibold text-gray-700">
                            {academicYearCalc(graduationYear)} Year
                        </p>
                    </div>
                )}
                <div className="flex justify-between flex-wrap">
                    <p className="text-gray-700">Branch </p>
                    <p className="font-semibold text-gray-700">{branch}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-gray-700">Graduation Year </p>
                    <p className="font-semibold text-gray-700">{graduationYear}</p>
                </div>
            </div>
            <hr className="border-blue-400 my-2" />
            {user.socialHandles?.length > 0 && (
                <>
                    <div className="text-base sm:text-sm lg:text-base">
                        <h3 className="font-semibold text-gray-900">
                            Social Profiles
                        </h3>
                        <ul>
                            {user.socialHandles.map((handle) => (
                                <li key={handle.url}>
                                    <a
                                        className="cursor-pointer hover:underline text-gray-700 hover:text-blue-400"
                                        href={handle.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {handle.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <hr className="border-blue-400 my-2" />
                </>
            )}

            {userId === loggedInUser?._id ? (
                <div
                    className="flex justify-center items-center text-blue-700 hover:text-blue-400"
                    onClick={() => navigate(`/user/edit`)}
                >
                    <p className="text-center text-sm cursor-pointer">
                        Edit Profile{" "}
                    </p>
                    <span className="material-symbols-outlined text-base ml-1 cursor-pointer">
                        edit
                    </span>
                </div>
            ) : (
                <div className="flex flex-col gap-2 mt-4">
                    <button
                        onClick={handleFollowToggle}
                        className={`w-full p-2 rounded-xl text-white transition-colors ${
                            profile.isFollowing 
                                ? 'bg-gray-600 hover:bg-gray-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {profile.isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                    
                    <button
                        onClick={handleConnectionAction}
                        className={`w-full p-2 rounded-xl transition-colors ${
                            profile.connectionStatus?.status === 'accepted'
                                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                : profile.connectionStatus?.status === 'pending'
                                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                        {getConnectionButtonText()}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileCard;
