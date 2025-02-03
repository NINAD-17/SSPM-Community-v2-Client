import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadOpportunities } from "../opportunitySlice";
import OpportunityListItem from "./OpportunityListItem";
import Spinner from "../../../components/common/Spinner";

const OpportunityList = ({ onSelectOpportunity }) => {
    const dispatch = useDispatch();
    const { items, status, error } = useSelector((state) => state.opportunities);

    useEffect(() => {
        dispatch(loadOpportunities());
    }, [dispatch]);

    if (status === 'loading') {
        return <Spinner />;
    }

    if (error) {
        return (
            <div className="p-4 text-red-500">
                Error: {error}
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="p-4 text-gray-500 text-center">
                No opportunities found
            </div>
        );
    }

    return (
        <div className="w-full md:w-1/3 max-h-[calc(100vh-12rem)] overflow-y-auto border-r border-gray-300">
            {items.map((opportunity) => (
                <OpportunityListItem
                    key={opportunity._id}
                    opportunity={opportunity}
                    onSelectOpportunity={onSelectOpportunity}
                />
            ))}
        </div>
    );
};

export default OpportunityList;
