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

const UserCard = ({ user, type }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async (actionType) => {
        setIsLoading(true);
        try {
            switch (actionType) {
                case 'accept':
                    await dispatch(acceptConnectionRequestButton(user._id)).unwrap();
                    toast.success('Connection request accepted');
                    break;
                case 'reject':
                    await dispatch(rejectConnectionRequestButton(user._id)).unwrap();
                    toast.success('Connection request rejected');
                    break;
                case 'unfollow':
                    await dispatch(toggleFollowButton(user._id)).unwrap();
                    toast.success(type === "Followers" ? 'Follower removed' : 'User unfollowed');
                    break;
                case 'remove':
                    if (type === 'Followers') {
                        await dispatch(removeFollowerButton(user._id)).unwrap();
                        toast.success('Follower removed');
                    } else {
                        await dispatch(removeConnectionButton(user._id)).unwrap();
                        toast.success('Connection removed');
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            toast.error(error.message || 'Action failed');
            console.error('Action failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-4">
                <img
                    src={user.avatar || Avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                    <h3 className="font-semibold text-gray-800">{user.firstName} {user.lastName}</h3>
                    <p className="text-gray-600 text-sm">{user.headline || user.role}</p>
                    {user.currentlyWorkingAt && (
                        <p className="text-gray-500 text-sm">{user.currentlyWorkingAt}</p>
                    )}
                    {/* {user.mutualConnections > 0 && (
                        <p className="text-gray-400 text-sm">
                            {user.mutualConnections} mutual connections
                        </p>
                    )} */}
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
