import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Search, MoreVertical, Plus } from "lucide-react";
import PropTypes from 'prop-types';
import Spinner from "../../../components/common/Spinner";
import defaultAvatar from "../../../assets/user.png";
import { useSelector, useDispatch } from "react-redux";
import NewConversationModal from './NewConversationModal';
import { fetchConversationDetails, fetchConversationMessages, clearCurrentConversation, clearCurrentConversationMessages } from "../messagesSlice";

const ConversationList = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { items: conversations, status } = useSelector(state => state.messages.conversations);
  const currentUser = useSelector(state => state.user.user);
  const currentConversation = useSelector(state => state.messages.currentConversation.data);

  const handleConversationCreated = (newConversation) => {
    setIsModalOpen(false);
    handleSelectConversation(newConversation);
  };

  const handleSelectConversation = async (conversation) => {
    dispatch(clearCurrentConversationMessages());
    dispatch(fetchConversationDetails(conversation._id));
    dispatch(fetchConversationMessages({ conversationId: conversation._id }));
  };

  const filteredConversations = conversations.filter(conv => 
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === 'loading') {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  console.log("conversations: ", conversations);
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-none p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations found
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => (
              <ConversationItem 
                key={conversation._id}
                conversation={conversation}
                currentUserId={currentUser._id}
                onClick={() => handleSelectConversation(conversation)}
                isSelected={currentConversation?._id === conversation._id}
              />
            ))}
          </div>
        )}
      </div>

      <NewConversationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
};

// Separate component for conversation item
const ConversationItem = ({ conversation, currentUserId, onClick, isSelected }) => {
  const otherParticipant = conversation.participants.find(
    p => p._id !== currentUserId
  );

  const getLastMessageText = () => {
    if (!conversation.lastMessage) return 'No messages yet';
    
    const sender = Array.isArray(conversation.lastMessage.sender) 
      ? conversation.lastMessage.sender[0] 
      : conversation.lastMessage.sender;

    if (!sender) return conversation.lastMessage.content;

    const senderName = sender._id === currentUserId 
      ? 'You'
      : conversation.conversationType === 'direct'
        ? otherParticipant?.firstName
        : sender.firstName;

    return `${senderName}: ${conversation.lastMessage.content}`;
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-4 cursor-pointer transition-colors
        ${isSelected 
          ? 'bg-blue-50 hover:bg-blue-100' 
          : 'hover:bg-gray-50'
        }`}
    >
      <div className="relative">
        <img
          src={conversation.conversationType === 'direct' 
            ? (otherParticipant?.avatar || defaultAvatar)
            : defaultAvatar}
          alt={conversation.title}
          className={`w-12 h-12 rounded-full object-cover
            ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
        />
      </div>
      
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className={`text-sm font-semibold truncate
            ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
            {conversation.title}
          </h3>
          {conversation.lastMessage?.createdAt && (
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">
          {getLastMessageText()}
        </p>
      </div>
    </div>
  );
};

ConversationItem.propTypes = {
  conversation: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    conversationType: PropTypes.string.isRequired,
    participants: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      avatar: PropTypes.string
    })).isRequired,
    lastMessage: PropTypes.shape({
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      sender: PropTypes.oneOfType([
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          firstName: PropTypes.string,
          lastName: PropTypes.string
        }),
        PropTypes.arrayOf(PropTypes.shape({
          _id: PropTypes.string.isRequired,
          firstName: PropTypes.string,
          lastName: PropTypes.string
        }))
      ])
    })
  }).isRequired,
  currentUserId: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool
};

ConversationItem.defaultProps = {
  isSelected: false
};

ConversationList.propTypes = {
  conversations: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    conversationType: PropTypes.string.isRequired,
    participants: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      avatar: PropTypes.string,
      headline: PropTypes.string
    })).isRequired,
    lastMessage: PropTypes.shape({
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      sender: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        avatar: PropTypes.string
      })
    })
  })).isRequired,
  selectedConversation: PropTypes.object,
  onSelectConversation: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default ConversationList;
