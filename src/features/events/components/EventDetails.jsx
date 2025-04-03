const EventDetails = ({ event }) => {
  const { description, coordinators, volunteers, media } = event;

  // Split description into paragraphs
  const paragraphs = description.split('\n\n');

  // Check if event has media files
  const hasMedia = media && media.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">About This Event</h2>
      
      <div className="prose max-w-none text-gray-700">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
      
      {hasMedia && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Event Materials</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {media.map((item, index) => (
              <a 
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="p-2 rounded-full bg-blue-100 mr-3">
                  {item.type === 'pdf' ? (
                    <span className="material-symbols-outlined text-blue-600">picture_as_pdf</span>
                  ) : item.type === 'image' ? (
                    <span className="material-symbols-outlined text-blue-600">image</span>
                  ) : (
                    <span className="material-symbols-outlined text-blue-600">attach_file</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.type.toUpperCase()}</p>
                </div>
                <span className="material-symbols-outlined text-gray-400">download</span>
              </a>
            ))}
          </div>
        </div>
      )}
      
      {(coordinators?.length > 0 || volunteers?.length > 0) && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Team</h3>
          
          {coordinators?.length > 0 && (
            <div className="mb-6">
              <h4 className="text-base font-medium text-gray-700 mb-3">Coordinators</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {coordinators.map(coordinator => (
                  <div key={coordinator._id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <img 
                      src={coordinator.profilePicture || 'https://via.placeholder.com/40?text=User'} 
                      alt={`${coordinator.firstName} ${coordinator.lastName}`}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {coordinator.firstName} {coordinator.lastName}
                      </p>
                      <p className="text-sm text-gray-600">Coordinator</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {volunteers?.length > 0 && (
            <div>
              <h4 className="text-base font-medium text-gray-700 mb-3">Volunteers</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {volunteers.map(volunteer => (
                  <div key={volunteer._id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <img 
                      src={volunteer.profilePicture || 'https://via.placeholder.com/40?text=User'} 
                      alt={`${volunteer.firstName} ${volunteer.lastName}`}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {volunteer.firstName} {volunteer.lastName}
                      </p>
                      <p className="text-sm text-gray-600">Volunteer</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventDetails; 