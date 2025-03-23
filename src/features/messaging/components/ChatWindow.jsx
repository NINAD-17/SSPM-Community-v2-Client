import React, { useState, useEffect, useRef, forwardRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Send, Paperclip, Smile, ArrowLeft, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import PropTypes from 'prop-types';
import { 
  clearCurrentConversation,
  fetchConversationMessages, 
  sendMessage,
} from "../messagesSlice";
import Spinner from "../../../components/common/Spinner";
import defaultAvatar from "../../../assets/user.png";
import useMediaQuery from "../../../hooks/useMediaQuery";
import _ from 'lodash';

const ChatWindow = () => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [newMessage, setNewMessage] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  
  const currentUser = useSelector(state => state.user.user);
  const { data: conversation, messages, status, pagination } = useSelector(
    state => state.messages.currentConversation
  );
  const messageOperation = useSelector(state => state.messages.messageOperation);

  // Scroll to bottom when messages are loaded initially
  useEffect(() => {
    if (isInitialLoad && messages.length > 0 && status !== 'loading') {
      const scrollToBottom = () => {
        const container = messagesContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      };
      
      // Use setTimeout to ensure DOM is updated
      setTimeout(scrollToBottom, 100);
      setIsInitialLoad(false);
    }
  }, [messages, isInitialLoad, status]);

  // Scroll to bottom when a new message is sent
  useEffect(() => {
    if (!isInitialLoad && messageOperation.sending === false) {
      const scrollToBottom = () => {
        const container = messagesContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      };
      
      // Use setTimeout to ensure DOM is updated
      setTimeout(scrollToBottom, 100);
    }
  }, [messageOperation.sending, isInitialLoad]);

  // Reset initial load state when conversation changes
  useEffect(() => {
    if (conversation?._id) {
      setIsInitialLoad(true);
    }
  }, [conversation?._id]);

  const handleLoadMore = async () => {
    if (pagination.hasMore && status !== 'loading') {
      const container = messagesContainerRef.current;
      if (container) {
        console.log('Current scroll position:', container.scrollTop); // Debug log
        console.log('Current scroll height:', container.scrollHeight); // Debug log
        
        setPrevScrollHeight(container.scrollHeight);
        
        // Fetch more messages
        await dispatch(fetchConversationMessages({
          conversationId: conversation._id,
          cursor: pagination.nextCursor
        }));
      }
    }
  };

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Check if we're near the top (within 100px)
    const isNearTop = container.scrollTop <= 100;
    const canLoadMore = pagination.hasMore && status !== 'loading';

    if (isNearTop && canLoadMore) {
      console.log('Loading more messages...'); // For debugging
      handleLoadMore();
    }
  }, [pagination.hasMore, status, pagination.nextCursor, conversation?._id]);

  // Create throttled version of scroll handler
  const throttledScrollHandler = useMemo(() => 
    _.throttle((e) => {
      e.persist(); // Needed for React synthetic events
      handleScroll();
    }, 300, { leading: true, trailing: true }), 
    [handleScroll]
  );

  // Cleanup throttled handler on unmount
  useEffect(() => {
    return () => {
      throttledScrollHandler.cancel();
    };
  }, [throttledScrollHandler]);

  // Maintain scroll position after loading more messages
  useEffect(() => {
    if (!isInitialLoad && prevScrollHeight > 0) {
      const container = messagesContainerRef.current;
      if (container) {
        const newScrollHeight = container.scrollHeight;
        const scrollDiff = newScrollHeight - prevScrollHeight;
        if (scrollDiff > 0) {
          container.scrollTop = scrollDiff;
        }
        setPrevScrollHeight(0);
      }
    }
  }, [messages.length, prevScrollHeight, isInitialLoad]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || messageOperation.sending) return;

    try {
      await dispatch(sendMessage({
        conversationId: conversation._id,
        content: newMessage.trim()
      })).unwrap();
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const getOtherParticipant = (conversation) => {
    if (conversation?.conversationType === "direct") {
      return conversation.participants.find(
        participant => participant._id !== currentUser._id
      );
    }
    return null;
  };

  const otherParticipant = getOtherParticipant(conversation);
  const title = conversation?.title || 
    (otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : 'Chat');

  return (
    <div className="h-full flex flex-col">
      <ChatHeader conversation={conversation} otherParticipant={otherParticipant} title={title} isMobile={isMobile} />
      
      <div 
        ref={messagesContainerRef}
        onScroll={throttledScrollHandler}
        className="flex-1 overflow-y-auto bg-gray-50 p-4 scroll-smooth relative"
        style={{ minHeight: 0 }}
      >
        {/* Loading indicator for pagination */}
        {status === 'loading' && !isInitialLoad && (
          <div className="sticky top-0 left-0 right-0 flex justify-center p-2 bg-gray-50/80 backdrop-blur-sm z-10">
            <Spinner size="sm" />
          </div>
        )}

        {/* Messages list */}
        <div className="flex flex-col space-y-4">
          {pagination.hasMore && !isInitialLoad && (
            <div className="text-center text-sm text-gray-500 py-2">
              {status === 'loading' ? 'Loading more messages...' : 'Scroll up to load more'}
            </div>
          )}
          
          {messages.map(message => (
            <MessageItem 
              key={message._id}
              message={message}
              isOwn={message.sender._id === currentUser._id}
            />
          ))}
        </div>

        {/* Empty state */}
        {!isInitialLoad && messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="bg-blue-50 rounded-full p-4 mb-4">
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Start the conversation
            </h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Send a message to start chatting. Your messages are private to you and your connection.
            </p>
          </div>
        )}

        {/* Initial loading state */}
        {isInitialLoad && status === 'loading' && (
          <div className="flex-1 flex items-center justify-center">
            <Spinner />
          </div>
        )}

        {/* Invisible element for scroll to bottom */}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput 
        value={newMessage}
        onChange={setNewMessage}
        onSubmit={handleSendMessage}
        isDisabled={messageOperation.sending}
      />
    </div>
  );
};

