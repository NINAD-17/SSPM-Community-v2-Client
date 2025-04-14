import { useState } from 'react';
import { format, formatDistance } from 'date-fns';
import EventTabs from './EventTabs';

const EventDetails = ({ event, currentUser }) => {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [registrationType, setRegistrationType] = useState('individual');
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState(['']);
  const [paymentMethod, setPaymentMethod] = useState('online');

  // Check if event is ongoing, upcoming, or completed
  const now = new Date();
  const isUpcoming = new Date(event.startDate) > now;
  const isOngoing = new Date(event.startDate) <= now && new Date(event.endDate) >= now;
  
  // Determine if current user is coordinator or admin
  const isOrganizer = event.coordinators?.some(c => c._id === currentUser?._id) || false;
  const isAdmin = currentUser?.isAdmin;
  
  // Simulate that the user has already registered if they are the coordinator
  const hasRegistered = isOrganizer || isAdmin;
  
  // Format dates
  const startDateFormatted = format(new Date(event.startDate), 'EEEE, MMMM d, yyyy');
  const startTimeFormatted = format(new Date(event.startDate), 'h:mm a');
  const endTimeFormatted = format(new Date(event.endDate), 'h:mm a');
  
  // For multi-day events
  const endDateFormatted = format(new Date(event.endDate), 'EEEE, MMMM d, yyyy');
  const isMultiDay = startDateFormatted !== endDateFormatted;
  
  // Calculate time until event
  const timeUntil = isUpcoming 
    ? formatDistance(new Date(event.startDate), now, { addSuffix: true })
    : '';

  // Add a team member field
  const addTeamMember = () => {
    if (teamMembers.length < 4) {
      setTeamMembers([...teamMembers, '']);
    }
  };

  // Remove a team member field
  const removeTeamMember = (index) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers.splice(index, 1);
    setTeamMembers(newTeamMembers);
  };

  // Update team member value
  const updateTeamMember = (index, value) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers[index] = value;
    setTeamMembers(newTeamMembers);
  };

  // Handle registration form submission
  const handleRegister = (e) => {
    e.preventDefault();
    // Here you would normally handle the registration API call
    console.log({
      eventId: event._id,
      registrationType,
      teamName: registrationType === 'team' ? teamName : null,
      teamMembers: registrationType === 'team' ? teamMembers.filter(m => m) : null,
      paymentMethod: event.ticketPrice > 0 ? paymentMethod : null
    });
    
    // Close the modal and show success message
    setRegisterModalOpen(false);
    alert('Registration successful!');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Event Image */}
      <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden">
        <img 
          src={event.image || 'https://via.placeholder.com/800x400?text=No+Image'} 
          alt={event.name}
          className="w-full h-full object-cover"
        />
        {/* Virtuosic 2025 Badge */}
        {event.tags?.includes('virtuosic 2025') && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            Virtuosic 2025
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${
              isOngoing ? 'bg-green-500' : isUpcoming ? 'bg-blue-500' : 'bg-gray-500'
            }`}></span>
            <span className="text-white text-sm font-medium">
              {isOngoing ? 'Happening Now' : isUpcoming ? 'Upcoming' : 'Completed'}
            </span>
            {isUpcoming && (
              <span className="ml-2 text-white/80 text-sm">Starts {timeUntil}</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Event Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{event.name}</h1>
        
        {/* Event Date & Location */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h3 className="text-gray-600 font-medium mb-1">When</h3>
            <p className="text-gray-800">
              {startDateFormatted}
              {isMultiDay ? ` - ${endDateFormatted}` : ''}
            </p>
            {!isMultiDay && (
              <p className="text-gray-800">{startTimeFormatted} - {endTimeFormatted}</p>
            )}
          </div>
          <div>
            <h3 className="text-gray-600 font-medium mb-1">Where</h3>
            <p className="text-gray-800">{event.location}</p>
          </div>
        </div>

        {/* Event Description */}
        <div className="mb-6">
          <h3 className="text-gray-600 font-medium mb-2">About this event</h3>
          <p className="text-gray-800 whitespace-pre-line">{event.description}</p>
        </div>

        {/* Event Price */}
        {event.ticketPrice > 0 ? (
          <div className="mb-6">
            <h3 className="text-gray-600 font-medium mb-2">Price</h3>
            <p className="text-gray-800 font-bold text-xl">₹{event.ticketPrice.toFixed(2)}</p>
            <p className="text-gray-600 text-sm mt-1">Registration required</p>
          </div>
        ) : (
          <div className="mb-6">
            <h3 className="text-gray-600 font-medium mb-2">Price</h3>
            <p className="text-gray-800 font-bold text-xl">Free</p>
            <p className="text-gray-600 text-sm mt-1">Registration required</p>
          </div>
        )}

        {/* Registration Button */}
        <div className="mb-6">
          {isUpcoming || isOngoing ? (
            hasRegistered ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                <span className="material-symbols-outlined text-green-600 mr-3">check_circle</span>
                <div>
                  <p className="text-green-800 font-medium">You're registered for this event</p>
                  <p className="text-green-700 text-sm mt-1">View or manage your registration in your profile</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setRegisterModalOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex justify-center items-center"
              >
                <span className="material-symbols-outlined mr-2">how_to_reg</span>
                Register Now
              </button>
            )
          ) : (
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 flex items-start">
              <span className="material-symbols-outlined text-gray-600 mr-3">event_busy</span>
              <div>
                <p className="text-gray-800 font-medium">Registration closed</p>
                <p className="text-gray-600 text-sm mt-1">This event has already ended</p>
              </div>
            </div>
          )}
        </div>

        {/* Event Stats */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-gray-600 font-medium mb-3">Event Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">Going</p>
              <p className="text-xl font-bold text-blue-700">{event.stats?.going?.length || 0}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">Maybe</p>
              <p className="text-xl font-bold text-amber-700">{event.stats?.maybe?.length || 0}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">Can't Go</p>
              <p className="text-xl font-bold text-red-700">{event.stats?.no?.length || 0}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">Capacity</p>
              <p className="text-xl font-bold text-purple-700">{event.capacity > 0 ? event.capacity : 'Unlimited'}</p>
            </div>
          </div>
        </div>

        {/* Attachments/Files */}
        {event.media && event.media.length > 0 && (
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-gray-600 font-medium mb-3">Attachments</h3>
            <div className="space-y-2">
              {event.media.map((item, index) => (
                <a 
                  key={index} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200"
                >
                  <span className="material-symbols-outlined text-gray-600 mr-3">
                    {item.type === 'pdf' ? 'description' : 
                     item.type === 'image' ? 'image' : 'attach_file'}
                  </span>
                  <span className="text-blue-600 font-medium">{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* Event Tabs - Posts, Attendees, Tickets, Settings */}
        <div className="mt-8">
          <EventTabs 
            eventId={event._id} 
            isOrganizer={isOrganizer} 
            isAdmin={isAdmin}
          />
        </div>
      </div>

      {/* Registration Modal */}
      {registerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Register for {event.name}</h2>
                <button 
                  onClick={() => setRegisterModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleRegister}>
                {/* Registration Type Selection */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Registration Type</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="registrationType"
                        value="individual"
                        checked={registrationType === 'individual'}
                        onChange={() => setRegistrationType('individual')}
                        className="mr-2"
                      />
                      Individual
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="registrationType"
                        value="team"
                        checked={registrationType === 'team'}
                        onChange={() => setRegistrationType('team')}
                        className="mr-2"
                      />
                      Team
                    </label>
                  </div>
                </div>

                {/* Team Details (if team registration) */}
                {registrationType === 'team' && (
                  <div className="mb-4">
                    <div className="mb-3">
                      <label className="block text-gray-700 font-medium mb-2">Team Name</label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Enter your team name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Team Members</label>
                      {teamMembers.map((member, index) => (
                        <div key={index} className="flex mb-2">
                          <input
                            type="email"
                            value={member}
                            onChange={(e) => updateTeamMember(index, e.target.value)}
                            className="flex-grow p-2 border border-gray-300 rounded-lg"
                            placeholder={`Member ${index + 1} email`}
                            required={index === 0}
                          />
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeTeamMember(index)}
                              className="ml-2 text-red-500"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          )}
                        </div>
                      ))}
                      {teamMembers.length < 4 && (
                        <button
                          type="button"
                          onClick={addTeamMember}
                          className="text-blue-600 font-medium flex items-center mt-2"
                        >
                          <span className="material-symbols-outlined mr-1">add</span>
                          Add Member
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment Method (if paid event) */}
                {event.ticketPrice > 0 && (
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
                    <div className="space-y-2">
                      <label className="flex items-center p-3 border border-gray-300 rounded-lg">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={paymentMethod === 'online'}
                          onChange={() => setPaymentMethod('online')}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium">Online Payment</p>
                          <p className="text-sm text-gray-600">Credit/Debit Card, Net Banking, UPI</p>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border border-gray-300 rounded-lg">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={paymentMethod === 'cash'}
                          onChange={() => setPaymentMethod('cash')}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium">Cash Payment</p>
                          <p className="text-sm text-gray-600">Pay at the venue</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Terms and Conditions */}
                <div className="mb-6">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 mr-3"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the terms and conditions of the event, including the refund policy 
                      and attendance rules. I understand that my registration may be subject to 
                      approval by the event organizers.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
                >
                  Complete Registration
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails; 