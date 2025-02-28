import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchComments, updateComment, deleteComment } from '../services/commentsService';
import defaultAvatar from '../../../assets/user.png';
import { calculateTimeAgo } from '../../../utils/calculateTimeAgo';
import { Menu } from '@headlessui/react';
import { toast } from 'sonner';
import { updatePostInState } from '../../posts/postsSlice';

const CommentItem = ({ comment, onCommentUpdate, onCommentDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const loggedInUser = useSelector(state => state.user.user);
    const isOwner = loggedInUser._id === comment.userId;

    const handleSave = async () => {
        try {
            const response = await updateComment(comment._id, editedContent);
            if (response.data?.content) {
                onCommentUpdate(comment._id, editedContent);
                setIsEditing(false);
                toast.success('Comment updated successfully');
            } else {
                throw new Error('Failed to update comment');
            }
        } catch (error) {
            console.error('Update comment error:', error);
            toast.error(error.message || 'Failed to update comment');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteComment(comment._id);
            onCommentDelete(comment._id);
            toast.success('Comment deleted successfully');
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    return (
        <div className="p-4 group">
            <div className="flex items-start space-x-3">
                <img 
                    src={comment.user?.avatar || defaultAvatar} 
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="font-semibold">
                                {comment.user?.firstName} {comment.user?.lastName}
                            </span>
                            {comment.isEdited && (
                                <span className="text-xs text-gray-500 ml-2">
                                    (edited)
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                                {calculateTimeAgo(comment.createdAt)}
                            </span>
                            {isOwner && (
                                <Menu as="div" className="relative">
                                    <Menu.Button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-gray-500">
                                            more_horiz
                                        </span>
                                    </Menu.Button>
                                    <Menu.Items className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg py-1 z-10">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={`${
                                                        active ? 'bg-gray-100' : ''
                                                    } w-full text-left px-4 py-2 text-sm`}
                                                    onClick={() => setIsEditing(true)}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={`${
                                                        active ? 'bg-gray-100' : ''
                                                    } w-full text-left px-4 py-2 text-sm text-red-600`}
                                                    onClick={handleDelete}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Menu>
                            )}
                        </div>
                    </div>
                    {isEditing ? (
                        <div className="mt-2">
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={2}
                            />
                            <div className="flex justify-end space-x-2 mt-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700 mt-1">{comment.content}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const CommentsList = ({ postId, comments, setComments }) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const loadComments = async () => {
            setLoading(true);
            try {
                const response = await fetchComments(postId);
                setComments(response?.data?.comments);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            } finally {
                setLoading(false);
            }
        };

        loadComments();
    }, [postId, setComments]);

    const handleCommentUpdate = async (commentId, updatedComment) => {
        try {
            const updatedComments = comments.map(comment => {
                if (comment._id === commentId) {
                    comment.content = updatedComment;
                    comment.isEdited = true;
                    comment.updatedAt = new Date().toISOString();
                }
                return comment;
            })
            setComments(updatedComments);
            // toast.success('Comment updated successfully');
        } catch (error) {
            console.error('Update comment error:', error);
            toast.error('Failed to update comment');
        }
    };

    const handleCommentDelete = (commentId) => {
        setComments(prevComments => 
            prevComments.filter(comment => comment._id !== commentId)
        );
        
        dispatch(updatePostInState({
            postId, 
            updates: {
                commentsCount: comments.length - 1
            }
        }))
    };

    if (loading) {
        return (
            <div className="p-4 text-center text-gray-500">
                Loading comments...
            </div>
        );
    }

    if (!comments?.length) {
        return (
            <div className="p-4 text-center text-gray-500">
                <span className="material-symbols-outlined text-4xl mb-2">chat_bubble_outline</span>
                <p>No comments yet. Be the first to comment!</p>
            </div>
        );
    }

    return (
        <div className="divide-y">
            {comments.map(comment => (
                <CommentItem 
                    key={comment._id} 
                    comment={comment}
                    onCommentUpdate={handleCommentUpdate}
                    onCommentDelete={handleCommentDelete}
                />
            ))}
        </div>
    );
};

CommentsList.propTypes = {
    postId: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    setComments: PropTypes.func.isRequired
};

export default CommentsList; 