ChatWindow.propTypes = {
  conversation: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    conversationType: PropTypes.string,
    participants: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      avatar: PropTypes.string,
      headline: PropTypes.string
    }))
  })
};

const ChatHeader = ({ conversation, otherParticipant, title, isMobile }) => {
  const dispatch = useDispatch();
  
  return (
    <div className="flex-none p-4 border-b border-gray-200">
      <div className="flex items-center">
        {isMobile && (
          <button 
            onClick={() => dispatch(clearCurrentConversation())}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <div className="flex items-center">
          <img
            src={otherParticipant?.avatar || defaultAvatar}
            alt={title}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
            <p className="text-sm text-green-600">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageList = forwardRef(function MessageList({ messages, currentUser, onScroll, isLoading }, ref) {
  return (
    <div 
      ref={ref}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto bg-gray-50 p-4"
    >
      {isLoading && (
        <div className="flex justify-center p-4">
          <Spinner />
        </div>
      )}
      
      {!isLoading && messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center px-4">
          <div className="bg-blue-50 rounded-full p-4 mb-4">
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Start the conversation
          </h3>
          <p className="text-sm text-gray-500 max-w-sm">
            Send a message to start chatting. Your messages are private to you and your connection {/* and secure. */}
          </p>
        </div>
      )}
      
      {messages.map(message => (
        <MessageItem 
          key={message._id}
          message={message}
          isOwn={message.sender._id === currentUser._id}
        />
      ))}
    </div>
  );
});

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    sender: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      avatar: PropTypes.string
    }).isRequired,
    createdAt: PropTypes.string.isRequired,
    status: PropTypes.string
  })).isRequired,
  currentUser: PropTypes.object.isRequired,
  onScroll: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

MessageList.displayName = 'MessageList';

const MessageItem = ({ message, isOwn }) => {
  const currentUser = useSelector(state => state.user.user);

  return (
    <div className={`flex items-end space-x-3 mb-4 ${
      isOwn ? 'justify-end' : 'justify-start'
    }`}>
      {!isOwn && (
        <div className="flex-shrink-0">
          <img
            src={message.sender?.avatar || defaultAvatar}
            alt={message.sender?.firstName}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      )}
      
      <div
        className={`flex flex-col ${
          isOwn ? 'items-end' : 'items-start'
        } max-w-[85%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[50%]`}
      >
        <div
          className={`px-4 py-2 ${
            isOwn
              ? 'bg-blue-500 text-white rounded-l-2xl rounded-tr-2xl rounded-br-sm shadow-sm'
              : 'bg-white text-gray-900 rounded-r-2xl rounded-tl-2xl rounded-bl-sm shadow-sm'
          }`}
        >
          <p className="text-[15px] leading-normal">
            {message.content}
          </p>
        </div>
        
        <div className={`flex items-center mt-1 space-x-2 ${
          isOwn ? 'justify-end' : 'justify-start'
        }`}>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </span>
          
          {isOwn && (
            <span className="text-xs text-gray-500">
              {message.status === 'sent' && '✓'}
              {message.status === 'delivered' && '✓✓'}
              {message.status === 'read' && (
                <span className="text-blue-500">✓✓</span>
              )}
            </span>
          )}
        </div>
      </div>
      
      {isOwn && (
        <div className="flex-shrink-0">
          <img
            src={currentUser.avatar || defaultAvatar}
            alt="You"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

const MessageInput = ({ value, onChange, onSubmit, isDisabled }) => {
  return (
    <form onSubmit={onSubmit} className="flex-none p-4 border-t border-gray-200">
      <div className="flex items-center space-x-3">
        <button 
          type="button" 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Paperclip className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full pl-4 pr-12 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isDisabled}
          />
          <button 
            type="button" 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-200 p-1 rounded-full transition-colors"
          >
            <Smile className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <button 
          type="submit"
          disabled={isDisabled || !value.trim()}
          className={`p-2.5 rounded-full transition-colors ${
            isDisabled || !value.trim()
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </form>
  );
};

export default ChatWindow;
