import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import defaultAvatar from "../../../assets/user.png";
import {
    acceptConnectionRequest,
    rejectConnectionRequest,
    removeUserConnection,
    toggleFollowButton,
    removeUserFollower,
} from "../userNetworkSlice";

const UserCard = ({ userData, type, dispatch, currentUserId }) => {
    console.log(`${type} userData:`, userData);

    // Normalize the user data based on the structure
    const getUserData = () => {
        switch (type) {
            case "Connections":
                return userData.user || userData;
            case "Pending Requests":
                return userData.user || userData.requester || userData;
            case "Invitations Sent":
                return userData.user || userData.recipient || userData;
            case "Followers":
                return userData
            case "Following":
                return userData
            default:
                return userData;
        }
    };

    const user = getUserData();
    console.log({ user });
    const connectionId = userData._id;
    const userId = user?._id;

    // If user data is incomplete, show a placeholder
    if (!user || !userId) {
        console.error("Invalid user data:", userData, "type:", type);
        return (
            <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 bg-white">
                <div className="text-gray-500">Invalid user data</div>
            </div>
        );
    }

    // Check if user is the current user
    const isCurrentUser = userId === currentUserId;

    // Action handlers
    const handleAcceptRequest = () => {
        dispatch(acceptConnectionRequest(connectionId))
            .unwrap()
            .then(() => {
                toast.success("Connection request accepted");
            })
            .catch((error) => {
                console.error("Accept request error:", error);
                toast.error("Failed to accept connection request");
            });
    };

    const handleRejectRequest = () => {
        dispatch(rejectConnectionRequest(connectionId))
            .unwrap()
            .then(() => {
                toast.success("Connection request rejected");
            })
            .catch((error) => {
                console.error("Reject request error:", error);
                toast.error("Failed to reject connection request");
            });
    };

    const handleRemoveConnection = () => {
        dispatch(removeUserConnection(connectionId))
            .unwrap()
            .then(() => {
                toast.success("Connection removed");
            })
            .catch((error) => {
                console.error("Remove connection error:", error);
                toast.error("Failed to remove connection");
            });
    };

    const handleToggleFollow = () => {
        dispatch(toggleFollowButton(user._id))
            .unwrap()
            .then((result) => {
                toast.success(
                    result.isFollowing
                        ? "Followed successfully"
                        : "Unfollowed successfully"
                );
            })
            .catch((error) => {
                console.error("Toggle follow error:", error);
                toast.error("Failed to update follow status");
            });
    };

    const handleRemoveFollower = () => {
      console.log("r_follower: ", {user})
      console.log("r_follower: ", {userData})
        dispatch(removeUserFollower(userData._id))
            .unwrap()
            .then(() => {
                toast.success("Follower removed");
            })
            .catch((error) => {
                console.error("Remove follower error:", error);
                toast.error("Failed to remove follower");
            });
    };

    const handleCancelInvitation = () => {
        dispatch(rejectConnectionRequest(connectionId))
            .unwrap()
            .then(() => {
                toast.success("Invitation cancelled");
            })
            .catch((error) => {
                console.error("Cancel invitation error:", error);
                toast.error("Failed to cancel invitation");
            });
    };

    return (
        <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors">
            <Link to={`/user/profile/${userId}`} className="flex-shrink-0">
                <img
                    src={user.avatar || defaultAvatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-14 h-14 rounded-full object-cover"
                />
            </Link>

            <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                        <Link
                            to={`/user/profile/${userId}`}
                            className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                            {user.firstName} {user.lastName}
                        </Link>
                        <p className="text-sm text-gray-500 truncate mt-1">
                            {user.headline ||
                                user.currentlyWorkingAt ||
                                "SSPM Community Member"}
                        </p>
                    </div>

                    <div className="mt-2 sm:mt-0 flex flex-wrap gap-2">
                        {type === "Pending Requests" && (
                            <>
                                <button
                                    onClick={handleAcceptRequest}
                                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={handleRejectRequest}
                                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-md transition-colors"
                                >
                                    Ignore
                                </button>
                            </>
                        )}

                        {type === "Invitations Sent" && (
                            <button
                                onClick={handleCancelInvitation}
                                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                        )}

                        {type === "Connections" && !isCurrentUser && (
                            <button
                                onClick={handleRemoveConnection}
                                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-md transition-colors"
                            >
                                Remove
                            </button>
                        )}

                        {type === "Followers" && !isCurrentUser && (
                            <button
                                onClick={handleRemoveFollower}
                                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-md transition-colors"
                            >
                                Remove
                            </button>
                        )}

                        {type === "Following" && !isCurrentUser && (
                            <button
                                onClick={handleToggleFollow}
                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors"
                            >
                                Unfollow
                            </button>
                        )}

                        {!isCurrentUser && type !== "Invitations Sent" && (
                            <Link
                                to={`/messages?user=${userId}`}
                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors inline-flex items-center"
                            >
                                <span className="material-symbols-outlined text-sm mr-1">
                                    chat
                                </span>
                                Message
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

UserCard.propTypes = {
    userData: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    currentUserId: PropTypes.string,
};

export default UserCard;
