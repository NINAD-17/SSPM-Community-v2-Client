import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const GroupStats = () => {
    const groupData = useSelector(state => state.groups.currentGroup);
    const group = groupData.data;
    const postsData = groupData.posts;
    
    return (
        <div className="bg-white rounded-xl shadow">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Group Activity</h2>
            </div>
            
            <div className="p-4 space-y-4">
                {/* Activity Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                            {postsData.totalCount || 0}
                        </p>
                        <p className="text-sm text-gray-600">Posts</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                            {group?.activeMembers || 0}
                        </p>
                        <p className="text-sm text-gray-600">Active Members</p>
                    </div>
                </div>

                {/* Group Rules */}
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Group Rules</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                            <span className="material-symbols-outlined mr-2 text-blue-600">check_circle</span>
                            Be kind and courteous
                        </li>
                        <li className="flex items-start">
                            <span className="material-symbols-outlined mr-2 text-blue-600">check_circle</span>
                            No hate speech or bullying
                        </li>
                        <li className="flex items-start">
                            <span className="material-symbols-outlined mr-2 text-blue-600">check_circle</span>
                            Respect everyone's privacy
                        </li>
                    </ul>
                </div>

                {/* Recent Activity */}
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Activity</h3>
                    <div className="text-sm text-gray-600">
                        <p className="flex items-center">
                            <span className="material-symbols-outlined mr-2 text-green-600">trending_up</span>
                            {group?.weeklyPostCount || 0} posts this week
                        </p>
                        <p className="flex items-center mt-2">
                            <span className="material-symbols-outlined mr-2 text-blue-600">person_add</span>
                            {group?.newMembersCount || 0} new members this month
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

GroupStats.propTypes = {
    group: PropTypes.shape({
        postsCount: PropTypes.number,
        activeMembers: PropTypes.number,
        weeklyPostCount: PropTypes.number,
        newMembersCount: PropTypes.number
    }).isRequired
};

export default GroupStats; 