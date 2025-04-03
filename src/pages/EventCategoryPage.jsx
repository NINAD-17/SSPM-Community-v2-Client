import { useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import EventCard from '../features/events/components/EventCard';
import Layout from '../components/layout/Layout';

const EventCategoryPage = () => {
  const location = useLocation();
  const { events = [], title = 'Events' } = location.state || {};
  const [searchQuery, setSearchQuery] = useState('');

  // Filter events based on search
  const filteredEvents = searchQuery.trim() 
    ? events.filter(event => 
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : events;

  return (
    <Layout>
      <div className="bg-blue-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Link 
              to="/events" 
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Events
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
              <p className="text-gray-600 mt-2">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search within these events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">search</span>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </div>
          </div>
          
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                <span className="material-symbols-outlined text-4xl text-blue-500">event_busy</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No events found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 
                  `We couldn't find any events matching "${searchQuery}"` : 
                  "There are no events currently available"}
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EventCategoryPage; 