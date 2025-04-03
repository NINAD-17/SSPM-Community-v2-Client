import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import EventHeader from '../features/events/components/EventHeader';
import EventDetails from '../features/events/components/EventDetails';
import EventDiscussions from '../features/events/components/EventDiscussions';
import EventFeedback from '../features/events/components/EventFeedback';
import EventAttendance from '../features/events/components/EventAttendance';
import EventFaqs from '../features/events/components/EventFaqs';
import Layout from '../components/layout/Layout';
import PostCard from '../features/posts/components/PostCard';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const [activeTab, setActiveTab] = useState('details');

  // Mock user data
  const currentUser = {
    _id: 'user5', // Change to coordinator1 to test admin/coordinator view
    isAdmin: false
  };

  // Mock event data
  const event = {
    _id: eventId,
    name: 'Annual Tech Conference',
    description: 'Join us for the biggest tech conference of the year featuring talks from industry leaders and networking opportunities. This event will cover the latest trends in AI, blockchain, cloud computing, and more. Network with professionals from leading tech companies and startups.',
    startDate: new Date('2023-11-15T09:00:00'),
    endDate: new Date('2023-11-16T18:00:00'),
    location: 'Convention Center, New York',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070',
    coordinators: [
      { _id: 'coordinator1', firstName: 'John', lastName: 'Doe', profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { _id: 'coordinator2', firstName: 'Jane', lastName: 'Smith', profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg' }
    ],
    volunteers: [
      { _id: 'volunteer1', firstName: 'Alex', lastName: 'Johnson', profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg' },
      { _id: 'volunteer2', firstName: 'Sarah', lastName: 'Williams', profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg' }
    ],
    status: 'upcoming',
    tags: ['technical', 'conference', 'networking'],
    averageRating: 4.8,
    totalFeedbacks: 245,
    stats: {
      going: Array(120).fill('userId'),
      maybe: Array(45).fill('userId'),
      no: Array(15).fill('userId')
    },
    capacity: 500,
    ticketPrice: 150,
    media: [
      { type: 'pdf', url: 'https://example.com/brochure.pdf', name: 'Event Brochure.pdf' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04', name: 'Schedule.jpg' }
    ],
    faqs: [
      { question: 'What is included in the ticket price?', answer: 'Your ticket includes access to all sessions, workshops, lunch on both days, and networking events.' },
      { question: 'Is there a dress code?', answer: 'Business casual is recommended for all conference events.' },
      { question: 'Are sessions recorded?', answer: 'Yes, all main sessions will be recorded and available to attendees after the conference.' }
    ],
    settings: {
      allowDiscussion: true,
      discussionVisibility: 'public',
      allowFeedback: true,
      feedbackVisibility: 'public',
      feedbackEligibility: 'anytime'
    }
  };

  // Mock discussions data
  const discussions = [
    {
      _id: 'discussion1',
      userId: {
        _id: 'user1',
        firstName: 'Michael',
        lastName: 'Brown',
        username: 'michaelb',
        profilePicture: 'https://randomuser.me/api/portraits/men/5.jpg'
      },
      content: 'Looking forward to the AI session! Anyone else planning to attend?',
      createdAt: new Date('2023-10-01T14:32:00'),
      isCoordinatorReply: false,
      isPinned: true,
      replies: [
        {
          _id: 'reply1',
          userId: {
            _id: 'user2',
            firstName: 'Emily',
            lastName: 'Davis',
            username: 'emilyd',
            profilePicture: 'https://randomuser.me/api/portraits/women/6.jpg'
          },
          content: 'Yes! The AI session was amazing last year. Definitely attending.',
          createdAt: new Date('2023-10-01T15:45:00'),
          isCoordinatorReply: false
        },
        {
          _id: 'reply2',
          userId: {
            _id: 'coordinator1',
            firstName: 'John',
            lastName: 'Doe',
            username: 'johnd',
            profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg'
          },
          content: "Great to hear your enthusiasm! This year's AI session will cover even more advanced topics.",
          createdAt: new Date('2023-10-02T09:20:00'),
          isCoordinatorReply: true
        }
      ]
    },
    {
      _id: 'discussion2',
      userId: {
        _id: 'user3',
        firstName: 'Robert',
        lastName: 'Wilson',
        username: 'robertw',
        profilePicture: 'https://randomuser.me/api/portraits/men/7.jpg'
      },
      content: 'Will there be vegetarian food options available during lunch?',
      createdAt: new Date('2023-10-05T11:15:00'),
      isCoordinatorReply: false,
      isPinned: false,
      replies: [
        {
          _id: 'reply3',
          userId: {
            _id: 'coordinator2',
            firstName: 'Jane',
            lastName: 'Smith',
            username: 'janes',
            profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg'
          },
          content: "Yes, we'll have a variety of dietary options including vegetarian, vegan, and gluten-free.",
          createdAt: new Date('2023-10-05T13:30:00'),
          isCoordinatorReply: true
        }
      ]
    }
  ];

  // Mock feedback data
  const feedback = [
    {
      _id: 'feedback1',
      userId: {
        _id: 'user4',
        firstName: 'Thomas',
        lastName: 'Anderson',
        username: 'thomasa',
        profilePicture: 'https://randomuser.me/api/portraits/men/8.jpg'
      },
      rating: 5,
      content: 'Incredible conference! The networking opportunities were invaluable, and the speakers were top-notch.',
      createdAt: new Date('2022-11-18T20:15:00'),
      isAnonymous: false,
      tags: ['helpful', 'informative']
    },
    {
      _id: 'feedback2',
      rating: 4,
      content: 'Great event overall. The sessions were informative, though some rooms were a bit crowded.',
      createdAt: new Date('2022-11-19T14:22:00'),
      isAnonymous: true,
      tags: ['informative']
    },
    {
      _id: 'feedback3',
      userId: {
        _id: 'user5',
        firstName: 'Katherine',
        lastName: 'Johnson',
        username: 'katherinej',
        profilePicture: 'https://randomuser.me/api/portraits/women/9.jpg'
      },
      rating: 5,
      content: 'The workshops were extremely valuable. I learned so many practical skills that I can apply immediately.',
      createdAt: new Date('2022-11-20T09:45:00'),
      isAnonymous: false,
      tags: ['helpful', 'practical']
    }
  ];

  const feedbackStats = {
    averageRating: 4.8,
    totalFeedbacks: 245,
    ratingDistribution: {
      5: 185,
      4: 42,
      3: 12,
      2: 4,
      1: 2
    }
  };

  // Mock posts data related to this event
  const eventPosts = [
    {
      _id: 'post1',
      userId: 'user1',
      content: '<p>Just attended the opening keynote at the <b>Annual Tech Conference</b>. Amazing insights on the future of AI and machine learning! Looking forward to the workshops tomorrow.</p>',
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4?q=80&w=2070' }
      ],
      likesCount: 45,
      commentsCount: 12,
      isLiked: true,
      createdAt: new Date('2023-11-15T11:30:00'),
      userDetails: {
        _id: 'user1',
        firstName: 'Michael',
        lastName: 'Brown',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
        headline: 'Senior Software Engineer',
        isFollowing: true,
        role: 'alumni',
        graduationYear: 2019,
        branch: 'Computer Science'
      }
    },
    {
      _id: 'post2',
      userId: 'coordinator1',
      content: '<p>Thank you to everyone who participated in our <b>Tech Conference</b> panel on "The Future of Cloud Computing". The discussions were incredibly insightful!</p><p>Don\'t forget to check out tomorrow\'s blockchain workshop at 10 AM.</p>',
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070' }
      ],
      likesCount: 78,
      commentsCount: 23,
      isLiked: false,
      createdAt: new Date('2023-11-15T17:15:00'),
      userDetails: {
        _id: 'coordinator1',
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        headline: 'Event Coordinator | Tech Enthusiast',
        isFollowing: false,
        role: 'faculty',
        branch: 'Computer Science'
      }
    }
  ];

  // Determine if current user is admin or coordinator
  const isAdminOrCoordinator = currentUser.isAdmin || 
    event.coordinators.some(coordinator => coordinator._id === currentUser._id);

  // Define the tabs
  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'posts', label: 'Posts', count: eventPosts.length },
    { id: 'discussions', label: 'Discussions', count: discussions.length },
    // Only show feedback tab if the event is completed or the user is an admin/coordinator
    { id: 'feedback', label: 'Feedback', condition: event.settings.allowFeedback && (event.status === 'completed' || isAdminOrCoordinator), count: feedback.length },
    { id: 'faqs', label: 'FAQs', condition: event.faqs.length > 0 }
  ].filter(tab => tab.condition !== false);

  return (
    <Layout>
      <div className="bg-blue-50 min-h-screen py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Link 
              to="/events" 
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Events
            </Link>
          </div>

          <EventHeader event={event} />
          
          {/* Only show attendance section to admins or coordinators */}
          {isAdminOrCoordinator && <EventAttendance event={event} />}

          <div className="mt-8 border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center
                    ${activeTab === tab.id 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-gray-800 hover:border-gray-300'}`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="py-6">
            {activeTab === 'details' && <EventDetails event={event} />}
            {activeTab === 'posts' && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Event Posts</h2>
                  <p className="text-gray-600">
                    Check out posts from participants and organizers about this event
                  </p>
                </div>
                {eventPosts.length > 0 ? (
                  eventPosts.map(post => (
                    <PostCard key={post._id} post={post} />
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-600">No posts yet for this event</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'discussions' && <EventDiscussions event={event} discussions={discussions} />}
            {activeTab === 'feedback' && (
              <EventFeedback 
                event={event} 
                feedback={feedback} 
                stats={feedbackStats} 
                disableFeedbackSubmission={event.status !== 'completed'} 
              />
            )}
            {activeTab === 'faqs' && <EventFaqs event={event} />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetailPage; 