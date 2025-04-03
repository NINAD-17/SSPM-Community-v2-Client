import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  const {
    _id,
    name,
    description,
    startDate,
    endDate,
    location,
    image,
    status,
    averageRating,
    stats,
    media
  } = event;

  // Format dates
  const formattedStartDate = format(new Date(startDate), 'MMM d, yyyy');
  const formattedStartTime = format(new Date(startDate), 'h:mm a');
  const formattedEndTime = format(new Date(endDate), 'h:mm a');
  
  // Calculate if it's a multi-day event
  const isMultiDay = new Date(startDate).toDateString() !== new Date(endDate).toDateString();
  
  // Get formatted date display
  const dateDisplay = isMultiDay
    ? `${formattedStartDate} - ${format(new Date(endDate), 'MMM d, yyyy')}`
    : `${formattedStartDate}, ${formattedStartTime} - ${formattedEndTime}`;
  
  // Get attendance count
  const attendanceCount = stats?.going?.length || 0;
  
  // Check if event has media
  const hasMedia = media && media.length > 0;
  
  // Get status badge properties
  const getStatusBadge = () => {
    switch (status) {
      case 'ongoing':
        return {
          text: 'Happening Now',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800'
        };
      case 'upcoming':
        return {
          text: 'Upcoming',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800'
        };
      case 'completed':
        return {
          text: 'Completed',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800'
        };
      case 'cancelled':
        return {
          text: 'Cancelled',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800'
        };
      default:
        return {
          text: status,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800'
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <Link to={`/events/${_id}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image || 'https://via.placeholder.com/400x200?text=No+Image'} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 flex space-x-2">
            <span className={`${statusBadge.bgColor} ${statusBadge.textColor} text-xs font-medium px-2.5 py-1 rounded-full`}>
              {statusBadge.text}
            </span>
            {hasMedia && (
              <span className="bg-white/90 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                <span className="material-symbols-outlined text-sm mr-1">attach_file</span>
                {media.length}
              </span>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
            {name}
          </h3>
          
          <div className="mt-2 text-sm text-gray-600 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{dateDisplay}</span>
          </div>
          
          <div className="mt-1 text-sm text-gray-600 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{location}</span>
          </div>
          
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center">
              {averageRating > 0 && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-700">{averageRating.toFixed(1)}</span>
                </>
              )}
            </div>
            
            <div className="text-sm text-gray-600">
              {attendanceCount} {attendanceCount === 1 ? 'person' : 'people'} going
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard; 