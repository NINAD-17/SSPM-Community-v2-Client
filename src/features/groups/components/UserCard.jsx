import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import defaultAvatar from '../../../assets/user.png';

const UserCard = ({ user, role }) => {
    const navigate = useNavigate();
    
    return (
        <div 
            onClick={() => navigate(`/profile/${user._id}`)}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
        >
            <div className="flex items-center gap-3">
                <img
                    src={user.avatar || defaultAvatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                    <h3 className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                    </h3>
                    {role === 'admin' ? (
                        <p className="text-sm text-blue-600 flex items-center">
                            <span className="material-symbols-outlined mr-1 text-[14px]">admin_panel_settings</span>
                            Admin
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500">Member</p>
                    )}
                </div>
            </div>
        </div>
    );
};

UserCard.propTypes = {
    user: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        avatar: PropTypes.string
    }).isRequired,
    role: PropTypes.string
};

export default UserCard;
