import { useState } from 'react';
import { format } from 'date-fns';

const EventFeedback = ({ event, feedback, stats, disableFeedbackSubmission = false }) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [userFeedback, setUserFeedback] = useState({
    rating: 5,
    content: '',
    isAnonymous: false
  });

  // Handle input change for feedback form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserFeedback(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle submit for feedback
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    
    // In the real app, you'd call an API to submit the feedback
    console.log('Submitting feedback:', userFeedback);
    
    // Clear the form and hide it
    setUserFeedback({
      rating: 5,
      content: '',
      isAnonymous: false
    });
    setShowFeedbackForm(false);
  };

  // Format date for display
  const formatDate = (date) => {
    return format(new Date(date), 'MMM d, yyyy');
  };

  // Helper to render stars for ratings
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <svg 
            key={star}
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {stats.totalFeedbacks > 0 ? (
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Event Feedback</h2>
              <div className="flex items-center">
                <div className="flex mr-2">
                  {renderStars(stats.averageRating)}
                </div>
                <span className="text-lg font-semibold text-gray-800">{stats.averageRating.toFixed(1)}</span>
                <span className="mx-2 text-gray-500">•</span>
                <span className="text-gray-600">{stats.totalFeedbacks} reviews</span>
              </div>
            </div>
            
            {disableFeedbackSubmission ? (
              <div className="mt-4 md:mt-0 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center">
                <span className="material-symbols-outlined mr-2">schedule</span>
                Feedback available after event completion
              </div>
            ) : (
              <button
                onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300"
              >
                {showFeedbackForm ? 'Cancel' : 'Leave Feedback'}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Event Feedback</h2>
              <p className="text-gray-600 mt-1">
                {disableFeedbackSubmission 
                  ? 'Feedback will be available after the event is completed.' 
                  : 'Be the first to leave feedback for this event!'}
              </p>
            </div>
            
            {disableFeedbackSubmission ? (
              <div className="mt-4 md:mt-0 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center">
                <span className="material-symbols-outlined mr-2">schedule</span>
                Feedback available after event completion
              </div>
            ) : (
              <button
                onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300"
              >
                {showFeedbackForm ? 'Cancel' : 'Leave Feedback'}
              </button>
            )}
          </div>
        )}

        {showFeedbackForm && !disableFeedbackSubmission && (
          <form onSubmit={handleFeedbackSubmit} className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Your Feedback</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Rating</label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserFeedback(prev => ({ ...prev, rating: star }))}
                    className="p-1 focus:outline-none"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-7 w-7 ${star <= userFeedback.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              <input 
                type="hidden" 
                name="rating" 
                value={userFeedback.rating} 
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
                Your Review
              </label>
              <textarea
                id="content"
                name="content"
                value={userFeedback.content}
                onChange={handleInputChange}
                placeholder="Share your experience with this event..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={4}
                required
              />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  name="isAnonymous"
                  checked={userFeedback.isAnonymous}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isAnonymous" className="ml-2 text-gray-700">
                  Post anonymously
                </label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}
        
        {stats.totalFeedbacks > 0 && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Rating Distribution</h3>
            
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = stats.ratingDistribution[rating];
                const percentage = Math.round((count / stats.totalFeedbacks) * 100);
                
                return (
                  <div key={rating} className="flex items-center">
                    <div className="w-8 text-sm font-medium text-gray-800">
                      {rating} {rating === 1 ? 'star' : 'stars'}
                    </div>
                    <div className="w-full mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full bg-yellow-400" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="min-w-[60px] text-right text-sm text-gray-600">
                      {count} ({percentage}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {feedback.length > 0 ? (
        <div className="space-y-4">
          {feedback.map(item => (
            <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start">
                {item.userId ? (
                  <img 
                    src={item.userId.profilePicture || 'https://via.placeholder.com/40?text=User'} 
                    alt={`${item.userId.firstName} ${item.userId.lastName}`}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="font-medium text-gray-800 mr-2">
                      {item.userId 
                        ? `${item.userId.firstName} ${item.userId.lastName}` 
                        : 'Anonymous User'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(item.createdAt)}
                    </span>
                    {item.isEdited && (
                      <span className="ml-2 text-sm text-gray-500">(edited)</span>
                    )}
                  </div>
                  
                  <div className="mb-2">
                    {renderStars(item.rating)}
                  </div>
                  
                  <p className="text-gray-700">{item.content}</p>
                  
                  {item.tags?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">
            {disableFeedbackSubmission
              ? 'Feedback will be available after the event is completed.'
              : 'No feedback yet. Be the first to leave feedback for this event!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventFeedback;