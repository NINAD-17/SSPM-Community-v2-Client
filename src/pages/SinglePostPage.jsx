import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PostCard from '../features/posts/components/PostCard';
import { fetchSinglePost } from '../features/posts/services/postsService';

const SinglePostPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPost = async () => {
            try {
                setLoading(true);
                const response = await fetchSinglePost(postId);
                if (!response.data.post) {
                    navigate('/not-found');
                    return;
                }
                setPost(response.data.post);
            } catch (error) {
                if (error.response?.status === 404) {
                    navigate('/not-found');
                } else {
                    setError(error?.response?.data?.message || 'Failed to load post');
                }
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            loadPost();
        }
    }, [postId, navigate]);

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="text-red-500">{error}</div>
                </div>
            </Layout>
        );
    }

    if (!post) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="text-gray-500">Post not found</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-4">
                <PostCard post={post} />
            </div>
        </Layout>
    );
};

export default SinglePostPage; 