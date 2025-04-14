import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const ManageEvents = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Demo data for events managed by the user
  const events = [
    {
      _id: '1',
      name: 'Debate Competition - Virtuosic 2025',
      startDate: new Date('2025-02-15T10:00:00'),
      endDate: new Date('2025-02-15T17:00:00'),
      status: 'upcoming',
      stats: {
        going: new Array(45),
        maybe: new Array(23),
        no: new Array(8)
      },
      ticketPrice: 0,
      totalRevenue: 0
    },
    {
      _id: '3',
      name: 'Hackathon - Virtuosic 2025',
      startDate: new Date('2025-02-25T08:00:00'),
      endDate: new Date('2025-02-26T20:00:00'),
      status: 'upcoming',
      stats: {
        going: new Array(120),
        maybe: new Array(40),
        no: new Array(15)
      },
      ticketPrice: 200,
      totalRevenue: 24000 // 120 registrations * 200 ticket price
    },
    {
      _id: '5',
      name: 'Evolution - AI Summit - Virtuosic 2025',
      startDate: new Date('2025-03-10T09:00:00'),
      endDate: new Date('2025-03-11T17:00:00'),
      status: 'upcoming',
      stats: {
        going: new Array(150),
        maybe: new Array(60),
        no: new Array(20)
      },
      ticketPrice: 500,
      totalRevenue: 75000 // 150 registrations * 500 ticket price
    }
  ];

  // Filter events based on active tab
  const filteredEvents = activeTab === 'all' 
    ? events 
    : events.filter(event => event.status === activeTab);

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Manage Events</h2>
        <p className="text-gray-600 mt-1">Manage events you coordinate or administer</p>
      </div>
      
      {/* Tab Navigation */}
      <div className="px-6 pt-4 border-b border-gray-200">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-2 font-medium text-sm rounded-md ${
              activeTab === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-2 font-medium text-sm rounded-md ${
              activeTab === 'upcoming'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`px-3 py-2 font-medium text-sm rounded-md ${
              activeTab === 'ongoing'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-2 font-medium text-sm rounded-md ${
              activeTab === 'completed'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Completed
          </button>
        </nav>
      </div>
      
      {/* Create New Event Button */}
      <div className="px-6 py-4">
        <Link
          to="/events/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span className="material-symbols-outlined mr-2">add</span>
          Create New Event
        </Link>
      </div>
      
      {/* Events Table */}
      <div className="px-6 pb-6">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No events found for this filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registrations
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{event.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format(new Date(event.startDate), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{event.stats.going.length}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(event.totalRevenue)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/events/${event._id}`} className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
                        <Link to={`/events/${event._id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </Link>
                        <Link to={`/events/${event._id}/attendees`} className="text-green-600 hover:text-green-900">
                          Attendees
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Summary Statistics */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Total Events</p>
            <p className="text-2xl font-bold text-gray-900">{events.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Total Registrations</p>
            <p className="text-2xl font-bold text-gray-900">
              {events.reduce((sum, event) => sum + (event.stats.going.length || 0), 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(events.reduce((sum, event) => sum + (event.totalRevenue || 0), 0))}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Upcoming Events</p>
            <p className="text-2xl font-bold text-gray-900">
              {events.filter(event => event.status === 'upcoming').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageEvents; 