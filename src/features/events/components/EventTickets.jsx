import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import QRCode from 'qrcode.react';
import ticketNotFound from '../../../assets/ticketNotFound.jpg';

const EventTickets = ({ eventId }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // In a real implementation, this would fetch tickets from the API
    // For now, we'll just simulate an empty response after a short delay
    const timer = setTimeout(() => {
      setTickets([]);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [eventId]);
  
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
  
  if (tickets.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl text-center p-10 mt-4 shadow">
        <img className="mx-auto my-auto w-80" src={ticketNotFound} alt="No tickets found" />
        <h2 className="text-gray-300 font-semibold text-2xl">You don&apos;t have any tickets for this event</h2>
        <p className="text-gray-400 mt-2">Register for this event to get your ticket</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {tickets.map(ticket => (
        <div key={ticket._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
            <h3 className="text-xl font-bold">{ticket.eventDetails.name}</h3>
            <div className="flex justify-between mt-1">
              <span className="text-sm opacity-90">
                {format(new Date(ticket.eventDetails.startDate), 'PPP')} - {format(new Date(ticket.eventDetails.endDate), 'PPP')}
              </span>
              <span className="text-sm font-medium px-2 py-1 bg-white bg-opacity-20 rounded-full">
                {ticket.ticketType}
              </span>
            </div>
          </div>
          
          <div className="p-4 flex md:flex-row flex-col">
            <div className="md:w-2/3 w-full">
              <div className="mb-3">
                <span className="text-sm text-gray-500">Ticket ID</span>
                <p className="font-mono">{ticket._id}</p>
              </div>
              
              <div className="mb-3">
                <span className="text-sm text-gray-500">Venue</span>
                <p>{ticket.eventDetails.location}</p>
              </div>
              
              <div className="mb-3">
                <span className="text-sm text-gray-500">Status</span>
                <p className={`font-medium ${
                  ticket.status === 'valid' ? 'text-green-600' :
                  ticket.status === 'used' ? 'text-yellow-600' :
                  ticket.status === 'expired' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </p>
              </div>
              
              <div className="mb-3">
                <span className="text-sm text-gray-500">Price</span>
                <p>{ticket.price > 0 ? `₹${ticket.price.toFixed(2)}` : 'Free'}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Issued On</span>
                <p>{format(new Date(ticket.createdAt), 'PPP')}</p>
              </div>
            </div>
            
            <div className="md:w-1/3 w-full flex justify-center items-center mt-4 md:mt-0">
              <div className="text-center">
                <div className="bg-white p-2 rounded-lg shadow-md inline-block">
                  <QRCode 
                    value={ticket._id} 
                    size={120} 
                    level="H"
                    renderAs="svg"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Scan to verify</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventTickets; 