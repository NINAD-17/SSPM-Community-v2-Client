import { useSelector } from 'react-redux';
import GroupCard from './GroupCard';
import Spinner from '../../../components/common/Spinner';

const GroupList = () => {
    const { groups, status, error } = useSelector(state => state.groups);

    if (status === 'loading') {
        return <Spinner />;
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow p-4 text-center">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    if (groups.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow p-4 text-center">
                <p className="text-gray-500">No groups found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {groups.map(group => (
                <GroupCard key={group._id} group={group} />
            ))}
        </div>
    );
};

export default GroupList; 