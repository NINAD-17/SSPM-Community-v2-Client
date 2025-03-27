import React, { useState, useEffect } from 'react';
import { getInactiveUsers, sendInactiveUserNotifications } from '../services/adminService';
import { format, formatDistance } from 'date-fns';
import { toast } from 'react-toastify';

/**
 * Component to display and manage inactive users
 */
const InactiveUsersList = () => {
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState(false);

  // Load inactive users
  useEffect(() => {
    loadInactiveUsers();
  }, [page]);

  const loadInactiveUsers = async () => {
    try {
      setLoading(true);
      const response = await getInactiveUsers({
        page,
        limit
      });

      if (response.success) {
        setInactiveUsers(response.data.inactiveUsers);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to fetch inactive users');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination
  const handlePrevPage = () => {
    if (pagination.hasPrevPage) {
      setPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

  // Handle user selection
  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === inactiveUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(inactiveUsers.map(user => user._id));
    }
  };

  // Send notifications to selected users
  const handleSendNotifications = async () => {
    if (selectedUsers.length === 0) {
      toast.warning('Please select at least one user to send notifications');
      return;
    }

    try {
      setSending(true);
      const response = await sendInactiveUserNotifications(selectedUsers);

      if (response.success) {
        toast.success(`Successfully sent notifications to ${response.data.notifiedCount} users`);
        setSelectedUsers([]);
        loadInactiveUsers(); // Reload the list to update lastNotificationSent
      } else {
        toast.error('Failed to send notifications');
      }
    } catch (err) {
      toast.error(err.message || 'Error sending notifications');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  // Send notifications to all inactive users
  const handleSendToAllInactive = async () => {
    if (!window.confirm('Are you sure you want to send notifications to ALL inactive users in the system?')) {
      return;
    }

    try {
      setProcessing(true);
      const response = await sendInactiveUserNotifications([]);

      if (response.success) {
        toast.success(`Successfully triggered notifications for all inactive users. ${response.data.notifiedCount} users will be notified.`);
        loadInactiveUsers(); // Reload the list to update lastNotificationSent
      } else {
        toast.error('Failed to send notifications');
      }
    } catch (err) {
      toast.error(err.message || 'Error sending notifications');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  // Filter users by search term
  const filteredUsers = inactiveUsers.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    const term = searchTerm.toLowerCase();
    return fullName.includes(term) || email.includes(term);
  });

  // Render loading state
  if (loading && inactiveUsers.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-3 text-gray-600">Loading inactive users...</p>
      </div>
    );
  }

  // Render error state
  if (error && inactiveUsers.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 text-xl">⚠️</div>
        <p className="mt-2 text-red-500">{error}</p>
        <button 
          onClick={loadInactiveUsers} 
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Inactive Users
          <span className="ml-2 text-sm font-normal text-gray-500">
            (Inactive for {inactiveUsers[0]?.inactivityThresholdDays || 14}+ days)
          </span>
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="border border-gray-300 rounded-lg px-4 py-2 pl-9 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-2 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <button
            onClick={handleSendToAllInactive}
            disabled={processing || inactiveUsers.length === 0}
            className={`px-4 py-2 rounded-lg flex items-center justify-center text-white ${
              processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {processing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Notify All Inactive Users'
            )}
          </button>
        </div>
      </div>

      {inactiveUsers.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No inactive users found</p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="select-all"
                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="select-all" className="ml-2 text-sm text-gray-700">
                Select All ({filteredUsers.length})
              </label>
            </div>
            
            {selectedUsers.length > 0 && (
              <button
                onClick={handleSendNotifications}
                disabled={sending}
                className={`px-4 py-2 rounded-lg flex items-center text-white ${
                  sending ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {sending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>Send Notifications ({selectedUsers.length})</>
                )}
              </button>
            )}
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Notified
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr 
                    key={user._id} 
                    className={`hover:bg-gray-50 ${selectedUsers.includes(user._id) ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          {user.avatar ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.avatar}
                              alt={`${user.firstName} ${user.lastName}`}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {user.lastActive ? (
                          <>
                            <div>{format(new Date(user.lastActive), 'MMM d, yyyy')}</div>
                            <div className="text-xs text-gray-400">
                              {formatDistance(new Date(user.lastActive), new Date(), { addSuffix: true })}
                            </div>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">No record</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.lastNotificationSent ? (
                        <div className="text-sm text-gray-500">
                          <div>{format(new Date(user.lastNotificationSent), 'MMM d, yyyy')}</div>
                          <div className="text-xs text-gray-400">
                            {formatDistance(new Date(user.lastNotificationSent), new Date(), { addSuffix: true })}
                          </div>
                        </div>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Never notified
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Showing {(pagination.currentPage - 1) * limit + 1} to{' '}
                {Math.min(pagination.currentPage * limit, pagination.totalItems)} of{' '}
                {pagination.totalItems} users
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={!pagination.hasPrevPage}
                  className={`px-3 py-1 rounded ${
                    pagination.hasPrevPage
                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={!pagination.hasNextPage}
                  className={`px-3 py-1 rounded ${
                    pagination.hasNextPage
                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InactiveUsersList; 