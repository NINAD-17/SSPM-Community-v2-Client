import { useState } from 'react';

const EventAttendance = ({ event }) => {
  const [userStatus, setUserStatus] = useState('none'); // none, going, maybe, no
  const [showAttendees, setShowAttendees] = useState(false);

  const { stats, capacity, ticketPrice, status } = event;

  // Calculate attendance stats
  const goingCount = stats?.going?.length || 0;
  const maybeCount = stats?.maybe?.length || 0;
  const noCount = stats?.no?.length || 0;
  const totalResponses = goingCount + maybeCount + noCount;

  // Calculate percentage for progress bar
  const capacityPercentage = capacity > 0 ? Math.min((goingCount / capacity) * 100, 100) : 0;
  
  // Check if the event requires registration/payment
  const requiresRegistration = ticketPrice > 0;
  
  // Check if event is in the past
  const isPastEvent = status === 'completed' || status === 'cancelled';

  // Handle attendance button click
  const handleAttendanceClick = (newStatus) => {
    if (isPastEvent) return;
    
    // Toggle off if clicking the same status
    if (userStatus === newStatus) {
      setUserStatus('none');
    } else {
      setUserStatus(newStatus);
    }
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Attendance</h3>
            <p className="text-sm text-gray-600">
              {goingCount} {goingCount === 1 ? 'person' : 'people'} going
              {capacity > 0 && ` out of ${capacity} ${capacity === 1 ? 'spot' : 'spots'}`}
            </p>
          </div>
          
          {requiresRegistration ? (
            <button 
              disabled={isPastEvent}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                isPastEvent 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isPastEvent ? 'Event Ended' : `Register${ticketPrice > 0 ? ` • $${ticketPrice}` : ''}` }
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => handleAttendanceClick('going')}
                disabled={isPastEvent}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  isPastEvent 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : userStatus === 'going'
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Going
              </button>
              <button
                onClick={() => handleAttendanceClick('maybe')}
                disabled={isPastEvent}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  isPastEvent 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : userStatus === 'maybe'
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Maybe
              </button>
              <button
                onClick={() => handleAttendanceClick('no')}
                disabled={isPastEvent}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  isPastEvent 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : userStatus === 'no'
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                No
              </button>
            </div>
          )}
        </div>
        
        {capacity > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  capacityPercentage > 85 
                    ? 'bg-red-500' 
                    : capacityPercentage > 60 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                }`} 
                style={{ width: `${capacityPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-600">
              <span>
                {capacity - goingCount} {(capacity - goingCount) === 1 ? 'spot' : 'spots'} left
              </span>
              <span>{Math.round(capacityPercentage)}% full</span>
            </div>
          </div>
        )}
        
        {totalResponses > 0 && (
          <button 
            onClick={() => setShowAttendees(!showAttendees)}
            className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            {showAttendees ? 'Hide' : 'Show'} attendance details
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 ml-1 transition-transform ${showAttendees ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
      
      {showAttendees && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex-1">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Going ({goingCount})</h4>
              <div className="flex flex-wrap gap-2">
                {goingCount > 0 ? (
                  Array(Math.min(goingCount, 5)).fill(0).map((_, index) => (
                    <div key={`going-${index}`} className="w-8 h-8 rounded-full bg-gray-300"></div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No responses yet</p>
                )}
                {goingCount > 5 && (
                  <span className="text-sm text-gray-600">+{goingCount - 5} more</span>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Maybe ({maybeCount})</h4>
              <div className="flex flex-wrap gap-2">
                {maybeCount > 0 ? (
                  Array(Math.min(maybeCount, 5)).fill(0).map((_, index) => (
                    <div key={`maybe-${index}`} className="w-8 h-8 rounded-full bg-gray-300"></div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No responses yet</p>
                )}
                {maybeCount > 5 && (
                  <span className="text-sm text-gray-600">+{maybeCount - 5} more</span>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Not going ({noCount})</h4>
              <div className="flex flex-wrap gap-2">
                {noCount > 0 ? (
                  Array(Math.min(noCount, 5)).fill(0).map((_, index) => (
                    <div key={`no-${index}`} className="w-8 h-8 rounded-full bg-gray-300"></div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No responses yet</p>
                )}
                {noCount > 5 && (
                  <span className="text-sm text-gray-600">+{noCount - 5} more</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventAttendance; 