import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { joinGroup, leaveGroup } from '../groupsSlice';
import { toast } from 'sonner';
import { useState } from 'react';

const GroupHeader = ({ group }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const [isLoading, setIsLoading] = useState(false);
    
    if (!group) return null;

    const handleJoinLeave = async () => {
        setIsLoading(true);
        try {
            if (group.isMember) {
                await dispatch(leaveGroup(group._id)).unwrap();
                toast.success('Left group successfully');
            } else {
                await dispatch(joinGroup(group._id)).unwrap();
                toast.success('Joined group successfully');
            }
        } catch (error) {
            toast.error(error || 'Failed to update group membership');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-sm mb-4 rounded-xl overflow-hidden">
            {/* Cover Image */}
            <div className="h-32 sm:h-48 w-full relative">
                <img
                    src={group.coverImg || "/default-cover.png"}
                    alt="cover"
                    className="w-full h-full object-cover"
                />
                
                {/* Group Avatar Overlay */}
                <div className="absolute -bottom-6 left-4 sm:left-6 border-4 border-white rounded-xl shadow-lg">
                    <img
                        src={group.avatarImg || "/default-group.png"}
                        alt={group.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover"
                    />
                </div>
            </div>

            {/* Group Info Section */}
            <div className="pt-8 px-4 sm:px-6 pb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0">
                    <div className="flex-1">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                            {group.name}
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">
                            {group.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                                <span className="material-symbols-outlined text-base mr-1">
                                    group
                                </span>
                                {group.totalMembers || 0} members
                            </span>
                            <span className="flex items-center">
                                <span className="material-symbols-outlined text-base mr-1">
                                    visibility
                                </span>
                                {group.visibility}
                            </span>
                            <span className="flex items-center">
                                <span className="material-symbols-outlined text-base mr-1">
                                    calendar_month
                                </span>
                                <span className="hidden sm:inline">Created </span>
                                {new Date(group.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        {/* Skills Tags */}
                        {group.skills && group.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {group.skills.map((skill, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Desktop Join/Leave Button */}
                    <div className="hidden sm:block flex-shrink-0">
                        <button
                            onClick={handleJoinLeave}
                            disabled={isLoading}
                            className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                                group.isMember
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            } disabled:opacity-50`}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <span className="animate-spin mr-2">⏳</span>
                                    {group.isMember ? 'Leaving...' : 'Joining...'}
                                </span>
                            ) : (
                                group.isMember ? 'Leave Group' : 'Join Group'
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Join/Leave Button */}
                <div className="sm:hidden mt-4 border-t border-gray-300 pt-4">
                    <button
                        onClick={handleJoinLeave}
                        disabled={isLoading}
                        className={`w-full py-2 rounded-xl font-medium transition-colors ${
                            group.isMember
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        } disabled:opacity-50`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <span className="animate-spin mr-2">⏳</span>
                                {group.isMember ? 'Leaving...' : 'Joining...'}
                            </span>
                        ) : (
                            group.isMember ? 'Leave Group' : 'Join Group'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// GroupHeader.propTypes = {
//     group: PropTypes.shape({
//         _id: PropTypes.string.isRequired,
//         name: PropTypes.string.isRequired,
//         description: PropTypes.string,
//         coverImg: PropTypes.string,
//         avatarImg: PropTypes.string,
//         members: PropTypes.array,
//         skills: PropTypes.arrayOf(PropTypes.string),
//         visibility: PropTypes.string,
//         createdAt: PropTypes.string,
//         isMember: PropTypes.bool
//     }).isRequired
// };

export default GroupHeader; 