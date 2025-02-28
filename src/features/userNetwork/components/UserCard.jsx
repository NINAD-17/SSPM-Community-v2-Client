import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { 
    acceptConnectionRequestButton, 
    rejectConnectionRequestButton,
    removeFollowerButton,
    toggleFollowButton,
    removeConnectionButton 
} from '../userNetworkSlice';
import Avatar from "../../../assets/user.png";
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user, type }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Extract user info based on type
    const userInfo = type === "Connections" || type === "Pending Requests" 
        ? user.recipient || user.requester // Handle both sent and received requests
        : user;

    const connectionId = user._id; // For connection/request actions

    const handleAction = async (actionType) => {
        setIsLoading(true);
        try {
            switch (actionType) {
                case 'accept':
                    await dispatch(acceptConnectionRequestButton(connectionId)).unwrap();
                    toast.success('Connection request accepted');
                    break;
                case 'reject':
                    await dispatch(rejectConnectionRequestButton(connectionId)).unwrap();
                    toast.success('Connection request rejected');
                    break;
                case 'unfollow':
                    await dispatch(toggleFollowButton(userInfo._id)).unwrap();
                    toast.success(type === "Followers" ? 'Follower removed' : 'User unfollowed');
                    break;
                case 'remove':
                    if (type === 'Followers') {
                        await dispatch(removeFollowerButton(userInfo._id)).unwrap();
                    } else {
                        await dispatch(removeConnectionButton(connectionId)).unwrap();
                    }
                    toast.success(`${type === 'Followers' ? 'Follower' : 'Connection'} removed`);
                    break;
                default:
                    break;
            }
        } catch (error) {
            toast.error(error.message || 'Action failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
            <div 
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => navigate(`/user/profile/${userInfo._id}`)}
            >
                <img
                    src={userInfo.avatar || Avatar}
                    alt={userInfo.firstName}
                    className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                    <h3 className="font-semibold text-gray-800 hover:text-blue-600">
                        {userInfo.firstName} {userInfo.lastName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                        {userInfo.headline || `${userInfo.role} at ${userInfo.branch}`}
                    </p>
                    {userInfo.currentlyWorkingAt && (
                        <p className="text-gray-500 text-sm">
                            {userInfo.currentlyWorkingAt}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex gap-2 mt-4 sm:mt-0">
                {type === "Pending Requests" && (
                    <>
                        <button 
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                            onClick={() => handleAction('accept')}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Accept'}
                        </button>
                        <button 
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100"
                            onClick={() => handleAction('reject')}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Ignore'}
                        </button>
                    </>
                )}
                {(type === "Followers" || type === "Following") && (
                    <button 
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100"
                        onClick={() => handleAction('unfollow')}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : type === "Followers" ? 'Remove' : 'Unfollow'}
                    </button>
                )}
                {type === "Connections" && (
                    <button 
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100"
                        onClick={() => handleAction('remove')}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Remove'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserCard;
