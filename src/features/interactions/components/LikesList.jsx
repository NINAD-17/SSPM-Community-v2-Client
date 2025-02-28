import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { fetchPostLikes } from '../services/likesService';
import defaultAvatar from '../../../assets/user.png';

const LikesList = ({ postId }) => {
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadLikedBy = async () => {
            setLoading(true);
            try {
                const response = await fetchPostLikes(postId);
                setLikes(response.data.likedBy);
                console.log(likes);
            } catch (error) {
                console.error('Failed to fetch likes:', error);
            } finally {
                setLoading(false);
            }
        };

        loadLikedBy();
    }, [postId]);

    return (
        <div className="h-full">
            {loading ? (
                <div className="p-4 text-center text-gray-500">
                    Loading likes...
                </div>
            ) : !likes?.length ? (
                <div className="p-8 text-center text-gray-500">
                    <span className="material-symbols-outlined text-4xl mb-2">favorite_border</span>
                    <p>No likes yet</p>
                </div>
            ) : (
                <div className="divide-y">
                    {likes.map(like => (
                        <div key={like._id} className="p-4 hover:bg-gray-50">
                            <Link 
                                to={`/user/profile/${like.userId}`}
                                className="flex items-center space-x-3"
                            >
                                <img 
                                    src={like.avatar || defaultAvatar} 
                                    alt=""
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <span className="font-semibold hover:underline">
                                        {like.firstName} {like.lastName}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

LikesList.propTypes = {
    postId: PropTypes.string.isRequired
};

export default LikesList; 