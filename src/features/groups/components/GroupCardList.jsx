import { memo } from 'react';
import PropTypes from 'prop-types';
import GroupCard from './GroupCard';

const GroupCardList = ({ groups }) => {
  if (!groups || groups.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {groups.map(group => (
        <GroupCard 
          key={group._id} 
          group={group}
        />
      ))}
    </div>
  );
};

GroupCardList.propTypes = {
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    })
  ).isRequired
};

// Use memo to prevent unnecessary re-renders
export default memo(GroupCardList); 