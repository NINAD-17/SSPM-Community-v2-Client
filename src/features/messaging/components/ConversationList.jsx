import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Search, MoreVertical, Plus } from "lucide-react";
import PropTypes from 'prop-types';

const ConversationList = ({ conversations, selectedConversation, onSelectConversation }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="flex-none p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {conversations.map((conversation) => (
            <div
              key={conversation._id}
              onClick={() => onSelectConversation(conversation)}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${
                selectedConversation?._id === conversation._id ? 'bg-gray-50' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={conversation.lastMessage.sender.avatar}
                  alt={conversation.title}
                  className="w-12 h-12 rounded-full"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
              
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {conversation.title}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {conversation.lastMessage.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ConversationList.propTypes = {
  conversations: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    lastMessage: PropTypes.shape({
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      sender: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    updatedAt: PropTypes.string.isRequired
  })).isRequired,
  selectedConversation: PropTypes.object,
  onSelectConversation: PropTypes.func.isRequired
};

export default ConversationList;
