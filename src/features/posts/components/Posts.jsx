import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadFeedPosts, loadUserPosts, clearFeed } from "../postsSlice";
import PostCard from "./PostCard";
import postNotFound from "../../../assets/postNotFound.png";
import React from "react";

// Create a forwarded ref version of PostCard
const PostCardWithRef = React.forwardRef(({ post }, ref) => (
    <div ref={ref}>
        <PostCard post={post} />
    </div>
));

PostCardWithRef.displayName = 'PostCardWithRef';

const Posts = ({ userId = null, isProfile = false }) => {
    const dispatch = useDispatch();
    const { data: posts, status, error, lastPostId, allPostsFetched } = 
        useSelector(state => state.posts[isProfile ? 'userPosts' : 'feed']);
    
    const observer = useRef();
    const lastPostRef = useCallback(node => {
        if (status === 'loading' || !node) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !allPostsFetched) {
                const params = { lastPostId, limit: 10 };
                if (isProfile) {
                    dispatch(loadUserPosts({ userId, ...params }));
                } else {
                    dispatch(loadFeedPosts(params));
                }
            }
        });

        observer.current.observe(node);
    }, [lastPostId, allPostsFetched, status, dispatch, isProfile, userId]);

    useEffect(() => {
        const params = { lastPostId: null, limit: 10 };
        if (isProfile) {
            dispatch(loadUserPosts({ userId, ...params }));
        } else {
            dispatch(loadFeedPosts(params));
        }

        // Cleanup function
        return () => {
            if (!isProfile) {
                dispatch(clearFeed());
            }
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [dispatch, userId, isProfile]);

    return (
        <div className="mt-4">
            {posts?.length === 0 && status !== 'loading' ? (
                <div className="w-full bg-white rounded-xl text-center p-10 mt-4 shadow">
                    <img className="mx-auto my-auto w-80" src={postNotFound} alt="No posts found" />
                    <h2 className="text-gray-300 font-semibold text-2xl">Don't have any posts</h2>
                </div>
            ) : (
                <>
                    {posts?.map((post) => (
                        <div key={post._id}>
                            <PostCard post={post} />
                        </div>
                    ))}
                    {status === 'loading' && (
                        <div className="w-full text-center p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Posts;
