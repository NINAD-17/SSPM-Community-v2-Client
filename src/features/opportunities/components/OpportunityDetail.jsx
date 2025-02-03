import React from "react";

const OpportunityDetail = ({ opportunity }) => {
    if (!opportunity) {
        return (
            <div className="w-2/3 p-4">
                Select an opportunity to see details
            </div>
        );
    }

    return (
        <div className="w-2/3 p-4 border-gray-800">
            <h2 className="text-2xl font-bold">{opportunity.title}</h2>
            <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {opportunity.category}
                </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
                Posted by: {opportunity.postedBy.firstName} {opportunity.postedBy.lastName}
            </p>
            <p className="text-lg mt-4">{opportunity.description}</p>
            {opportunity.applicationLink && (
                <a
                    href={opportunity.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Apply Now
                </a>
            )}
            {opportunity.location && (
                <p className="text-gray-600 mt-4">
                    Location: {opportunity.location}
                </p>
            )}
            {opportunity.contactInfo && (
                <p className="text-gray-600 mt-2">
                    Contact: {opportunity.contactInfo}
                </p>
            )}
            <div className="flex flex-wrap mt-4">
                {opportunity.tags?.map((tag, index) => (
                    <span
                        key={index}
                        className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 m-1 text-sm"
                    >
                        {tag}
                    </span>
                ))}
            </div>
            {opportunity.date && (
                <p className="text-sm text-gray-600 mt-4">
                    Last date: {new Date(opportunity.date).toLocaleDateString()}
                </p>
            )}
        </div>
    );
};

export default OpportunityDetail;
