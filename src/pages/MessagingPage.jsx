import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/layout/Layout";
import ConversationList from "../features/messaging/components/ConversationList";
import ChatWindow from "../features/messaging/components/ChatWindow";
import { fetchConversations } from "../features/messaging/messagesSlice";
import useMediaQuery from "../hooks/useMediaQuery";

const MessagingPage = () => {
  const dispatch = useDispatch();
  const { currentConversation } = useSelector(state => state.messages);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  return (
    <Layout>
      <div className="h-[calc(100vh-64px)] bg-gray-50">
        <div className="flex h-full">
          {/* Conversations Sidebar */}
          <div 
            className={`
              ${isMobile ? (
                currentConversation.data ? 'hidden' : 'w-full'
              ) : 'w-[350px]'} 
              bg-white border-r border-gray-200
            `}
          >
            <ConversationList />
          </div>

          {/* Chat Window */}
          <div 
            className={`
              ${isMobile ? (
                currentConversation.data ? 'w-full' : 'hidden'
              ) : 'flex-1'} 
              bg-white
            `}
          >
            {currentConversation.data ? (
              <ChatWindow />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <p className="text-lg font-medium">Select a conversation to start messaging</p>
                <p className="text-sm">Choose from your existing conversations or start a new one</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MessagingPage;
