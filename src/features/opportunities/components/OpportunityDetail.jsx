import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/formatters";
import defaultAvatar from "../../../assets/user.png";

const OpportunityDetail = ({ opportunity }) => {
    if (!opportunity) {
        return null;
    }

    const { 
        title, 
        description, 
        category, 
        date, 
        location, 
        applicationLink, 
        contactInfo, 
        tags, 
        postedBy, 
        createdAt 
    } = opportunity;

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {category}
                    </span>
                    {tags?.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                    <span className="material-symbols-outlined text-gray-400 mr-1 text-sm">
                        calendar_today
                    </span>
                    <span>Posted {formatDate(createdAt)}</span>
                </div>
            </div>

            {/* Content */}
            <div className="prose max-w-none mb-8">
                <p className="whitespace-pre-line">{description}</p>
            </div>

            {/* Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 grid gap-4 sm:grid-cols-2">
                {date && (
                    <div className="flex items-start">
                        <span className="material-symbols-outlined text-gray-400 mr-2">
                            event
                        </span>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Date</p>
                            <p className="text-gray-800">{formatDate(date)}</p>
                        </div>
                    </div>
                )}
                {location && (
                    <div className="flex items-start">
                        <span className="material-symbols-outlined text-gray-400 mr-2">
                            location_on
                        </span>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Location</p>
                            <p className="text-gray-800">{location}</p>
                        </div>
                    </div>
                )}
                {contactInfo && (
                    <div className="flex items-start">
                        <span className="material-symbols-outlined text-gray-400 mr-2">
                            contact_mail
                        </span>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Contact</p>
                            <p className="text-gray-800">{contactInfo}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Apply button */}
            {applicationLink && (
                <div className="mb-8">
                    <a
                        href={applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <span className="material-symbols-outlined mr-2">launch</span>
                        Apply Now
                    </a>
                </div>
            )}

            {/* Posted by */}
            {postedBy && (
                <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-500 mb-2">Posted by</p>
                    <Link 
                        to={`/user/profile/${postedBy._id}`}
                        className="flex items-center group"
                    >
                        <img
                            src={postedBy.avatar || defaultAvatar}
                            alt={`${postedBy.firstName}'s avatar`}
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                        <div>
                            <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                {postedBy.firstName} {postedBy.lastName}
                            </p>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
};

OpportunityDetail.propTypes = {
    opportunity: PropTypes.object
};

export default OpportunityDetail;
