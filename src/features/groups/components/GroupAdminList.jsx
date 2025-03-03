import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GroupAdminList = ({ admins = [], showAll = false, onShowAll }) => {
    const navigate = useNavigate();
    const displayAdmins = showAll ? admins : admins.slice(0, 3);

    return (
        <div className="space-y-2">
            {displayAdmins.map(admin => (
                <div 
                    key={admin._id}
                    onClick={() => navigate(`/profile/${admin._id}`)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                >
                    <img
                        src={admin.avatar || "/default-avatar.png"}
                        alt={`${admin.firstName} ${admin.lastName}`}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="font-medium text-gray-900">
                            {admin.firstName} {admin.lastName}
                        </h3>
                        <p className="text-sm text-blue-600">Group Admin</p>
                    </div>
                </div>
            ))}
            
            {!showAll && admins.length > 3 && (
                <button
                    onClick={onShowAll}
                    className="w-full p-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium"
                >
                    Show all admins ({admins.length})
                </button>
            )}
        </div>
    );
};

export default GroupAdminList; 