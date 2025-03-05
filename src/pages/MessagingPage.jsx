import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import ConversationList from "../features/messaging/components/ConversationList";
import ChatWindow from "../features/messaging/components/ChatWindow";

const MessagingPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Demo data - will be replaced with Redux state later
  const demoConversations = [
    {
      _id: "1",
      title: "John Doe",
      lastMessage: {
        content: "Hey, how are you?",
        createdAt: "2024-03-20T10:30:00Z",
        sender: {
          _id: "2",
          firstName: "John",
          lastName: "Doe",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
        }
      },
      updatedAt: "2024-03-20T10:30:00Z"
    },
    {
      _id: "2",
      title: "Jane Smith",
      lastMessage: {
        content: "See you tomorrow!",
        createdAt: "2024-03-20T09:15:00Z",
        sender: {
          _id: "3",
          firstName: "Jane",
          lastName: "Smith",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
        }
      },
      updatedAt: "2024-03-20T09:15:00Z"
    },
    {
        _id: "1",
        title: "John Doe",
        lastMessage: {
          content: "Hey, how are you?",
          createdAt: "2024-03-20T10:30:00Z",
          sender: {
            _id: "2",
            firstName: "John",
            lastName: "Doe",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
          }
        },
        updatedAt: "2024-03-20T10:30:00Z"
      },
      {
        _id: "2",
        title: "Jane Smith",
        lastMessage: {
          content: "See you tomorrow!",
          createdAt: "2024-03-20T09:15:00Z",
          sender: {
            _id: "3",
            firstName: "Jane",
            lastName: "Smith",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
          }
        },
        updatedAt: "2024-03-20T09:15:00Z"
      },
      {
        _id: "1",
        title: "John Doe",
        lastMessage: {
          content: "Hey, how are you?",
          createdAt: "2024-03-20T10:30:00Z",
          sender: {
            _id: "2",
            firstName: "John",
            lastName: "Doe",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
          }
        },
        updatedAt: "2024-03-20T10:30:00Z"
      },
      {
        _id: "2",
        title: "Jane Smith",
        lastMessage: {
          content: "See you tomorrow!",
          createdAt: "2024-03-20T09:15:00Z",
          sender: {
            _id: "3",
            firstName: "Jane",
            lastName: "Smith",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
          }
        },
        updatedAt: "2024-03-20T09:15:00Z"
      },
      {
        _id: "1",
        title: "John Doe",
        lastMessage: {
          content: "Hey, how are you?",
          createdAt: "2024-03-20T10:30:00Z",
          sender: {
            _id: "2",
            firstName: "John",
            lastName: "Doe",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
          }
        },
        updatedAt: "2024-03-20T10:30:00Z"
      },
      {
        _id: "2",
        title: "Jane Smith",
        lastMessage: {
          content: "See you tomorrow!",
          createdAt: "2024-03-20T09:15:00Z",
          sender: {
            _id: "3",
            firstName: "Jane",
            lastName: "Smith",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
          }
        },
        updatedAt: "2024-03-20T09:15:00Z"
      },
      {
        _id: "1",
        title: "John Doe",
        lastMessage: {
          content: "Hey, how are you?",
          createdAt: "2024-03-20T10:30:00Z",
          sender: {
            _id: "2",
            firstName: "John",
            lastName: "Doe",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
          }
        },
        updatedAt: "2024-03-20T10:30:00Z"
      },
      {
        _id: "2",
        title: "Jane Smith",
        lastMessage: {
          content: "See you tomorrow!",
          createdAt: "2024-03-20T09:15:00Z",
          sender: {
            _id: "3",
            firstName: "Jane",
            lastName: "Smith",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
          }
        },
        updatedAt: "2024-03-20T09:15:00Z"
      },
  ];

  return (
    <Layout>
      <div className="h-[calc(100vh-64px)] bg-gray-50">
        <div className="flex h-full">
          {/* Conversations Sidebar */}
          <div 
            className={`
              ${isMobileView ? (
                selectedConversation ? 'hidden' : 'w-full'
              ) : 'w-[350px]'} 
              bg-white border-r border-gray-200
            `}
          >
            <ConversationList 
              conversations={demoConversations}
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
            />
          </div>

          {/* Chat Window */}
          <div 
            className={`
              ${isMobileView ? (
                selectedConversation ? 'w-full' : 'hidden'
              ) : 'flex-1'} 
              bg-white
            `}
          >
            {selectedConversation || !isMobileView ? (
              <ChatWindow 
                conversation={selectedConversation || demoConversations[0]}
                onBack={() => setSelectedConversation(null)}
                isMobileView={isMobileView}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MessagingPage;
