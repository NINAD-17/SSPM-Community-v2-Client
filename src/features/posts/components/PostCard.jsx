import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { removePost, toggleFollowButton } from "../postsSlice";
import { calculateTimeAgo } from "../../../utils/calculateTimeAgo";
import { academicYearCalc } from "../../../utils/academicYear";
import { Menu } from '@headlessui/react';
import { toast } from "sonner";
import defaultAvatar from "../../../assets/user.png";
import { togglePostLike } from "../../interactions/likesSlice";
import { updatePostInState } from "../postsSlice";
import PostInteractionsModal from "../../interactions/components/PostInteractionsModal";
import MediaGallery from "./MediaGallary";

const PostCard = ({ post }) => {
    const {
        _id: postId,
        userId,
        content,
        media,
        likesCount,
        commentsCount,
        isLiked,
        createdAt,
        userDetails,
    } = post;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loggedInUser = useSelector((state) => state.user.user);
    const [showInteractions, setShowInteractions] = useState(false);
    const [interactionTab, setInteractionTab] = useState("comments");
    const location = useLocation();
    const isOwner = userId === loggedInUser?._id;

    const handleDelete = async () => {
        try {
            await dispatch(removePost(postId)).unwrap();
            toast.success("Post deleted successfully");
        } catch (error) {
            toast.error("Failed to delete post");
        }
    };

    const handleShare = () => {
        const postUrl = `${window.location.origin}/posts/${postId}`;
        navigator.clipboard.writeText(postUrl);
        toast.success("Post link copied to clipboard!");
    };

    const handleFollowToggle = async () => {
        try {
            await dispatch(toggleFollowButton(userId)).unwrap();
            toast.success(userDetails.isFollowing ? "Unfollowed successfully" : "Followed successfully");
        } catch (error) {
            toast.error("Failed to update follow status");
        }
    };

    const handleLikeToggle = async () => {
        try {
            const result = await dispatch(togglePostLike({ postId })).unwrap();
            dispatch(
                updatePostInState({
                    postId,
                    updates: {
                        isLiked: result.liked,
                        likesCount: likesCount + (result.liked ? 1 : -1),
                    },
                })
            );
        } catch (error) {
            console.error("Like toggle error:", error);
            toast.error(error?.message || "Failed to update like");
        }
    };

    const handleInteractionClick = (tab) => {
        setInteractionTab(tab);
        setShowInteractions(true);
    };

    return (
        <div className="bg-white p-6 shadow rounded-xl mb-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 group cursor-pointer"
                     onClick={() => navigate(`/user/profile/${userId}`)}>
                    <img
                        className="h-12 w-12 rounded-full object-cover group-hover:ring-2 ring-blue-200 transition-all"
                        src={userDetails?.avatar || defaultAvatar}
                        alt=""
                    />
                    <div>
                        <div className="flex flex-row items-center">
                            <h2 className="font-semibold text-md group-hover:text-blue-600 transition-colors">
                                {`${userDetails?.firstName} ${userDetails?.lastName}`}
                            </h2>
                            {userDetails?.role === "student" ? (
                                <span className="text-gray-400 text-sm ml-2 font-normal">
                                    {academicYearCalc(userDetails?.graduationYear)} Year Student
                                </span>
                            ) : (
                                <span className="text-gray-400 text-sm ml-2 font-normal">
                                    Alumni - {userDetails?.graduationYear}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm font-normal truncate max-w-[300px]">
                            {userDetails?.headline || `Branch - ${userDetails?.branch}`}
                        </p>
                        <p className="text-gray-500 text-xs font-normal">
                            {calculateTimeAgo(createdAt)}
                        </p>
                    </div>
                </div>

                <Menu as="div" className="relative">
                    <Menu.Button className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-gray-600">more_vert</span>
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        {!isOwner && (
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={`${
                                            active ? 'bg-gray-100' : ''
                                        } w-full text-left px-4 py-2 text-sm`}
                                        onClick={handleFollowToggle}
                                    >
                                        {userDetails.isFollowing ? 'Unfollow' : 'Follow'} {userDetails.firstName}
                                    </button>
                                )}
                            </Menu.Item>
                        )}
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
                        {isOwner && (
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

            <div className="my-3">
                <div 
                    className="description prose prose-blue max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
                <MediaGallery media={media} />
            </div>

            <div className="flex justify-between items-center mt-4 text-gray-500">
                <div className="flex items-center space-x-1">
                    <button
                        onClick={handleLikeToggle}
                        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <span
                            className={`material-symbols-outlined ${isLiked ? "text-red-500" : ""}`}
                            style={{
                                fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0",
                            }}
                        >
                            favorite
                        </span>
                    </button>
                    <button
                        className="hover:text-blue-600 cursor-pointer font-medium transition-colors hover:underline"
                        onClick={() => handleInteractionClick("likes")}
                        title="View likes"
                    >
                        {likesCount}
                    </button>
                </div>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => handleInteractionClick("comments")}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer group"
                        title="View comments"
                    >
                        <span className="material-symbols-outlined group-hover:text-blue-600 transition-colors">
                            comment
                        </span>
                    </button>
                    <button
                        className="cursor-pointer hover:text-blue-600 transition-colors font-medium hover:underline"
                        onClick={() => handleInteractionClick("comments")}
                        title="View comments"
                    >
                        {commentsCount}
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

export default PostCard;
