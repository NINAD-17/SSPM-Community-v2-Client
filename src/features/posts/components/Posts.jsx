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
    const { data: posts, status, error, lastPostId, fetchCount, allPostsFetched } = 
        useSelector(state => state.posts[isProfile ? 'userPosts' : 'feed']);
    
    const observer = useRef();
    
    const lastPostRef = useCallback(node => {
        // Don't observe if loading, no node, or all posts are fetched
        if (status === 'loading' || !node || allPostsFetched) return;
        
        if (observer.current) observer.current.disconnect();
        console.log({fetchCount})
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !allPostsFetched) {
                const params = { lastPostId, limit: 10, fetchCount: fetchCount + 1 };
                console.log({params})
                if (isProfile) {
                    dispatch(loadUserPosts({ userId, ...params }));
                } else {
                    dispatch(loadFeedPosts(params));
                    console.log("loadPosts: ", {fetchCount}, "\n", allPostsFetched);
                }
            }
        });

        if (node) observer.current.observe(node);
    }, [lastPostId, allPostsFetched, status, dispatch, isProfile, userId, fetchCount]);

    useEffect(() => {
        const params = { lastPostId: null, limit: 10, fetchCount: 0 };
        if (isProfile) {
            dispatch(loadUserPosts({ userId, ...params }));
        } else {
            dispatch(loadFeedPosts(params));
        }

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
                    {posts?.map((post, index) => {
                        // Apply ref to last post only if not all posts are fetched
                        if (posts.length === index + 1 && !allPostsFetched) {
                            return <PostCardWithRef ref={lastPostRef} key={post._id} post={post} />;
                        }
                        return (
                            <div key={post._id}>
                                <PostCard post={post} />
                            </div>
                        );
                    })}
                    
                    {/* Show loading state only if not all posts are fetched */}
                    {status === 'loading' && !allPostsFetched && (
                        <div className="w-full text-center p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        </div>
                    )}

                    {/* Show end message when all posts are fetched */}
                    {allPostsFetched && posts.length > 0 && (
                        <div className="w-full text-center p-4 text-gray-500">
                            No more posts to load
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Posts;
