import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import defaultAvatar from '../../../assets/user.png';
import { loadUserConnections } from '../connectionsSlice';

const MyConnections = ({ limit = 5 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { connections, totalConnections, isLoading } = useSelector(state => state.connections);
  
  useEffect(() => {
    if (user?._id) {
      dispatch(loadUserConnections({ userId: user._id, limit }));
    }
  }, [dispatch, user?._id, limit]);

  if (isLoading && connections.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800">Your Network</h2>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!connections?.length) {
    return (
      <div className="bg-white rounded-xl shadow p-4 mt-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-gray-800">Your Network</h2>
        </div>
        <div className="text-center py-4">
          <span className="material-symbols-outlined text-3xl text-gray-400 mb-2">person_search</span>
          <p className="text-gray-500 text-sm">No connections yet</p>
          <button 
            onClick={() => navigate('/connections')}
            className="mt-3 text-blue-600 hover:text-blue-800 text-sm"
          >
            Find connections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow mt-4">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold text-gray-800">Your Network</h2>
        <Link to="/connections" className="text-blue-600 hover:text-blue-800 text-sm">
          See all
        </Link>
      </div>
      <div className="p-2">
        {connections.map(connection => (
          <Link 
            key={connection._id} 
            to={`/profile/${connection._id}`}
            className="flex items-center p-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
              <img 
                src={connection.avatar || defaultAvatar} 
                alt={`${connection.firstName} ${connection.lastName}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 truncate">
                {connection.firstName} {connection.lastName}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {connection.headline || 'SSPM Community Member'}
              </p>
            </div>
          </Link>
        ))}
      </div>
      {totalConnections > limit && (
        <div className="px-4 py-3 border-t text-center">
          <Link to="/connections" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all {totalConnections} connections
          </Link>
        </div>
      )}
    </div>
  );
};

MyConnections.propTypes = {
  limit: PropTypes.number
};

export default MyConnections; 