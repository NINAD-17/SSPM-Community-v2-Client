import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import PropTypes from 'prop-types';
import defaultAvatar from '../../../assets/user.png';
import CommentsList from './CommentsList';
import LikesList from './LikesList';
import { addComment } from '../services/commentsService';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { updatePostInState } from '../../posts/postsSlice';

const PostInteractionsModal = ({ isOpen, onClose, post, defaultTab = 'comments' }) => {
    const dispatch = useDispatch();
    const [selectedTab, setSelectedTab] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const currentUser = useSelector(state => state.user.user);

    useEffect(() => {
        setSelectedTab(defaultTab === 'comments' ? 0 : 1);
    }, [defaultTab]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        
        try {
            const response = await addComment(post._id, newComment);
            if (response.data?.comment) {
                const commentWithUser = {
                    ...response.data.comment,
                    user: {
                        _id: currentUser._id,
                        firstName: currentUser.firstName,
                        lastName: currentUser.lastName,
                        avatar: currentUser.avatar
                    }
                };
                setComments(prevComments => {
                    const currentComments = Array.isArray(prevComments) ? prevComments : [];
                    return [commentWithUser, ...currentComments];
                });
                setNewComment('');
                toast.success('Comment added successfully');

                dispatch(updatePostInState({
                    postId: post._id,
                    updates: {
                        commentsCount: post.commentsCount + 1
                    }
                }))
            }
        } catch (error) {
            toast.error('Failed to add comment');
        }
    };

    useEffect(() => {
        if (isOpen) {
            setComments([]);
        }
    }, [isOpen, post._id]);

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-[51]">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
                </Transition.Child>
                
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="bg-white rounded-xl w-full max-w-md shadow-xl">
                            {/* Header */}
                            <div className="p-4 border-b flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img 
                                        src={post.userDetails?.avatar || defaultAvatar} 
                                        alt=""
                                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                    />
                                    <div>
                                        <h3 className="font-semibold">
                                            {post.userDetails?.firstName} {post.userDetails?.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-500">Post interactions</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={onClose} 
                                    className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            {/* Tabs */}
                            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                                <Tab.List className="flex border-b">
                                    <Tab className={({ selected }) => `
                                        flex-1 py-3 text-sm font-medium outline-none cursor-pointer transition-colors
                                        ${selected 
                                            ? 'text-blue-600 border-b-2 border-blue-600' 
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }
                                    `}>
                                        <div className="flex items-center justify-center space-x-2">
                                            <span className="material-symbols-outlined text-[20px]">comment</span>
                                            <span>Comments ({post.commentsCount})</span>
                                        </div>
                                    </Tab>
                                    <Tab className={({ selected }) => `
                                        flex-1 py-3 text-sm font-medium outline-none cursor-pointer transition-colors
                                        ${selected 
                                            ? 'text-blue-600 border-b-2 border-blue-600' 
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }
                                    `}>
                                        <div className="flex items-center justify-center space-x-2">
                                            <span className="material-symbols-outlined text-[20px]">favorite</span>
                                            <span>Likes ({post.likesCount})</span>
                                        </div>
                                    </Tab>
                                </Tab.List>

                                <Tab.Panels>
                                    <Tab.Panel className="max-h-[60vh] flex flex-col">
                                        <div className="flex-1 overflow-y-auto">
                                            <CommentsList 
                                                postId={post._id} 
                                                comments={comments || []}
                                                setComments={setComments}
                                            />
                                        </div>
                                        
                                        {/* Comment Input */}
                                        <div className="flex-none border-t p-4 bg-white">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    placeholder="Write a comment..."
                                                    className="flex-1 px-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleAddComment();
                                                        }
                                                    }}
                                                />
                                                <button 
                                                    onClick={handleAddComment}
                                                    disabled={!newComment.trim()}
                                                    className="text-blue-600 hover:text-blue-700 font-semibold px-4 py-2 rounded-full hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                                                >
                                                    Post
                                                </button>
                                            </div>
                                        </div>
                                    </Tab.Panel>
                                    
                                    <Tab.Panel className="max-h-[60vh] overflow-y-auto">
                                        <LikesList postId={post._id} />
                                    </Tab.Panel>
                                </Tab.Panels>
                            </Tab.Group>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

PostInteractionsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    defaultTab: PropTypes.oneOf(['comments', 'likes']),
    post: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        content: PropTypes.string,
        media: PropTypes.arrayOf(PropTypes.string),
        commentsCount: PropTypes.number,
        likesCount: PropTypes.number,
        userDetails: PropTypes.shape({
            avatar: PropTypes.string,
            firstName: PropTypes.string,
            lastName: PropTypes.string
        })
    }).isRequired
};

export default PostInteractionsModal;