import { useState, useEffect } from 'react';
import postNotFound from '../../../assets/postNotFound.png';

const EventPosts = ({ eventId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // In a real implementation, this would fetch posts from the API
    // For now, we'll just simulate an empty response after a short delay
    const timer = setTimeout(() => {
      setPosts([]);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [eventId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }
  
  if (posts.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl text-center p-10 mt-4 shadow">
        <img className="mx-auto my-auto w-80" src={postNotFound} alt="No posts found" />
        <h2 className="text-gray-300 font-semibold text-2xl">Don&apos;t have any posts</h2>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post._id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <img 
              src={post.userDetails.avatar || 'https://via.placeholder.com/40?text=User'} 
              alt={`${post.userDetails.firstName} ${post.userDetails.lastName}`}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-medium text-gray-800">
                {post.userDetails.firstName} {post.userDetails.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div 
            className="mb-3 text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          {post.media && post.media.length > 0 && (
            <div className="mb-3">
              {post.media.map((item, index) => (
                <img 
                  key={index}
                  src={item.url}
                  alt="Post media"
                  className="w-full h-auto rounded-lg"
                />
              ))}
            </div>
          )}
          <div className="flex justify-between text-gray-500 text-sm pt-2 border-t">
            <button className="flex items-center">
              <span className="material-symbols-outlined mr-1 text-sm">thumb_up</span>
              Like ({post.likesCount})
            </button>
            <button className="flex items-center">
              <span className="material-symbols-outlined mr-1 text-sm">comment</span>
              Comment ({post.commentsCount})
            </button>
            <button className="flex items-center">
              <span className="material-symbols-outlined mr-1 text-sm">share</span>
              Share
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventPosts; 