import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchConversationsList,
    fetchConversationById,
    fetchMessagesByConversationId,
    createNewConversation,
    sendNewMessage,
    markMessagesAsViewed,
    deleteMessageById,
    updateMessageById
} from './services/messagesService';

// Async Thunks
export const fetchConversations = createAsyncThunk(
    'messages/fetchConversations',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchConversationsList();
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch conversations');
        }
    }
);

export const fetchConversationDetails = createAsyncThunk(
    'messages/fetchConversationDetails',
    async (conversationId, { rejectWithValue }) => {
        try {
            return await fetchConversationById(conversationId);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversation details');
        }
    }
);

export const fetchConversationMessages = createAsyncThunk(
    'messages/fetchConversationMessages',
    async ({ conversationId, cursor }, { rejectWithValue }) => {
        try {
            return await fetchMessagesByConversationId(conversationId, cursor);
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch messages');
        }
    }
);

export const startConversation = createAsyncThunk(
    'messages/startConversation',
    async (conversationData, { rejectWithValue }) => {
        try {
            console.log("starting conversation slice: ", conversationData);
            return await createNewConversation(conversationData);
        } catch (error) {
            console.log("error starting conversation slice: ", error);
            return rejectWithValue(error.response?.data?.message || 'Failed to start conversation');
        }
    }
);

export const sendMessage = createAsyncThunk(
    'messages/sendMessage',
    async ({ conversationId, content }, { rejectWithValue }) => {
        try {
            const message = await sendNewMessage(conversationId, content);
            return { conversationId, message };
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to send message');
        }
    }
);

export const markMessagesAsRead = createAsyncThunk(
    'messages/markAsRead',
    async ({ conversationId, messageIds }, { rejectWithValue }) => {
        try {
            return await markMessagesAsViewed(conversationId, messageIds);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark messages as read');
        }
    }
);

const initialState = {
    conversations: {
        items: [],
        status: 'idle',
        error: null
    },
    currentConversation: {
        data: null,
        messages: [],
        status: 'idle',
        error: null,
        pagination: {
            totalCount: 0,
            fetchedCount: 0,
            remainingCount: 0,
            hasMore: true,
            nextCursor: null
        }
    },
    messageOperation: {
        sending: false,
        error: null
    }
};

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        clearCurrentConversation: (state) => {
            state.currentConversation = initialState.currentConversation;
        },
        clearCurrentConversationMessages: (state) => {
            state.currentConversation.messages = [];
        },
        clearMessageError: (state) => {
            state.messageOperation.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch Conversations
        builder
            .addCase(fetchConversations.pending, (state) => {
                state.conversations.status = 'loading';
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.conversations.status = 'succeeded';
                state.conversations.items = action.payload;
                state.conversations.error = null;
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.conversations.status = 'failed';
                state.conversations.error = action.payload;
            })

        // Fetch Conversation Details
            .addCase(fetchConversationDetails.pending, (state) => {
                state.currentConversation.status = 'loading';
            })
            .addCase(fetchConversationDetails.fulfilled, (state, action) => {
                state.currentConversation.status = 'succeeded';
                state.currentConversation.data = action.payload;
                state.currentConversation.error = null;
            })
            .addCase(fetchConversationDetails.rejected, (state, action) => {
                state.currentConversation.status = 'failed';
                state.currentConversation.error = action.payload;
            })

        // Fetch Messages
            .addCase(fetchConversationMessages.pending, (state) => {
                state.currentConversation.status = 'loading';
            })
            .addCase(fetchConversationMessages.fulfilled, (state, action) => {
                const { messages, cursor, pagination } = action.payload;
                
                if (messages && messages.length > 0) {
                    if (cursor) {
                        // Add older messages at the beginning
                        state.currentConversation.messages = [
                            ...messages.reverse(),
                            ...state.currentConversation.messages
                        ];
                    } else {
                        // Initial load - newest messages at the bottom
                        state.currentConversation.messages = messages.reverse();
                    }
                }

                // Update pagination info
                state.currentConversation.pagination = {
                    totalCount: pagination.totalCount,
                    fetchedCount: pagination.fetchedCount,
                    remainingCount: pagination.remainingCount,
                    hasMore: pagination.hasMore,
                    nextCursor: cursor
                };

                state.currentConversation.status = 'succeeded';
                state.currentConversation.error = null;
            })
            .addCase(fetchConversationMessages.rejected, (state, action) => {
                state.currentConversation.status = 'failed';
                state.currentConversation.error = action.payload;
            })

        // Send Message
            .addCase(sendMessage.pending, (state) => {
                state.messageOperation.sending = true;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                const { conversationId, message } = action.payload;
                
                // Add new message to current conversation
                state.currentConversation.messages.push(message);
                state.currentConversation.pagination.totalCount += 1;
                state.currentConversation.pagination.fetchedCount += 1;

                // Update last message in conversations list and move to top
                const conversationIndex = state.conversations.items.findIndex(
                    c => c._id === conversationId
                );
                if (conversationIndex !== -1) {
                    const conversation = state.conversations.items[conversationIndex];
                    conversation.lastMessage = message;
                    // Move to top of the list
                    state.conversations.items.splice(conversationIndex, 1);
                    state.conversations.items.unshift(conversation);
                }

                state.messageOperation.sending = false;
                state.messageOperation.error = null;
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.messageOperation.sending = false;
                state.messageOperation.error = action.payload;
            })

        // Start Conversation
            .addCase(startConversation.pending, (state) => {
                state.messageOperation.sending = true;
            })
            .addCase(startConversation.fulfilled, (state, action) => {
                state.messageOperation.sending = false;
                
                // Format conversation data before adding to state
                const conversation = action.payload.conversation;
                
                // Find the other participant (for direct conversations)
                const otherParticipant = conversation.conversationType === 'direct' 
                    ? conversation.participants.find((p, index) => index === 1)  // Get second participant
                    : null;

                const formattedConversation = {
                    _id: conversation._id,
                    conversationType: conversation.conversationType,
                    participants: conversation.participants.map(p => ({
                        _id: p._id || '',
                        firstName: p.firstName || '',
                        lastName: p.lastName || '',
                        avatar: p.avatar || null,
                        headline: p.headline || null
                    })),
                    // Set title based on conversation type
                    title: conversation.title ? conversation.title : 'Chat',
                    // Set subtitle based on conversation type
                    subtitle: conversation.conversationType === 'group'
                        ? `${conversation.participants.length} members`
                        : otherParticipant?.headline || 'Member',
                    lastMessage: null,
                    updatedAt: conversation.updatedAt || new Date().toISOString()
                };

                // Add the formatted conversation to the list
                state.conversations.items.unshift(formattedConversation);
                
                // Update current conversation if needed
                state.currentConversation.data = formattedConversation;
                state.currentConversation.messages = [];
            })
            .addCase(startConversation.rejected, (state, action) => {
                state.messageOperation.sending = false;
                state.messageOperation.error = action.payload;
            });
    }
});

export const { clearCurrentConversation, clearCurrentConversationMessages, clearMessageError } = messagesSlice.actions;

// Selectors
export const selectConversations = state => state.messages.conversations;
export const selectCurrentConversation = state => state.messages.currentConversation;
export const selectMessageOperation = state => state.messages.messageOperation;

// Helper selector for pagination
export const selectCurrentPagination = state => state.messages.currentConversation.pagination;

export default messagesSlice.reducer; 