import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { joinGroup, leaveGroup } from '../groupsSlice';
import { toast } from 'sonner';

const RecommendedGroupCard = ({ group }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleCardClick = () => {
    navigate(`/groups/${group._id}`);
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
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Cover image with gradient overlay */}
      <div className="relative h-28">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-80"></div>
        {(group.coverImage || group.coverImg) && (
          <img 
            src={group.coverImage || group.coverImg} 
            alt={`${group.name} cover`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {/* Group info overlay */}
        <div className="absolute inset-0 p-3 flex items-end">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full border-2 border-white bg-white overflow-hidden mr-3 flex-shrink-0">
              <img 
                src={group.avatar || group.avatarImg || defaultAvatar}
                alt={group.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-white">
              <h3 className="font-bold text-sm line-clamp-1">{group.name}</h3>
              <div className="flex items-center text-xs text-white/80">
                <span className="material-symbols-outlined text-[14px] mr-1">group</span>
                <span>{membersCount || 0} members</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div className="flex-grow p-3">
        <p className="text-xs text-gray-600 line-clamp-2">
          {group.description || 'No description available'}
        </p>
      </div>
      
      {/* Join Button - Separate from card click */}
      <div className="p-3 pt-0">
        <button
          onClick={handleJoinLeave}
          disabled={isLoading || isOwner}
          className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            isOwner 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : group.isMember
                ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading 
            ? 'Processing...' 
            : isOwner 
              ? 'Owner'
              : group.isMember 
                ? <><span className="material-symbols-outlined text-[14px] mr-1">check</span> Joined</> 
                : 'Join Now'
          }
        </button>
      </div>
    </div>
  );
};

RecommendedGroupCard.propTypes = {
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
    createdBy: PropTypes.string
  }).isRequired
};

export default RecommendedGroupCard; 