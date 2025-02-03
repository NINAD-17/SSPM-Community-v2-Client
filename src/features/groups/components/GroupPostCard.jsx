import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteGroupPost } from "../groupsSlice";
import { toast } from "sonner";
import { calculateTimeAgo } from "../../../utils/calculateTimeAgo";

const GroupPostCard = ({ post }) => {
    console.log("Group post card: ", {post});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    console.log("user from grp post card: ",{user})

    // const handleLike = async () => {
    //     try {
    //         await dispatch(togglePostLike({ 
    //             postId: post._id, 
    //             postType: 'GroupPost' 
    //         })).unwrap();
    //     } catch (error) {
    //         toast.error("Failed to update like");
    //     }
    // };

    const handleDelete = async () => {
        try {
            await dispatch(deleteGroupPost(post._id)).unwrap();
            toast.success("Post deleted successfully");
        } catch (error) {
            toast.error("Failed to delete post");
        }
    };

    return (
        <div className="bg-white p-6 shadow rounded-xl mb-4">
            {/* Post Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={post.user.avatar || "/default-avatar.png"}
                        alt={post.user.firstName}
                    />
                    <div>
                        <div className="flex items-center">
                            <h2
                                className="font-semibold text-md hover:underline cursor-pointer"
                                onClick={() => navigate(`/user/profile/${post.user._id}`)}
                            >
                                {post.user.firstName} {post.user.lastName}
                            </h2>
                            {post.user.headline && (
                                <span className="text-gray-500 text-sm ml-2">
                                    {post.user.headline}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-500 text-xs">
                            {calculateTimeAgo(post.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Post Menu (for post owner) */}
                {post?.user?._id.toString() === user?._id.toString() && (
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-1 hover:bg-gray-100 rounded-full"
                        >
                            <span className="material-symbols-outlined">
                                more_vert
                            </span>
                        </button>
                        
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg z-10">
                                <button
                                    onClick={handleDelete}
                                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Post Content */}
            <div className="my-4">
                <p className="text-gray-800">{post.content}</p>
                {post.media && post.media.length > 0 && (
                    <div className="mt-3 rounded-xl overflow-hidden">
                        <img
                            src={post.media[0]}
                            alt="Post media"
                            className="w-full object-cover"
                        />
                    </div>
                )}
            </div>

            {/* Post Actions */}
            <div className="flex justify-between text-gray-500 mt-4">
                <button 
                    // onClick={handleLike}
                    className={`flex items-center space-x-1 ${post.isLiked ? 'text-blue-600' : ''}`}
                >
                    <span className="material-symbols-outlined">
                        thumb_up
                    </span>
                    <span>{post.likesCount || 0}</span>
                </button>

                <button className="flex items-center space-x-1">
                    <span className="material-symbols-outlined">
                        comment
                    </span>
                    <span>{post.commentsCount || 0}</span>
                </button>

                <button className="flex items-center space-x-1">
                    <span className="material-symbols-outlined">
                        share
                    </span>
                </button>
            </div>
        </div>
    );
};

export default GroupPostCard;
