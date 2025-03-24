import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { loadOpportunities, loadOpportunitiesByCategory, selectOpportunities } from "../opportunitySlice";
import { formatDistanceToNow } from "date-fns";
import defaultAvatar from "../../../assets/user.png";

const OpportunityList = ({ onSelectOpportunity, category }) => {
    const dispatch = useDispatch();
    const { data: opportunities, status, error } = useSelector(selectOpportunities);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        if (category === "All") {
            dispatch(loadOpportunities());
        } else {
            dispatch(loadOpportunitiesByCategory(category));
        }
    }, [dispatch, category]);

    const handleOpportunityClick = (opportunity) => {
        setSelectedId(opportunity._id);
        onSelectOpportunity(opportunity);
    };

    if (status === "loading") {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex py-4 border-b border-gray-100">
                            <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-center py-8 text-red-500">
                    <span className="material-symbols-outlined text-3xl mb-2">error</span>
                    <p>{error || "Failed to load opportunities"}</p>
                    <button 
                        onClick={() => dispatch(loadOpportunities())}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!opportunities || opportunities.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-center py-8 text-gray-500">
                    <span className="material-symbols-outlined text-3xl mb-2">info</span>
                    <p>No opportunities found</p>
                    {category !== "All" && (
                        <p className="mt-2 text-sm">
                            Try selecting a different category or create a new opportunity
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="divide-y divide-gray-100">
                {opportunities.map((opportunity) => (
                    <div
                        key={opportunity._id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedId === opportunity._id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                        }`}
                        onClick={() => handleOpportunityClick(opportunity)}
                    >
                        <div className="flex items-start">
                            <img
                                src={opportunity.postedBy?.avatar || defaultAvatar}
                                alt={`${opportunity.postedBy?.firstName || 'User'}'s avatar`}
                                className="w-10 h-10 rounded-full object-cover mr-3"
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-medium text-gray-900 truncate">
                                    {opportunity.title}
                                </h3>
                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                    <span className="truncate">
                                        {opportunity.postedBy?.firstName} {opportunity.postedBy?.lastName}
                                    </span>
                                    <span className="mx-1">•</span>
                                    {opportunity.createdAt && (
                                        <span>
                                            {formatDistanceToNow(new Date(opportunity.createdAt), { addSuffix: true })}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {opportunity.category}
                                    </span>
                                    {opportunity.tags?.slice(0, 2).map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {opportunity.tags?.length > 2 && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                            +{opportunity.tags.length - 2}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

OpportunityList.propTypes = {
    onSelectOpportunity: PropTypes.func.isRequired,
    category: PropTypes.string.isRequired
};

export default OpportunityList;
