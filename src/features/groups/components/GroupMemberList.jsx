import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GroupMemberList = ({ members = [], showAll = false, onShowAll }) => {
    const navigate = useNavigate();
    const displayMembers = showAll ? members : members.slice(0, 5);

    return (
        <div className="space-y-2">
            {displayMembers.map(member => (
                <div 
                    key={member._id}
                    onClick={() => navigate(`/profile/${member._id}`)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                >
                    <img
                        src={member.avatar || "/default-avatar.png"}
                        alt={`${member.firstName} ${member.lastName}`}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{member.headline || 'Member'}</p>
                    </div>
                </div>
            ))}
            
            {!showAll && members.length > 5 && (
                <button
                    onClick={onShowAll}
                    className="w-full p-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium"
                >
                    Show all members ({members.length})
                </button>
            )}
        </div>
    );
};

export default GroupMemberList; 