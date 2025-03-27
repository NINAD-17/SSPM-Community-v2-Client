import React, { useState, useEffect } from 'react';
import { getUserActivityStats } from '../services/adminService';

/**
 * Component to display user activity statistics
 */
const UserActivityStats = () => {
  const [stats, setStats] = useState({
    inactive7Days: 0,
    inactive14Days: 0,
    inactive30Days: 0,
    inactive90Days: 0,
    totalUsers: 0,
    noActivityRecord: 0,
    recentlyNotified: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadActivityStats();
  }, []);

  const loadActivityStats = async () => {
    try {
      setLoading(true);
      const response = await getUserActivityStats();
      
      if (response.success) {
        setStats(response.data.stats);
      } else {
        setError('Failed to load activity statistics');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching user activity stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate the active user percentage
  const activeUserPercentage = stats.totalUsers > 0 
    ? Math.round(((stats.totalUsers - stats.inactive7Days) / stats.totalUsers) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
        <p>{error}</p>
        <button 
          onClick={loadActivityStats}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Retry
        </button>
      </div>
    );
  }

  const activityCards = [
    {
      title: 'Active Users (7d)',
      value: stats.totalUsers - stats.inactive7Days,
      icon: '👤',
      color: 'blue',
      subtitle: `${activeUserPercentage}% of total`
    },
    {
      title: 'Inactive (14+ days)',
      value: stats.inactive14Days,
      icon: '⏰',
      color: 'yellow',
      subtitle: `${stats.totalUsers > 0 ? Math.round((stats.inactive14Days / stats.totalUsers) * 100) : 0}% of total`
    },
    {
      title: 'Recently Notified',
      value: stats.recentlyNotified,
      icon: '📧',
      color: 'green',
      subtitle: 'Last 30 days'
    },
    {
      title: 'Total User Base',
      value: stats.totalUsers,
      icon: '👥',
      color: 'indigo',
      subtitle: 'All registered users'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {activityCards.map((card, index) => (
        <StatCard 
          key={index}
          title={card.title}
          value={card.value}
          subtitle={card.subtitle}
          icon={card.icon}
          color={card.color}
        />
      ))}
    </div>
  );
};

// Stat card component
const StatCard = ({ title, value, subtitle, icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    indigo: 'from-indigo-500 to-indigo-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold mt-1">{value.toLocaleString()}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white`}>
            <span className="text-xl">{icon}</span>
          </div>
        </div>
      </div>
      <div className={`h-1 bg-gradient-to-r ${colorClasses[color]}`}></div>
    </div>
  );
};

export default UserActivityStats; 