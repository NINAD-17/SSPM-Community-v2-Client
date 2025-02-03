import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadGroupPosts } from "../groupsSlice";
import GroupPostCard from "./GroupPostCard";
import Spinner from "../../../components/common/Spinner";

const GroupPostList = ({ groupId }) => {
    const dispatch = useDispatch();
    const { groupPosts, status } = useSelector((state) => state.groups);
    console.log({groupPosts});

    useEffect(() => {
        if (groupId) {
            dispatch(loadGroupPosts({ groupId }));
        }
    }, [dispatch, groupId]);

    if (status === 'loading') return <Spinner />;

    if (groupPosts.posts.length === 0) {
        return (
            <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-gray-500">No posts yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {groupPosts.posts.map(post => (
                <GroupPostCard key={post._id} post={post} />
            ))}
        </div>
    );
};

export default GroupPostList; 