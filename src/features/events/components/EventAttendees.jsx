import { useState, useEffect } from 'react';
import { BiSearch, BiCheck, BiX } from 'react-icons/bi';
import { toast } from 'react-toastify';
import attendeesNotFound from '../../../assets/ticketNotFound.jpg';

const AttendeeCard = ({ attendee }) => {
  return (
    <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <img 
        src={attendee.profilePicture || 'https://via.placeholder.com/40?text=User'} 
        alt={`${attendee.firstName} ${attendee.lastName}`}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="ml-3 flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-800">{attendee.firstName} {attendee.lastName}</h3>
            <p className="text-sm text-gray-500">{attendee.username || attendee.email}</p>
          </div>
          {attendee.isOrganizer && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Organizer
            </span>
          )}
        </div>
        <div className="flex justify-between mt-1">
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
            attendee.attendanceStatus === 'going' 
              ? 'bg-green-100 text-green-800'
              : attendee.attendanceStatus === 'maybe'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {attendee.attendanceStatus.charAt(0).toUpperCase() + attendee.attendanceStatus.slice(1)}
          </span>
          <span className="text-xs text-gray-500">
            Registered on {new Date(attendee.registrationDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

const EventAttendees = ({ eventId, isOrganizer = false }) => {
  const [attendees, setAttendees] = useState([]);
  const [filteredAttendees, setFilteredAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    // In a real implementation, this would fetch attendees from the API
    // For now, we'll just simulate an empty response after a short delay
    const timer = setTimeout(() => {
      setAttendees([]);
      setFilteredAttendees([]);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [eventId]);
  
  useEffect(() => {
    if (!attendees.length) return;
    
    let result = [...attendees];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        attendee => 
          attendee.firstName.toLowerCase().includes(term) ||
          attendee.lastName.toLowerCase().includes(term) ||
          (attendee.username && attendee.username.toLowerCase().includes(term)) ||
          attendee.email.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(attendee => attendee.attendanceStatus === statusFilter);
    }
    
    setFilteredAttendees(result);
  }, [searchTerm, statusFilter, attendees]);
  
  const handleApproveAttendee = (attendeeId) => {
    // Simulate API call to approve attendee
    toast.success('Attendee approved successfully');
    // In a real implementation, you would update the attendee status via API
  };
  
  const handleRejectAttendee = (attendeeId) => {
    // Simulate API call to reject attendee
    toast.success('Attendee rejected successfully');
    // In a real implementation, you would update the attendee status via API
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <BiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
            placeholder="Search attendees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="going">Going</option>
            <option value="maybe">Maybe</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
      
      {attendees.length === 0 ? (
        <div className="text-center p-10">
          <img className="mx-auto my-auto w-64" src={attendeesNotFound} alt="No attendees found" />
          <h2 className="text-gray-300 font-semibold text-2xl">No attendees yet</h2>
          <p className="text-gray-400 mt-2">Be the first to register for this event!</p>
        </div>
      ) : filteredAttendees.length === 0 ? (
        <div className="text-center p-10">
          <h2 className="text-gray-400 font-semibold text-xl">No matching results</h2>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAttendees.map(attendee => (
            <div key={attendee._id} className="border border-gray-100 rounded-lg">
              <AttendeeCard attendee={attendee} />
              
              {isOrganizer && attendee.attendanceStatus === 'pending' && (
                <div className="flex justify-end space-x-2 px-3 py-2 border-t border-gray-100">
                  <button
                    onClick={() => handleApproveAttendee(attendee._id)}
                    className="flex items-center px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    <BiCheck className="mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectAttendee(attendee._id)}
                    className="flex items-center px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    <BiX className="mr-1" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventAttendees; 