import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeGroupPost, updateGroupPostInState } from "../groupsSlice";
import { toast } from "sonner";
import { calculateTimeAgo } from "../../../utils/calculateTimeAgo";
import { Menu } from '@headlessui/react';
import { togglePostLike } from "../../interactions/likesSlice";
import MediaGallery from "../../posts/components/MediaGallary";
import PostInteractionsModal from "../../interactions/components/PostInteractionsModal";
import defaultAvatar from "../../../assets/user.png";
import Spinner from "../../../components/common/Spinner";
import PropTypes from 'prop-types';

const GroupPostCard = ({ post, group }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const [showInteractions, setShowInteractions] = useState(false);
    const [interactionTab, setInteractionTab] = useState("comments");

    const handleDelete = async () => {
        try {
            await dispatch(removeGroupPost({ 
                postId: post._id,
                groupId: group._id 
            })).unwrap();
            toast.success("Post deleted successfully");
        } catch (error) {
            toast.error(error?.message || "Failed to delete post");
        }
    };

    const handleShare = () => {
        const postUrl = `${window.location.origin}/groups/${group._id}/posts/${post._id}`;
        navigator.clipboard.writeText(postUrl);
        toast.success("Post link copied to clipboard!");
    };

    const handleLikeToggle = async () => {
        try {
            const result = await dispatch(togglePostLike({ 
                postId: post._id,
                postType: 'GroupPost'
            })).unwrap();

            // Update the post in the group's state
            dispatch(updateGroupPostInState({
                postId: post._id,
                updates: {
                    isLiked: result.liked,
                    likesCount: post.likesCount + (result.liked ? 1 : -1)
                }
            }));
        } catch (error) {
            toast.error(error?.message || "Failed to update like");
        }
    };

    const handleInteractionClick = (tab) => {
        setInteractionTab(tab);
        setShowInteractions(true);
    };

    return (
        <div className="bg-white p-6 shadow rounded-xl hover:shadow-md transition-shadow">
            {/* Post Header */}
            <div className="flex items-center justify-between">
                <div 
                    className="flex items-center space-x-3 group cursor-pointer"
                    onClick={() => navigate(`/profile/${post.user?._id}`)}
                >
                    <img
                        className="h-12 w-12 rounded-full object-cover group-hover:ring-2 ring-blue-200 transition-all"
                        src={post.user?.avatar || defaultAvatar}
                        alt={post.user?.firstName}
                    />
                    <div>
                        <div className="flex items-center">
                            <h2 className="font-semibold group-hover:text-blue-600 transition-colors">
                                {post.user?.firstName} {post.user?.lastName}
                            </h2>
                            {post.user?.headline && (
                                <span className="text-gray-500 text-sm ml-2">
                                    • {post.user?.headline}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-500 text-xs">
                            {calculateTimeAgo(post?.createdAt)}
                        </p>
                    </div>
                </div>

                <Menu as="div" className="relative">
                    <Menu.Button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <span className="material-symbols-outlined text-gray-600">more_vert</span>
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    className={`${
                                        active ? 'bg-gray-100' : ''
                                    } w-full text-left px-4 py-2 text-sm`}
                                    onClick={handleShare}
                                >
                                    Share Post
                                </button>
                            )}
                        </Menu.Item>
                        {post.user?._id === user?._id && (
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={`${
                                            active ? 'bg-gray-100' : ''
                                        } w-full text-left px-4 py-2 text-sm text-red-600`}
                                        onClick={handleDelete}
                                    >
                                        Delete Post
                                    </button>
                                )}
                            </Menu.Item>
                        )}
                    </Menu.Items>
                </Menu>
            </div>

            {/* Post Content */}
            <div className="mt-4">
                <div 
                    className="prose prose-blue max-w-none"
                    dangerouslySetInnerHTML={{ __html: post?.content }}
                />
                {post?.media && post?.media?.length > 0 && (
                    <div className="mt-4">
                        <MediaGallery media={post?.media} />
                    </div>
                )}
            </div>

            {/* Post Actions */}
            <div className="flex justify-between items-center mt-4 text-gray-500">
                <div className="flex items-center space-x-1">
                    <button
                        onClick={handleLikeToggle}
                        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <span
                            className={`material-symbols-outlined ${post?.isLiked ? "text-red-500" : ""}`}
                            style={{
                                fontVariationSettings: post?.isLiked ? "'FILL' 1" : "'FILL' 0",
                            }}
                        >
                            favorite
                        </span>
                    </button>
                    <button
                        onClick={() => handleInteractionClick("likes")}
                        className="hover:text-blue-600 transition-colors hover:underline"
                    >
                        {post?.likesCount || 0}
                    </button>
                </div>

                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => handleInteractionClick("comments")}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
                    >
                        <span className="material-symbols-outlined group-hover:text-blue-600 transition-colors">
                            comment
                        </span>
                    </button>
                    <button
                        onClick={() => handleInteractionClick("comments")}
                        className="hover:text-blue-600 transition-colors hover:underline"
                    >
                        {post?.commentsCount || 0}
                    </button>
                </div>
            </div>

            <PostInteractionsModal
                isOpen={showInteractions}
                onClose={() => setShowInteractions(false)}
                post={post}
                defaultTab={interactionTab}
            />
        </div>
    );
};

GroupPostCard.propTypes = {
    post: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        media: PropTypes.arrayOf(PropTypes.string),
        createdAt: PropTypes.string.isRequired,
        likesCount: PropTypes.number,
        commentsCount: PropTypes.number,
        isLiked: PropTypes.bool,
        user: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            avatar: PropTypes.string,
            headline: PropTypes.string
        }).isRequired
    }).isRequired,
    group: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired
};

export default GroupPostCard;
