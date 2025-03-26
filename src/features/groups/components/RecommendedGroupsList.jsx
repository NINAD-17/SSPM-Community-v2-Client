import { memo, useRef } from 'react';
import PropTypes from 'prop-types';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import RecommendedGroupCard from './RecommendedGroupCard';

const RecommendedGroupsList = ({ groups }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!groups || groups.length === 0) {
    return null;
  }

  return (
    <div className="relative group">
      {/* Left scroll button */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-0"
        aria-label="Scroll left"
      >
        <FiChevronLeft size={20} />
      </button>

      {/* Scrollable container with snap */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-6 scrollbar-hide scroll-smooth snap-x snap-mandatory"
        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {groups.map(group => (
          <div 
            key={group._id} 
            className="snap-start flex-none px-2 w-72 md:w-80 first:pl-1 last:pr-8"
          >
            <RecommendedGroupCard group={group} />
          </div>
        ))}
      </div>

      {/* Right scroll button */}
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-0"
        aria-label="Scroll right"
      >
        <FiChevronRight size={20} />
      </button>

      {/* Gradient fade on right edge */}
      <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-blue-50 to-transparent pointer-events-none"></div>
    </div>
  );
};

RecommendedGroupsList.propTypes = {
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    })
  ).isRequired
};

export default memo(RecommendedGroupsList); 