import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import defaultAvatar from '../../../assets/user.png';
import CommentsList from './CommentsList';
import LikesList from './LikesList';
import Layout from '../../../components/layout/Layout';
import MediaGallery from '../../posts/components/MediaGallary';
import { calculateTimeAgo } from '../../../utils/calculateTimeAgo';

const MobilePostView = () => {
    const { postId } = useParams();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('tab') || 'comments';
    });
    const contentRef = useRef(null);
    const navigate = useNavigate();

    // Get post from Redux state
    const post = useSelector(state => {
        const feedPost = state.posts.feed.data.find(p => p._id === postId);
        if (feedPost) return feedPost;
        return state.posts.userPosts.data.find(p => p._id === postId);
    });

    const handleBack = () => {
        // If we have a previous location, go back to it
        if (location.state?.from) {
            navigate(location.state.from);
        } else {
            navigate(-1);
        }
    };

    useEffect(() => {
        if (!post) {
            navigate('/home');
            return;
        }

        // Scroll to the top when component mounts
        window.scrollTo(0, 0);
    }, [post, navigate]);

    if (!post) return null;

    return (
        <Layout>
            <div className="min-h-screen bg-white">
                {/* Fixed Header */}
                <div className="fixed top-16 left-0 right-0 bg-white z-10 border-b">
                    <div className="flex items-center p-4">
                        <button 
                            onClick={handleBack}
                            className="mr-4"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 className="text-lg font-semibold">Post</h1>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="pt-20 pb-20">
                    {/* User Info */}
                    <div className="px-4 mb-4">
                        <div className="flex items-center space-x-3">
                            <img 
                                src={post.userDetails?.avatar || defaultAvatar} 
                                alt=""
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <span className="font-semibold block">
                                    {post.userDetails?.firstName} {post.userDetails?.lastName}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {calculateTimeAgo(post.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Post Content */}
                    <div className="px-4 mb-6">
                        {post.content && (
                            <div 
                                className="prose max-w-none mb-4"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        )}
                        {post.media?.length > 0 && (
                            <MediaGallery media={post.media} />
                        )}
                    </div>

                    {/* Interactions Section */}
                    <div className="bg-white border-t">
                        <div className="flex border-b">
                            <button
                                className={`flex-1 py-3 text-sm font-medium ${activeTab === 'comments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('comments')}
                            >
                                Comments ({post.commentsCount})
                            </button>
                            <button
                                className={`flex-1 py-3 text-sm font-medium ${activeTab === 'likes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('likes')}
                            >
                                Liked by ({post.likesCount})
                            </button>
                        </div>

                        {activeTab === 'comments' ? (
                            <CommentsList postId={post._id} />
                        ) : (
                            <LikesList postId={post._id} />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default MobilePostView; 