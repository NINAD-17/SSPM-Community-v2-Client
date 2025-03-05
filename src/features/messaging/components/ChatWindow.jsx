import React, { useState, useEffect, useRef } from "react";
import { Send, Paperclip, Smile, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import PropTypes from 'prop-types';

const ChatWindow = ({ conversation, onBack, isMobileView }) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Demo messages - Move this before the useEffect
  const demoMessages = [
    {
      _id: "1",
      content: "Hey! How are you?",
      sender: {
        _id: "2",
        firstName: "John",
        lastName: "Doe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
      },
      createdAt: "2024-03-20T10:30:00Z"
    },
    {
      _id: "2",
      content: "I'm doing great! How about you?",
      sender: {
        _id: "1",
        firstName: "Me",
        lastName: "",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Me"
      },
      createdAt: "2024-03-20T10:31:00Z"
    },
    {
        _id: "1",
        content: "Hey! How are you?",
        sender: {
          _id: "2",
          firstName: "John",
          lastName: "Doe",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
        },
        createdAt: "2024-03-20T10:30:00Z"
      },
      {
        _id: "2",
        content: "I'm doing great! How about you?",
        sender: {
          _id: "1",
          firstName: "Me",
          lastName: "",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Me"
        },
        createdAt: "2024-03-20T10:31:00Z"
      },
      {
        _id: "1",
        content: "Hey! How are you?",
        sender: {
          _id: "2",
          firstName: "John",
          lastName: "Doe",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
        },
        createdAt: "2024-03-20T10:30:00Z"
      },
      {
        _id: "2",
        content: "I'm doing great! How about you?",
        sender: {
          _id: "1",
          firstName: "Me",
          lastName: "",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Me"
        },
        createdAt: "2024-03-20T10:31:00Z"
      },
      {
        _id: "1",
        content: "Hey! How are you?",
        sender: {
          _id: "2",
          firstName: "John",
          lastName: "Doe",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
        },
        createdAt: "2024-03-20T10:30:00Z"
      },
      {
        _id: "2",
        content: "I'm doing great! How about you?",
        sender: {
          _id: "1",
          firstName: "Me",
          lastName: "",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Me"
        },
        createdAt: "2024-03-20T10:31:00Z"
      },
      {
        _id: "1",
        content: "Hey! How are you?",
        sender: {
          _id: "2",
          firstName: "John",
          lastName: "Doe",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
        },
        createdAt: "2024-03-20T10:30:00Z"
      },
      {
        _id: "2",
        content: "I'm doing great! How about you?",
        sender: {
          _id: "1",
          firstName: "Me",
          lastName: "",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Me"
        },
        createdAt: "2024-03-20T10:31:00Z"
      }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []); // Empty dependency array since we only want to scroll on mount

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="flex-none p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          {isMobileView && (
            <button 
              onClick={onBack}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div className="flex items-center">
            <img
              src={conversation.lastMessage.sender.avatar}
              alt={conversation.title}
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">{conversation.title}</h3>
              <p className="text-sm text-green-600">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {demoMessages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender._id === "1" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  msg.sender._id === "1"
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-900 rounded-tl-none"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Scroll anchor */}
        </div>
      </div>

      {/* Fixed Message Input */}
      <div className="flex-none p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full pl-4 pr-12 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <button className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full">
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  conversation: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    lastMessage: PropTypes.shape({
      sender: PropTypes.shape({
        avatar: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  isMobileView: PropTypes.bool.isRequired
};

export default ChatWindow;
