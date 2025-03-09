import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Check, Search, ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';
import Spinner from '../../../components/common/Spinner';
import defaultAvatar from '../../../assets/user.png';
import apiClient from '../../../api/apiClient';
import { startConversation } from '../messagesSlice';
import { toast } from 'sonner';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const NewConversationModal = ({ isOpen, onClose, onConversationCreated }) => {
  const [step, setStep] = useState(1); // 1: User Selection, 2: Group Details
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connections, setConnections] = useState([]); // Will store fetched connections
  const dispatch = useDispatch();
  const conversations = useSelector(state => state.messages.conversations.items);

  useEffect(() => {
    if (isOpen) {
      fetchConnections();
    }
  }, [isOpen]);

  const fetchConnections = async () => {
    try {
      const response = await apiClient.get('/v2/conversations/connection-list');
      console.log("fetched connections: ", response.data.data.connections);
      setConnections(response.data.data.connections);
    } catch (error) {
      toast.error('Failed to fetch connections');
    }
  };

  const filteredConnections = connections.filter(connection => 
    `${connection.user.firstName} ${connection.user.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleUserSelect = (user) => {
    /* Temporary Logic for only allowing direct conversations */
    setSelectedUsers([ user ])

    /* Logic for making direct as well as group conversations */
    // setSelectedUsers(prev => {
    //   const isSelected = prev.some(u => u._id === user._id);
    //   if (isSelected) {
    //     console.log("user already selected, removing: ", user);
    //     return prev.filter(u => u._id !== user._id);
    //   }
    //   console.log("user not selected, adding: ", user);
    //   return [...prev, { _id: user._id, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar }];
    // });
  };

  const handleBack = () => {
    setStep(1);
    setGroupName('');
    setGroupDescription('');
  };

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) return;
    console.log("hanlding create conversation")

    let existingConversation = null;
    if(selectedUsers.length === 1) {
      const selectedUserId = selectedUsers[0]._id;

      conversations.forEach(conversation => {
        if(conversation.conversationType === 'direct') {
          if(conversation.participants.some(p => p._id === selectedUserId)) {
            existingConversation = conversation;
          }
        }
      })

      if(existingConversation) {
        if(onConversationCreated) {
          onConversationCreated(existingConversation);
        }
      }
    }

    try {
      if(!existingConversation) {
        const result = await dispatch(startConversation({
          participants: selectedUsers.map(user => user._id),
          conversationType: selectedUsers.length > 1 ? 'group' : 'direct',
          groupName: groupName || undefined,
          groupDescription: groupDescription || undefined
        })).unwrap();
  
        console.log("result: ", result);
        if (onConversationCreated) {
          onConversationCreated(result.conversation);
        }
      }
        
      onClose();
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error(error.message || "Failed to create conversation");
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedUsers([]);
    setGroupName('');
    setGroupDescription('');
    setSearchQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={handleClose} className="relative z-[51]">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        </Transition.Child>
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-xl w-full max-w-md shadow-xl max-h-[90vh] flex flex-col">
              {/* Header - Fixed */}
              <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-3">
                  {step === 2 && (
                    <button 
                      onClick={handleBack}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                  <Dialog.Title className="text-lg font-semibold">
                    {step === 1 ? 'New Conversation' : 'Create Group'}
                  </Dialog.Title>
                </div>
                <button 
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                {step === 1 ? (
                  <>
                    {/* Search Bar - Sticky */}
                    <div className="sticky top-0 p-4 border-b bg-white z-10">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search connections..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Connections List */}
                    <div className="p-2">
                      {filteredConnections.map(connection => {
                        const user = connection.user;
                        const isSelected = selectedUsers.some(u => u._id === user._id);
                        
                        return (
                          <div
                            key={user._id}
                            onClick={() => handleUserSelect(user)}
                            className={`
                              flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
                              ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatar || defaultAvatar}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {user.headline || 'Member'}
                                </p>
                              </div>
                            </div>
                            
                            {/* Checkmark moved to right */}
                            {isSelected && (
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm">check</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Group Name*
                      </label>
                      <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter group name"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Group Description
                      </label>
                      <textarea
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                        placeholder="Enter group description"
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Selected Users Preview */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selected Members ({selectedUsers.length})
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedUsers.map(user => (
                          <div
                            key={user._id}
                            className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1"
                          >
                            <img
                              src={user.avatar || defaultAvatar}
                              alt={user.firstName}
                              className="w-5 h-5 rounded-full"
                            />
                            <span className="text-sm">
                              {user.firstName}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer - Fixed */}
              <div className="border-t p-4 flex-shrink-0">
                <button
                  onClick={() => selectedUsers.length > 1 ? setStep(2) : handleCreateConversation()}
                  disabled={selectedUsers.length === 0 || isLoading}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating...' : 
                    step === 1 ? 
                      (selectedUsers.length > 1 ? 'Next' : 'Start Conversation')
                      : 'Create & Enter Group'
                  }
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

NewConversationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConversationCreated: PropTypes.func
};

export default NewConversationModal;
