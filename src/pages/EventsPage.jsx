import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import EventList from '../features/events/components/EventList';

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Virtuosic 2025 Events</h1>
            <p className="text-gray-600 mt-1">
              Explore and register for upcoming events in our annual tech and cultural festival
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="w-full lg:w-96">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full py-2 pl-10 pr-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 material-symbols-outlined">
                search
              </span>
            </div>
          </div>
        </div>

        {/* Banner for Virtuosic 2025 */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center">
            <div className="p-6 md:p-8 md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Virtuosic 2025</h2>
              <p className="text-blue-100 mb-4">
                Join us for the biggest technical and cultural festival of the year! Featuring competitions, 
                workshops, exhibitions and performances from across the country.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  February 15 - March 15, 2025
                </span>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  SSPM Campus
                </span>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  Open to All
                </span>
              </div>
            </div>
            <div className="md:w-1/3 p-4 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070" 
                alt="Virtuosic 2025" 
                className="h-48 w-48 object-cover rounded-full border-4 border-white/30"
              />
            </div>
          </div>
        </div>

        {/* Event Categories Buttons */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <Link 
            to="/events/category/technical" 
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg p-4 text-center transition"
          >
            <span className="material-symbols-outlined text-3xl mb-1">computer</span>
            <p className="font-medium">Technical</p>
          </Link>
          <Link 
            to="/events/category/cultural" 
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg p-4 text-center transition"
          >
            <span className="material-symbols-outlined text-3xl mb-1">music_note</span>
            <p className="font-medium">Cultural</p>
          </Link>
          <Link 
            to="/events/category/workshop" 
            className="bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg p-4 text-center transition"
          >
            <span className="material-symbols-outlined text-3xl mb-1">build</span>
            <p className="font-medium">Workshops</p>
          </Link>
          <Link 
            to="/events/category/competition" 
            className="bg-green-50 hover:bg-green-100 text-green-700 rounded-lg p-4 text-center transition"
          >
            <span className="material-symbols-outlined text-3xl mb-1">emoji_events</span>
            <p className="font-medium">Competitions</p>
          </Link>
        </div>
        
        {/* Event List Component */}
        <EventList />
      </div>
    </Layout>
  );
};

export default EventsPage; 