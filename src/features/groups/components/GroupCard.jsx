import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { joinGroupAction, leaveGroupAction } from '../groupsSlice';
import { toast } from 'sonner';

const GroupCard = ({ group }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleJoinLeave = async () => {
        try {
            if (group.isMember) {
                await dispatch(leaveGroupAction(group._id)).unwrap();
                toast.success('Left group successfully');
            } else {
                await dispatch(joinGroupAction(group._id)).unwrap();
                toast.success('Joined group successfully');
            }
        } catch (error) {
            toast.error(error || 'Failed to update group membership');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                    <img 
                        src={group.avatar || '/default-group.png'} 
                        alt={group.name}
                        className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                        <h3 
                            className="font-semibold text-lg hover:text-blue-600 cursor-pointer"
                            onClick={() => navigate(`/groups/${group._id}`)}
                        >
                            {group.name}
                        </h3>
                        <p className="text-gray-600 text-sm">{group.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>{group.membersCount} members</span>
                            <span>{group.postsCount} posts</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleJoinLeave}
                    className={`px-4 py-2 rounded-xl ${
                        group.isMember 
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {group.isMember ? 'Leave' : 'Join'}
                </button>
            </div>
        </div>
    );
};

export default GroupCard;



