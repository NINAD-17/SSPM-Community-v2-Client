import PropTypes from "prop-types";

const CategoryFilter = ({ setCategory, category = "All" }) => {
    const categories = [
        "All",
        "Job",
        "Internship",
        "Competition",
        "Program",
        "Workshop"
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 sticky top-0 z-10">
            <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 min-w-max">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                                ${category === cat 
                                    ? "bg-blue-600 text-white shadow-sm" 
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

CategoryFilter.propTypes = {
    setCategory: PropTypes.func.isRequired,
    category: PropTypes.string
};

export default CategoryFilter;
