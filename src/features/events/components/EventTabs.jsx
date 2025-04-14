import { useState } from 'react';
import { BiUser } from 'react-icons/bi';
import { AiOutlineFileText, AiOutlineMessage } from 'react-icons/ai';
import { MdOutlineConfirmationNumber } from 'react-icons/md';
import { FiSettings } from 'react-icons/fi';
import EventAttendees from './EventAttendees';
import EventPosts from './EventPosts';
import CreateEventPost from './CreateEventPost';
import EventTickets from './EventTickets';

const EventTabs = ({ eventId, isOrganizer = false, isAdmin = false }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  
  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };
  
  const tabs = [
    { id: 'posts', label: 'Posts', icon: <AiOutlineMessage /> },
    { id: 'attendees', label: 'Attendees', icon: <BiUser /> },
    { id: 'tickets', label: 'Tickets', icon: <MdOutlineConfirmationNumber /> },
    ...(isOrganizer || isAdmin ? [{ id: 'settings', label: 'Settings', icon: <FiSettings /> }] : [])
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="border-b">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`py-4 px-6 flex items-center space-x-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        {activeTab === 'posts' && (
          <>
            {(isOrganizer || isAdmin) && (
              <CreateEventPost 
                eventId={eventId} 
                onPostCreated={handlePostCreated}
              />
            )}
            <EventPosts eventId={eventId} initialPosts={posts} />
          </>
        )}
        
        {activeTab === 'attendees' && (
          <EventAttendees 
            eventId={eventId} 
            isOrganizer={isOrganizer || isAdmin}
          />
        )}
        
        {activeTab === 'tickets' && (
          <EventTickets eventId={eventId} />
        )}
        
        {activeTab === 'settings' && (
          <div className="text-center p-10">
            <h2 className="text-gray-400 font-semibold text-xl">Event Settings</h2>
            <p className="text-gray-500 mt-2">
              This section would include options to edit event details, 
              manage permissions, export attendee lists, etc.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventTabs; 