import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadGroupPosts } from "../groupsSlice";
import GroupPostCard from "./GroupPostCard";
import Spinner from "../../../components/common/Spinner";
import PropTypes from 'prop-types';
import postNotFound from "../../../assets/postNotFound.png";
import React from "react";

// Create a forwarded ref version of GroupPostCard
const GroupPostCardWithRef = React.forwardRef(({ post, group }, ref) => (
    <div ref={ref}>
        <GroupPostCard post={post} group={group} />
    </div>
));

GroupPostCardWithRef.displayName = 'GroupPostCardWithRef';

GroupPostCardWithRef.propTypes = {
    post: PropTypes.object.isRequired,
    group: PropTypes.object
};

const GroupPostList = ({ 
    groupId, 
    posts = [], 
    totalPosts = 0, 
    lastPostId = null, 
    allPostsFetched = false, 
    fetchCount = 0 
}) => {
    const dispatch = useDispatch();
    const { data: currentGroup, status } = useSelector((state) => state.groups.currentGroup);
    
    const observer = useRef();
    
    const lastPostRef = useCallback(node => {
        if (status === 'loading' || !node || allPostsFetched) return;
        
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !allPostsFetched) {
                const params = { lastPostId, limit: 10, fetchCount: fetchCount + 1 };
                dispatch(loadGroupPosts({ 
                    groupId, 
                    ...params
                }));
            }
        });

        observer.current.observe(node);
    }, [lastPostId, allPostsFetched, status, dispatch, groupId, fetchCount]);

    useEffect(() => {
        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, []);

    if (status === 'loading' && !posts?.length) {
        return <Spinner />;
    }

    if (posts?.length === 0) {
        return (
            <div className="w-full bg-white rounded-xl text-center p-10 shadow">
                <img 
                    className="mx-auto my-auto w-80" 
                    src={postNotFound} 
                    alt="No posts found" 
                />
                <h2 className="text-gray-300 font-semibold text-2xl">
                    No posts in this group yet
                </h2>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts?.map((post, index) => {
                if (posts.length === index + 1 && !allPostsFetched) {
                    return <GroupPostCardWithRef ref={lastPostRef} key={post._id} post={post} group={currentGroup} />;
                }
                return <GroupPostCard key={post._id} post={post} group={currentGroup} />;
            })}
            
            {status === 'loading' && posts?.length > 0 && (
                <div className="w-full text-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                </div>
            )}

            {allPostsFetched && posts?.length > 0 && (
                <div className="w-full text-center p-4 text-gray-500">
                    No more posts to load
                </div>
            )}
        </div>
    );
};

GroupPostList.propTypes = {
    groupId: PropTypes.string.isRequired,
    posts: PropTypes.array,
    totalPosts: PropTypes.number,
    lastPostId: PropTypes.string,
    allPostsFetched: PropTypes.bool,
    fetchCount: PropTypes.number
};

export default GroupPostList; 