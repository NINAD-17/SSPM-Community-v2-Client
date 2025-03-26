import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { joinGroup, leaveGroup } from '../groupsSlice';
import { toast } from 'sonner';

const GroupCard = ({ group }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector(state => state.user);
  
  const handleJoinLeave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      if (group.isMember) {
        await dispatch(leaveGroup(group._id)).unwrap();
        toast.success('You left the group');
      } else {
        await dispatch(joinGroup(group._id)).unwrap();
        toast.success(group.isPrivate ? 'Join request sent' : 'You joined the group');
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to process your request');
      console.error('Error joining/leaving group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isOwner = user && group.createdBy && user._id === group.createdBy;
  
  // Import default images from assets with correct paths
  const defaultAvatar = new URL('/src/assets/group-default.jpg', import.meta.url).href;
  const defaultCover = new URL('/src/assets/group-cover-default.jpg', import.meta.url).href;
  
  // Get members count from either membersCount or members array length
  const membersCount = group.membersCount || (group.members?.length || 0);
  
  // Check if the group is private based on visibility or isPrivate property
  const isPrivate = group.isPrivate || group.visibility === 'private';
  
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Cover image */}
      <div className="relative h-36 bg-gradient-to-r from-blue-500 to-indigo-600">
        {group.coverImage || group.coverImg ? (
          <img 
            src={group.coverImage || group.coverImg} 
            alt={`${group.name} cover`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={defaultCover}
            alt=""
            className="w-full h-full object-cover opacity-80"
          />
        )}
        
        {/* Privacy indicator */}
        <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center">
          {isPrivate ? (
            <>
              <span className="material-symbols-outlined text-[14px] mr-1">lock</span>
              <span>Private</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[14px] mr-1">public</span>
              <span>Public</span>
            </>
          )}
        </div>
        
        {/* Group avatar */}
        <div className="absolute -bottom-8 left-4">
          <div className="h-16 w-16 rounded-full border-4 border-white bg-white shadow overflow-hidden">
            <img 
              src={group.avatar || group.avatarImg || defaultAvatar} 
              alt={group.name} 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Group info */}
      <div className="flex-grow p-4 pt-10">
        <Link to={`/groups/${group._id}`} className="block">
          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{group.name}</h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {group.description || 'No description available'}
          </p>
          
          {/* Group stats */}
          <div className="flex items-center text-sm text-gray-500 mb-2 space-x-4">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-[14px] mr-1">group</span>
              <span>{membersCount} members</span>
            </div>
            
            {group.isMember && (
              <div className="flex items-center text-green-600">
                <span className="material-symbols-outlined text-[14px] mr-1">person_check</span>
                <span>Member</span>
              </div>
            )}
          </div>
          
          {/* Skills tags */}
          {group.skills && group.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {group.skills.slice(0, 3).map((skill, index) => (
                <span 
                  key={index}
                  className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {group.skills.length > 3 && (
                <span className="text-xs text-gray-500">+{group.skills.length - 3} more</span>
              )}
            </div>
          )}
        </Link>
      </div>
      
      {/* Actions */}
      <div className="p-4 pt-0 flex items-center justify-between border-t border-gray-100 mt-auto">
        <button
          onClick={handleJoinLeave}
          disabled={isLoading || isOwner}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isOwner 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : group.isMember
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading 
            ? 'Processing...' 
            : isOwner 
              ? 'Owner'
              : group.isMember 
                ? 'Leave' 
                : isPrivate ? 'Request to Join' : 'Join'
          }
        </button>
        
        <Link 
          to={`/groups/${group._id}`}
          className="text-blue-600 hover:text-blue-800 transition-colors flex items-center text-sm"
        >
          View <span className="material-symbols-outlined text-[14px] ml-1">chevron_right</span>
        </Link>
      </div>
    </div>
  );
};

GroupCard.propTypes = {
  group: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    avatar: PropTypes.string,
    avatarImg: PropTypes.string,
    coverImage: PropTypes.string,
    coverImg: PropTypes.string,
    membersCount: PropTypes.number,
    members: PropTypes.array,
    isPrivate: PropTypes.bool,
    visibility: PropTypes.string,
    isMember: PropTypes.bool,
    createdBy: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};

export default GroupCard; 