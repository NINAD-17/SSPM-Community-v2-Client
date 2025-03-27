import { useState } from 'react';
import PropTypes from 'prop-types';

const MobileTabNavigation = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState('feed');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4 sm:hidden">
      <div className="flex border-b">
        <button
          onClick={() => handleTabChange('feed')}
          className={`flex-1 py-3 text-center text-sm font-medium ${
            activeTab === 'feed' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined mb-1">dynamic_feed</span>
            <span>Feed</span>
          </div>
        </button>
        
        <button
          onClick={() => handleTabChange('connections')}
          className={`flex-1 py-3 text-center text-sm font-medium ${
            activeTab === 'connections' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined mb-1">person</span>
            <span>Connections</span>
          </div>
        </button>
        
        <button
          onClick={() => handleTabChange('groups')}
          className={`flex-1 py-3 text-center text-sm font-medium ${
            activeTab === 'groups' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined mb-1">groups</span>
            <span>Groups</span>
          </div>
        </button>
      </div>
    </div>
  );
};

MobileTabNavigation.propTypes = {
  onTabChange: PropTypes.func.isRequired
};

export default MobileTabNavigation; 