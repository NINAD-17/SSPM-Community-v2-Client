const EventsFilter = ({ tags, activeTag, setActiveTag }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
      <div className="flex space-x-2">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              activeTag === tag
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventsFilter; 