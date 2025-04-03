import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EventCard from '../features/events/components/EventCard';
import Layout from '../components/layout/Layout';

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Mock user state
  const user = {
    isAdmin: true, // for demo purposes
    _id: 'user123'
  };
  
  // Mock data for events
  const events = [
    {
      _id: '1',
      name: 'Annual Tech Conference',
      description: 'Join us for the biggest tech conference of the year featuring talks from industry leaders and networking opportunities.',
      startDate: new Date('2023-11-15T09:00:00'),
      endDate: new Date('2023-11-16T18:00:00'),
      location: 'Convention Center, New York',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070',
      status: 'ongoing',
      tags: ['technical', 'conference', 'virtuosic 2025'],
      averageRating: 4.8,
      totalFeedbacks: 245,
      stats: {
        going: Array(120),
        maybe: Array(45),
        no: Array(15)
      },
      media: [
        { type: 'pdf', url: 'https://example.com/brochure.pdf', name: 'Event Brochure.pdf' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04', name: 'Schedule' }
      ],
      coordinators: [{ _id: 'user123' }] // For demo purposes, assuming current user is coordinator
    },
    {
      _id: '1',
      name: 'Annual Tech Conference',
      description: 'Join us for the biggest tech conference of the year featuring talks from industry leaders and networking opportunities.',
      startDate: new Date('2023-11-15T09:00:00'),
      endDate: new Date('2023-11-16T18:00:00'),
      location: 'Convention Center, New York',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070',
      status: 'ongoing',
      tags: ['technical', 'conference', 'virtuosic 2025'],
      averageRating: 4.8,
      totalFeedbacks: 245,
      stats: {
        going: Array(120),
        maybe: Array(45),
        no: Array(15)
      },
      media: [
        { type: 'pdf', url: 'https://example.com/brochure.pdf', name: 'Event Brochure.pdf' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04', name: 'Schedule' }
      ],
      coordinators: [{ _id: 'user123' }] // For demo purposes, assuming current user is coordinator
    },
    {
      _id: '1',
      name: 'Annual Tech Conference',
      description: 'Join us for the biggest tech conference of the year featuring talks from industry leaders and networking opportunities.',
      startDate: new Date('2023-11-15T09:00:00'),
      endDate: new Date('2023-11-16T18:00:00'),
      location: 'Convention Center, New York',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070',
      status: 'ongoing',
      tags: ['technical', 'conference', 'virtuosic 2025'],
      averageRating: 4.8,
      totalFeedbacks: 245,
      stats: {
        going: Array(120),
        maybe: Array(45),
        no: Array(15)
      },
      media: [
        { type: 'pdf', url: 'https://example.com/brochure.pdf', name: 'Event Brochure.pdf' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04', name: 'Schedule' }
      ],
      coordinators: [{ _id: 'user123' }] // For demo purposes, assuming current user is coordinator
    },
    {
      _id: '1',
      name: 'Annual Tech Conference',
      description: 'Join us for the biggest tech conference of the year featuring talks from industry leaders and networking opportunities.',
      startDate: new Date('2023-11-15T09:00:00'),
      endDate: new Date('2023-11-16T18:00:00'),
      location: 'Convention Center, New York',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070',
      status: 'ongoing',
      tags: ['technical', 'conference', 'virtuosic 2025'],
      averageRating: 4.8,
      totalFeedbacks: 245,
      stats: {
        going: Array(120),
        maybe: Array(45),
        no: Array(15)
      },
      media: [
        { type: 'pdf', url: 'https://example.com/brochure.pdf', name: 'Event Brochure.pdf' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04', name: 'Schedule' }
      ],
      coordinators: [{ _id: 'user123' }] // For demo purposes, assuming current user is coordinator
    },
    {
      _id: '2',
      name: 'Web Development Workshop',
      description: 'Learn the latest web development techniques and technologies in this hands-on workshop.',
      startDate: new Date('2023-10-25T10:00:00'),
      endDate: new Date('2023-10-25T16:00:00'),
      location: 'Tech Hub, San Francisco',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070',
      status: 'upcoming',
      tags: ['technical', 'workshop', 'virtuosic 2025'],
      averageRating: 4.5,
      totalFeedbacks: 78,
      stats: {
        going: Array(65),
        maybe: Array(22),
        no: Array(8)
      }
    },
    {
      _id: '3',
      name: 'Cultural Festival',
      description: 'Celebrate diversity with food, music, and performances from around the world.',
      startDate: new Date('2023-12-10T11:00:00'),
      endDate: new Date('2023-12-12T20:00:00'),
      location: 'City Park, Miami',
      image: 'https://images.unsplash.com/photo-1472653431158-6364773b2a56?q=80&w=2069',
      status: 'upcoming',
      tags: ['cultural'],
      averageRating: 4.9,
      totalFeedbacks: 156,
      stats: {
        going: Array(230),
        maybe: Array(87),
        no: Array(12)
      }
    },
    {
      _id: '4',
      name: 'Data Science Seminar',
      description: 'A comprehensive seminar on data science, machine learning, and AI applications.',
      startDate: new Date('2023-11-05T09:30:00'),
      endDate: new Date('2023-11-05T17:30:00'),
      location: 'University Auditorium, Boston',
      image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=2070',
      status: 'ongoing',
      tags: ['technical', 'seminar'],
      averageRating: 4.3,
      totalFeedbacks: 62,
      stats: {
        going: Array(85),
        maybe: Array(34),
        no: Array(9)
      }
    },
    {
      _id: '5',
      name: 'Leadership Conference',
      description: 'Develop your leadership skills with insights from successful leaders across industries.',
      startDate: new Date('2023-12-01T08:00:00'),
      endDate: new Date('2023-12-02T17:00:00'),
      location: 'Grand Hotel, Chicago',
      image: 'https://images.unsplash.com/photo-1507878866276-a947ef722fee?q=80&w=2071',
      status: 'upcoming',
      tags: ['conference'],
      averageRating: 4.6,
      totalFeedbacks: 189,
      stats: {
        going: Array(145),
        maybe: Array(53),
        no: Array(18)
      }
    },
    {
      _id: '6',
      name: 'Project Exhibition 2024',
      description: 'Annual exhibition showcasing student projects from all departments.',
      startDate: new Date('2023-10-15T09:00:00'),
      endDate: new Date('2023-10-16T18:00:00'),
      location: 'College Main Building',
      image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=2070',
      status: 'completed',
      tags: ['technical', 'virtuosic 2024'],
      averageRating: 4.7,
      totalFeedbacks: 210,
      stats: {
        going: Array(180),
        maybe: Array(40),
        no: Array(20)
      }
    },
    {
      _id: '7',
      name: 'Hackathon 2024',
      description: 'A 24-hour coding competition to solve real-world problems.',
      startDate: new Date('2023-09-20T10:00:00'),
      endDate: new Date('2023-09-21T10:00:00'),
      location: 'Computer Science Building',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070',
      status: 'completed',
      tags: ['technical', 'virtuosic 2024'],
      averageRating: 4.8,
      totalFeedbacks: 150,
      stats: {
        going: Array(120),
        maybe: Array(30),
        no: Array(15)
      }
    },
    {
      _id: '8',
      name: 'Poster Presentation',
      description: 'Present your research findings in a visual poster format.',
      startDate: new Date('2023-11-10T09:00:00'),
      endDate: new Date('2023-11-10T16:00:00'),
      location: 'Science Block',
      image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070',
      status: 'ongoing',
      tags: ['technical', 'virtuosic 2025'],
      averageRating: 4.4,
      totalFeedbacks: 75,
      stats: {
        going: Array(90),
        maybe: Array(35),
        no: Array(10)
      }
    },
    {
      _id: '9',
      name: 'Innovation Pitch',
      description: 'Present your innovative ideas to potential investors and industry experts.',
      startDate: new Date('2023-11-18T10:00:00'),
      endDate: new Date('2023-11-18T17:00:00'),
      location: 'Business School Auditorium',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070',
      status: 'ongoing',
      tags: ['business', 'virtuosic 2025'],
      averageRating: 4.6,
      totalFeedbacks: 42,
      stats: {
        going: Array(75),
        maybe: Array(30),
        no: Array(5)
      }
    },
    {
      _id: '10',
      name: 'Research Symposium',
      description: 'Annual gathering to showcase cutting-edge research from all departments.',
      startDate: new Date('2023-12-05T09:00:00'),
      endDate: new Date('2023-12-07T17:00:00'),
      location: 'Graduate Center',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070',
      status: 'upcoming',
      tags: ['academic', 'virtuosic 2025'],
      averageRating: 4.7,
      totalFeedbacks: 95,
      stats: {
        going: Array(110),
        maybe: Array(40),
        no: Array(10)
      }
    }
  ];

  // Filter events based on status
  const ongoingEvents = events.filter(event => event.status === 'ongoing');
  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const completedEvents = events.filter(event => event.status === 'completed');

  // Filter events based on search query if provided
  const filterEventsBySearch = (eventsArray) => {
    if (!searchQuery.trim()) return eventsArray;
    
    const query = searchQuery.toLowerCase().trim();
    return eventsArray.filter(event => 
      event.name.toLowerCase().includes(query) || 
      event.description.toLowerCase().includes(query) ||
      event.tags.some(tag => tag.toLowerCase().includes(query))
    );
  };

  const filteredOngoingEvents = filterEventsBySearch(ongoingEvents);
  const filteredUpcomingEvents = filterEventsBySearch(upcomingEvents);
  const filteredCompletedEvents = filterEventsBySearch(completedEvents);

  // Set display limits - now showing 6 events (2 rows of 3) maximum on main page
  const getMaxEventsToDisplay = () => {
    const isMobile = window.innerWidth < 768;
    const itemsPerRow = isMobile ? 1 : 3;
    return itemsPerRow * 2; // Two rows
  };

  const maxEventsToDisplay = getMaxEventsToDisplay();

  // Navigation handlers for "See All" buttons
  const handleSeeAllOngoing = () => {
    navigate('/events/category/ongoing', { 
      state: { 
        events: filteredOngoingEvents, 
        title: 'Happening Now' 
      } 
    });
  };

  const handleSeeAllUpcoming = () => {
    navigate('/events/category/upcoming', { 
      state: { 
        events: filteredUpcomingEvents, 
        title: 'Upcoming Events' 
      } 
    });
  };

  const handleSeeAllCompleted = () => {
    navigate('/events/category/completed', { 
      state: { 
        events: filteredCompletedEvents, 
        title: 'Past Events' 
      } 
    });
  };

  // Check if we have events to display after filtering
  const hasEvents = filteredOngoingEvents.length > 0 || filteredUpcomingEvents.length > 0 || filteredCompletedEvents.length > 0;

  // Check if the user has events they coordinate
  const userCoordinatedEvents = events.filter(event => 
    event.coordinators?.some(coordinator => coordinator._id === user._id)
  );
  const hasCoordinatedEvents = userCoordinatedEvents.length > 0;

  return (
    <Layout>
      <div className="bg-blue-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Events</h1>
              <p className="text-gray-600 mt-2">Discover and participate in exciting events</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              {hasCoordinatedEvents && (
                <Link 
                  to="/events/manage"
                  className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined mr-2">settings</span>
                  Manage Events
                </Link>
              )}
              <Link 
                to="/events/create" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
              >
                <span className="material-symbols-outlined mr-2">add</span>
                Create Event
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events by name, description, or tag (e.g., 'virtuosic 2025')..."
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

          {hasEvents ? (
            <div className="space-y-8">
              {/* Ongoing Events Section */}
              {filteredOngoingEvents.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      <h2 className="text-xl font-semibold text-gray-800">Happening Now</h2>
                      <span className="ml-2 text-sm text-gray-500">({filteredOngoingEvents.length})</span>
                    </div>
                    {filteredOngoingEvents.length > maxEventsToDisplay && (
                      <button 
                        onClick={handleSeeAllOngoing}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      >
                        See All
                        <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOngoingEvents.slice(0, maxEventsToDisplay).map(event => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Events Section */}
              {filteredUpcomingEvents.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
                      <span className="ml-2 text-sm text-gray-500">({filteredUpcomingEvents.length})</span>
                    </div>
                    {filteredUpcomingEvents.length > maxEventsToDisplay && (
                      <button 
                        onClick={handleSeeAllUpcoming}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      >
                        See All
                        <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUpcomingEvents.slice(0, maxEventsToDisplay).map(event => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Events Section */}
              {filteredCompletedEvents.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                      <h2 className="text-xl font-semibold text-gray-800">Past Events</h2>
                      <span className="ml-2 text-sm text-gray-500">({filteredCompletedEvents.length})</span>
                    </div>
                    {filteredCompletedEvents.length > maxEventsToDisplay && (
                      <button 
                        onClick={handleSeeAllCompleted}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      >
                        See All
                        <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompletedEvents.slice(0, maxEventsToDisplay).map(event => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                </div>
              )}
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

export default EventsPage; 