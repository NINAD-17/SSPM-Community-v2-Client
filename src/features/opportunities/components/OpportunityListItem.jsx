import React, { useState } from "react";

const OpportunityListItem = ({ opportunity, onSelectOpportunity }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = () => {
        setIsExpanded(!isExpanded);
        onSelectOpportunity(opportunity);
    };

    return (
        <div className="border-b border-gray-300">
            <div
                className="p-4 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                onClick={handleClick}
            >
                <div>
                    <h3 className="text-lg font-bold">{opportunity.title}</h3>
                    <p className="text-sm text-gray-600">
                        {opportunity.description.substring(0, 100)}...
                    </p>
                    <p className="text-sm text-gray-600">
                        Posted by: {opportunity.postedBy.name}
                    </p>
                </div>
                <svg
                    className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
            <div
                className={`md:hidden ${isExpanded ? "block" : "hidden"} p-4 bg-gray-50`}
            >
                <OpportunityDetailMobile opportunity={opportunity} />
            </div>
        </div>
    );
};

const OpportunityDetailMobile = ({ opportunity }) => {
    if (!opportunity) return null;

    return (
        <div className="border-t border-gray-200 pt-4">
            <p className="text-lg">{opportunity.description}</p>
            {opportunity.applicationLink && (
                <a
                    href={opportunity.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 block mt-4"
                >
                    Apply Now
                </a>
            )}
            <div className="flex flex-wrap mt-4">
                {opportunity.tags?.map((tag, index) => (
                    <span
                        key={index}
                        className="bg-blue-200 text-blue-800 rounded-full px-3 py-1 m-1"
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

export default OpportunityListItem;
