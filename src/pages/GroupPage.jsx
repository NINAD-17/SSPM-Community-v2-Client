import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    loadGroupDetails, 
    loadGroupPosts, 
    clearCurrentGroup 
} from '../features/groups/groupsSlice';
import GroupHeader from '../features/groups/components/GroupHeader';
import GroupStats from '../features/groups/components/GroupStats';
import CreateGroupPost from '../features/groups/components/CreateGroupPost';
import GroupPostList from '../features/groups/components/GroupPostList';
import GroupMemberList from '../features/groups/components/GroupMemberList';
import GroupAdminList from '../features/groups/components/GroupAdminList';
import Spinner from '../components/common/Spinner';
import Layout from '../components/layout/Layout';
import Footer from '../components/layout/Footer';
import UserListModal from '../features/groups/components/UserListModal';

const GroupPage = () => {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const { 
        currentGroup: { 
            data: group, 
            posts,
            status, 
            error 
        } 
    } = useSelector(state => state.groups);
    console.log('group:', group, "\n", useSelector(state => state.groups));
    const [showAdminsModal, setShowAdminsModal] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);

    useEffect(() => {
        if (groupId) {
            dispatch(loadGroupDetails(groupId));
            dispatch(loadGroupPosts({ 
                groupId,
                lastPostId: null,
                limit: 10,
                fetchCount: 0
            }));
        }

        return () => {
            dispatch(clearCurrentGroup());
        };
    }, [dispatch, groupId]);

    if (status === 'loading' && !group) {
        return <Spinner />;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <Layout>
            <div className="bg-blue-50 min-h-screen pb-8">
                {/* Group Header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <GroupHeader group={group} />
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Sidebar */}
                        <div className="lg:col-span-3 space-y-6">
                            <GroupStats group={group} posts={posts} />
                            <div className="hidden lg:block">
                                <Footer />
                            </div>
                        </div>

                        {/* Main Feed */}
                        <div className="lg:col-span-6 space-y-6">
                            {group?.isMember && (
                                <CreateGroupPost />
                            )}
                            <GroupPostList 
                                groupId={groupId}
                                posts={posts.items}
                                totalPosts={posts.totalCount}
                                lastPostId={posts.lastId}
                                allPostsFetched={posts.allFetched}
                                fetchCount={posts.fetchCount}
                            />
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Admins Section */}
                            <div className="bg-white rounded-xl shadow">
                                <div className="p-4 border-b flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">Group Admins</h2>
                                    <button
                                        onClick={() => setShowAdminsModal(true)}
                                        className="text-sm text-blue-600 cursor-pointer hover:underline"
                                    >
                                        See all
                                    </button>
                                </div>
                                <div className="p-4">
                                    {/* <GroupAdminList 
                                        groupId={groupId}
                                        preview={true}
                                    /> */}
                                </div>
                            </div>

                            {/* Members Section */}
                            <div className="bg-white rounded-xl shadow">
                                <div className="p-4 border-b flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">Group Members</h2>
                                    <button
                                        onClick={() => setShowMembersModal(true)}
                                        className="text-sm text-blue-600 cursor-pointer hover:underline"
                                    >
                                        See all
                                    </button>
                                </div>
                                <div className="p-4">
                                    {/* <GroupMemberList 
                                        groupId={groupId}
                                        preview={true}
                                    /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modals */}
                {/* <UserListModal
                    isOpen={showAdminsModal}
                    onClose={() => setShowAdminsModal(false)}
                    title="Group Admins"
                    groupId={groupId}
                    type="admin"
                />
                
                <UserListModal
                    isOpen={showMembersModal}
                    onClose={() => setShowMembersModal(false)}
                    title="Group Members"
                    groupId={groupId}
                    type="member"
                /> */}
            </div>
        </Layout>
    );
};

export default GroupPage; 