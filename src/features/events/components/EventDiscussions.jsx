import { useState } from 'react';
import { format } from 'date-fns';

const EventDiscussions = ({ event, discussions }) => {
  const [newDiscussion, setNewDiscussion] = useState('');
  const [replyTexts, setReplyTexts] = useState({});
  const [expandedDiscussions, setExpandedDiscussions] = useState({});

  // Toggle discussion expansion
  const toggleDiscussion = (discussionId) => {
    setExpandedDiscussions(prev => ({
      ...prev,
      [discussionId]: !prev[discussionId]
    }));
  };

  // Handle input change for new discussion
  const handleNewDiscussionChange = (e) => {
    setNewDiscussion(e.target.value);
  };

  // Handle input change for replies
  const handleReplyChange = (discussionId, value) => {
    setReplyTexts(prev => ({
      ...prev,
      [discussionId]: value
    }));
  };

  // Handle submit for new discussion
  const handleNewDiscussionSubmit = (e) => {
    e.preventDefault();
    if (!newDiscussion.trim()) return;
    
    // In the real app, you'd call an API to submit the discussion
    console.log('Submitting new discussion:', newDiscussion);
    
    // Clear the input
    setNewDiscussion('');
  };

  // Handle submit for reply
  const handleReplySubmit = (e, discussionId) => {
    e.preventDefault();
    const replyText = replyTexts[discussionId];
    if (!replyText?.trim()) return;
    
    // In the real app, you'd call an API to submit the reply
    console.log('Submitting reply to discussion', discussionId, ':', replyText);
    
    // Clear the input
    setReplyTexts(prev => ({
      ...prev,
      [discussionId]: ''
    }));
  };

  // Format date for display
  const formatDate = (date) => {
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Start a Discussion</h2>
        
        <form onSubmit={handleNewDiscussionSubmit}>
          <div className="mb-4">
            <textarea
              value={newDiscussion}
              onChange={handleNewDiscussionChange}
              placeholder="Start a discussion or ask a question about this event..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300"
            >
              Post Discussion
            </button>
          </div>
        </form>
      </div>
      
      {discussions.length > 0 ? (
        <div className="space-y-4">
          {discussions.map(discussion => (
            <div key={discussion._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-start">
                  <img 
                    src={discussion.userId.profilePicture || 'https://via.placeholder.com/40?text=User'} 
                    alt={`${discussion.userId.firstName} ${discussion.userId.lastName}`}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="font-medium text-gray-800 mr-2">
                        {discussion.userId.firstName} {discussion.userId.lastName}
                      </span>
                      {discussion.isPinned && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Pinned
                        </span>
                      )}
                      {discussion.isCoordinatorReply && (
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-2">
                          Coordinator
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700">{discussion.content}</p>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <span>{formatDate(discussion.createdAt)}</span>
                      {discussion.isEdited && (
                        <span className="ml-2">(edited)</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => toggleDiscussion(discussion._id)}
                      className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                    >
                      {discussion.replies?.length || 0} {discussion.replies?.length === 1 ? 'Reply' : 'Replies'}
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="text-sm text-gray-600 hover:text-gray-800">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
              
              {expandedDiscussions[discussion._id] && discussion.replies?.length > 0 && (
                <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-200">
                  <div className="space-y-4 pl-10">
                    {discussion.replies.map(reply => (
                      <div key={reply._id} className="flex items-start">
                        <img 
                          src={reply.userId.profilePicture || 'https://via.placeholder.com/30?text=User'} 
                          alt={`${reply.userId.firstName} ${reply.userId.lastName}`}
                          className="w-8 h-8 rounded-full object-cover mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <span className="font-medium text-gray-800 mr-2">
                              {reply.userId.firstName} {reply.userId.lastName}
                            </span>
                            {reply.isCoordinatorReply && (
                              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                Coordinator
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700">{reply.content}</p>
                          <div className="mt-1 flex items-center text-xs text-gray-500">
                            <span>{formatDate(reply.createdAt)}</span>
                            {reply.isEdited && (
                              <span className="ml-2">(edited)</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {expandedDiscussions[discussion._id] && (
                <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
                  <form onSubmit={(e) => handleReplySubmit(e, discussion._id)}>
                    <div className="flex items-start mt-3">
                      <div className="w-10 mr-3">
                        {/* This space is for alignment with the discussion avatar */}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={replyTexts[discussion._id] || ''}
                          onChange={(e) => handleReplyChange(discussion._id, e.target.value)}
                          placeholder="Write a reply..."
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                          rows={2}
                          required
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            type="submit"
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition duration-300"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No discussions yet. Start a conversation about this event!</p>
        </div>
      )}
    </div>
  );
};

export default EventDiscussions; 