import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAllUserJoinedGroups } from '../services/groupService';
import PropTypes from 'prop-types';

const JoinedGroups = ({ limit = 5 }) => {
  const [groups, setGroups] = useState([]);
  const [totalGroups, setTotalGroups] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const loadJoinedGroups = async () => {
      try {
        setLoading(true);
        const response = await fetchAllUserJoinedGroups(user._id);
        const data = response.data;
        
        if (data && data.groups) {
          setGroups(data.groups.slice(0, limit));
          setTotalGroups(data.totalJoinedGroups || data.groups.length);
        }
      } catch (error) {
        console.error('Error loading joined groups:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      loadJoinedGroups();
    }
  }, [user?._id, limit]);

  // Default image for group avatar if none exists
  const defaultAvatar = new URL('/src/assets/group-default.jpg', import.meta.url).href;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800">Your Groups</h2>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!groups?.length) {
    return (
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-gray-800">Your Groups</h2>
        </div>
        <div className="text-center py-4">
          <span className="material-symbols-outlined text-3xl text-gray-400 mb-2">groups</span>
          <p className="text-gray-500 text-sm">You haven't joined any groups yet</p>
          <button 
            onClick={() => navigate('/groups')}
            className="mt-3 text-blue-600 hover:text-blue-800 text-sm"
          >
            Discover groups
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold text-gray-800">Your Groups</h2>
        <Link to="/groups" className="text-blue-600 hover:text-blue-800 text-sm">
          See all
        </Link>
      </div>
      <div className="p-2">
        {groups.map(group => (
          <Link 
            key={group._id} 
            to={`/groups/${group._id}`}
            className="flex items-center p-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
              <img 
                src={group.avatarImg || defaultAvatar} 
                alt={group.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 truncate">{group.name}</h3>
              <div className="flex items-center text-xs text-gray-500">
                <span className="material-symbols-outlined text-[14px] mr-1">group</span>
                <span>{group.membersCount || 0} members</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {totalGroups > limit && (
        <div className="px-4 py-3 border-t text-center">
          <Link to="/groups" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all {totalGroups} groups
          </Link>
        </div>
      )}
    </div>
  );
};

JoinedGroups.propTypes = {
  limit: PropTypes.number
};

export default JoinedGroups; 