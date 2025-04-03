import { format } from 'date-fns';

const EventHeader = ({ event }) => {
  const {
    name,
    image,
    startDate,
    endDate,
    location,
    coordinators,
    status,
    tags
  } = event;

  // Format dates
  const formattedStartDate = format(new Date(startDate), 'MMM d, yyyy');
  const formattedStartTime = format(new Date(startDate), 'h:mm a');
  const formattedEndDate = format(new Date(endDate), 'MMM d, yyyy');
  const formattedEndTime = format(new Date(endDate), 'h:mm a');

  // Check if multi-day event
  const isMultiDay = new Date(startDate).toDateString() !== new Date(endDate).toDateString();

  // Get status badge properties
  const getStatusBadge = () => {
    switch (status) {
      case 'upcoming':
        return {
          text: 'Upcoming',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800'
        };
      case 'ongoing':
        return {
          text: 'Happening Now',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800'
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-64 md:h-80">
        <img 
          src={image || 'https://via.placeholder.com/1200x400?text=No+Image'} 
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`${statusBadge.bgColor} ${statusBadge.textColor} text-xs font-medium px-2.5 py-1 rounded-full`}>
              {statusBadge.text}
            </span>
            {tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{name}</h1>
          <div className="flex flex-col md:flex-row md:items-center text-white/90 space-y-2 md:space-y-0 md:space-x-4 text-sm">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {isMultiDay ? (
                <span>{formattedStartDate} {formattedStartTime} - {formattedEndDate} {formattedEndTime}</span>
              ) : (
                <span>{formattedStartDate}, {formattedStartTime} - {formattedEndTime}</span>
              )}
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>
      
      {coordinators?.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Organized by:</p>
          <div className="flex flex-wrap gap-3">
            {coordinators.map(coordinator => (
              <div key={coordinator._id} className="flex items-center">
                <img 
                  src={coordinator.profilePicture || 'https://via.placeholder.com/40?text=User'} 
                  alt={`${coordinator.firstName} ${coordinator.lastName}`}
                  className="w-8 h-8 rounded-full object-cover mr-2"
                />
                <span className="text-sm font-medium text-gray-800">
                  {coordinator.firstName} {coordinator.lastName}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventHeader; 