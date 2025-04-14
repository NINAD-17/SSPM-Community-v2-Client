import { useState } from 'react';
import EventCard from './EventCard';
import EventsFilter from './EventsFilter';
import eventNotFound from '../../../assets/postNotFound.png';

const EventList = () => {
  const [activeTag, setActiveTag] = useState('all');

  // Virtuosic 2025 mock data for events
  const events = [
    {
      _id: '1',
      name: 'Debate Competition - Virtuosic 2025',
      description: 'Challenge your critical thinking and oratory skills in our college-wide debate competition. Topics will cover technology, ethics, and current affairs.',
      startDate: new Date('2025-02-15T10:00:00'),
      endDate: new Date('2025-02-15T17:00:00'),
      location: 'Main Auditorium, SSPM Campus',
      image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070',
      status: 'upcoming',
      tags: ['debate', 'competition', 'virtuosic 2025'],
      averageRating: 4.8,
      totalFeedbacks: 0,
      ticketPrice: 0, // Free event
      stats: {
        going: new Array(45),
        maybe: new Array(23),
        no: new Array(8)
      },
      media: [
        { type: 'pdf', url: 'https://example.com/debate-rules.pdf', name: 'Debate Rules.pdf' }
      ]
    },
    {
      _id: '2',
      name: 'Project Exhibition - Virtuosic 2025',
      description: 'Showcase your innovative projects and solutions to real-world problems. Open to all departments with prizes for the top three projects.',
      startDate: new Date('2025-02-20T09:00:00'),
      endDate: new Date('2025-02-21T18:00:00'),
      location: 'Innovation Hub, SSPM Campus',
      image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=2070',
      status: 'upcoming',
      tags: ['technical', 'exhibition', 'virtuosic 2025'],
      averageRating: 4.9,
      totalFeedbacks: 0,
      ticketPrice: 0, // Free event
      stats: {
        going: new Array(78),
        maybe: new Array(32),
        no: new Array(5)
      },
      media: [
        { type: 'pdf', url: 'https://example.com/project-guidelines.pdf', name: 'Project Guidelines.pdf' }
      ]
    },
    {
      _id: '3',
      name: 'Hackathon - Virtuosic 2025',
      description: 'A 36-hour coding competition focusing on sustainable technology solutions. Form teams of up to 4 members and compete for exciting prizes.',
      startDate: new Date('2025-02-25T08:00:00'),
      endDate: new Date('2025-02-26T20:00:00'),
      location: 'Computer Science Building, SSPM Campus',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070',
      status: 'upcoming',
      tags: ['technical', 'hackathon', 'coding', 'virtuosic 2025'],
      averageRating: 4.7,
      totalFeedbacks: 0,
      ticketPrice: 200, // Paid event
      stats: {
        going: new Array(120),
        maybe: new Array(40),
        no: new Array(15)
      },
      media: [
        { type: 'pdf', url: 'https://example.com/hackathon-rules.pdf', name: 'Hackathon Rules.pdf' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1582481859891-d79b2b2eb526', name: 'Previous Hackathon' }
      ]
    },
    {
      _id: '4',
      name: 'Poster Presentation - Virtuosic 2025',
      description: 'Present your research findings through creative and informative posters. Open to all students with separate categories for undergraduate and graduate research.',
      startDate: new Date('2025-03-02T10:00:00'),
      endDate: new Date('2025-03-02T16:00:00'),
      location: 'Science Block, SSPM Campus',
      image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?q=80&w=2070',
      status: 'upcoming',
      tags: ['research', 'academic', 'virtuosic 2025'],
      averageRating: 4.5,
      totalFeedbacks: 0,
      ticketPrice: 0, // Free event
      stats: {
        going: new Array(65),
        maybe: new Array(28),
        no: new Array(10)
      }
    },
    {
      _id: '5',
      name: 'Evolution - AI Summit - Virtuosic 2025',
      description: 'Explore the cutting-edge developments in artificial intelligence and machine learning with expert speakers from industry and academia.',
      startDate: new Date('2025-03-10T09:00:00'),
      endDate: new Date('2025-03-11T17:00:00'),
      location: 'Main Auditorium, SSPM Campus',
      image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=2070',
      status: 'upcoming',
      tags: ['technical', 'ai', 'evolution', 'virtuosic 2025'],
      averageRating: 4.8,
      totalFeedbacks: 0,
      ticketPrice: 500, // Paid event
      stats: {
        going: new Array(150),
        maybe: new Array(60),
        no: new Array(20)
      },
      media: [
        { type: 'pdf', url: 'https://example.com/ai-summit-schedule.pdf', name: 'AI Summit Schedule.pdf' }
      ]
    },
    {
      _id: '6',
      name: 'Cultural Night - Virtuosic 2025',
      description: 'A celebration of diverse cultures through music, dance, and performances. Join us for an evening of entertainment and cultural exchange.',
      startDate: new Date('2025-03-15T18:00:00'),
      endDate: new Date('2025-03-15T22:00:00'),
      location: 'Open Air Theatre, SSPM Campus',
      image: 'https://images.unsplash.com/photo-1472653431158-6364773b2a56?q=80&w=2069',
      status: 'upcoming',
      tags: ['cultural', 'performance', 'virtuosic 2025'],
      averageRating: 4.9,
      totalFeedbacks: 0,
      ticketPrice: 100, // Paid event
      stats: {
        going: new Array(200),
        maybe: new Array(80),
        no: new Array(15)
      }
    }
  ];

  // All available tags for filtering
  const availableTags = ['all', 'technical', 'cultural', 'debate', 'hackathon', 'research', 'ai', 'evolution'];

  // Filter events based on active tag
  const filteredEvents = activeTag === 'all' 
    ? events 
    : events.filter(event => 
        event.tags.some(tag => tag.toLowerCase() === activeTag.toLowerCase())
      );

  return (
    <div className="mt-4">
      <div className="mb-6">
        <EventsFilter tags={availableTags} activeTag={activeTag} setActiveTag={setActiveTag} />
      </div>

      {filteredEvents.length === 0 ? (
        <div className="w-full bg-white rounded-xl text-center p-10 mt-4 shadow">
          <img className="mx-auto my-auto w-80" src={eventNotFound || "https://via.placeholder.com/400x200?text=No+Events"} alt="No events found" />
          <h2 className="text-gray-300 font-semibold text-2xl">No events found</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList; 