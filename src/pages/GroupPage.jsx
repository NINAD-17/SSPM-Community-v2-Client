import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadGroupDetails, loadGroupPosts, clearGroupPosts } from '../features/groups/groupsSlice';
import GroupInfoCard from '../features/groups/components/GroupInfoCard';
import CreateGroupPost from '../features/groups/components/CreateGroupPost';
import GroupPostList from '../features/groups/components/GroupPostList';
import Spinner from '../components/common/Spinner';
import Layout from '../components/layout/Layout';
import Groups from '../features/groups/components/Groups';

const GroupPage = () => {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const { currentGroup, status, error } = useSelector(state => state.groups);

    useEffect(() => {
        if (groupId) {
            // Clear previous group posts when loading a new group
            dispatch(clearGroupPosts());
            // Load group details and posts
            dispatch(loadGroupDetails(groupId));
            dispatch(loadGroupPosts({ groupId }));
        }
    }, [dispatch, groupId]); // Only re-run when groupId changes

    if (status === 'loading' && !currentGroup) {
        return <Spinner />;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Left Sidebar */}
                    <div className="w-full md:w-1/4">
                        <GroupInfoCard group={currentGroup} />
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-1/2">
                        {currentGroup?.isMember && <CreateGroupPost groupId={groupId} />}
                        <GroupPostList groupId={groupId} />
                    </div>

                    {/* Right Sidebar - Reserved for future use */}
                    <div className="w-full md:w-1/4">
                        <Groups />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default GroupPage; 