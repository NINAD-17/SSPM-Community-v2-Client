import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadGroups } from '../features/groups/groupsSlice';
import GroupList from '../features/groups/components/GroupList';
import CreateGroupButton from '../features/groups/components/CreateGroupButton';
import GroupSuggestions from '../features/groups/components/GroupSuggestions';

const GroupsPage = () => {
    const dispatch = useDispatch();
    const { status } = useSelector(state => state.groups);

    useEffect(() => {
        dispatch(loadGroups());
    }, [dispatch]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Left Sidebar */}
                <div className="w-full md:w-1/4">
                    <div className="bg-white rounded-xl shadow p-4">
                        <CreateGroupButton />
                        <GroupSuggestions />
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full md:w-1/2">
                    <GroupList />
                </div>

                {/* Right Sidebar - Reserved for future use */}
                <div className="w-full md:w-1/4">
                    {/* Future content */}
                </div>
            </div>
        </div>
    );
};

export default GroupsPage; 