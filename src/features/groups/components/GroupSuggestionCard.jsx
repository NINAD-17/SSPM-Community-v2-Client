import { useNavigate } from 'react-router-dom';

const GroupSuggestionCard = ({ group }) => {
    const navigate = useNavigate();

    return (
        <div 
            className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
            onClick={() => navigate(`/groups/${group._id}`)}
        >
            <img
                src={group.avatarImg || "/default-group.png"}
                alt={group.name}
                className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
                <h3 className="font-medium text-gray-900 line-clamp-1">
                    {group.name}
                </h3>
                <p className="text-sm text-gray-500">
                    {group.category}
                </p>
            </div>
        </div>
    );
};

export default GroupSuggestionCard;