import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadGroupRecommendations } from "../groupsSlice";
import GroupSuggestionCard from "./GroupSuggestionCard";
import Spinner from "../../../components/common/Spinner";

const Groups = () => {
    const dispatch = useDispatch();
    const { suggestions, status } = useSelector(state => state.groups);

    useEffect(() => {
        dispatch(loadGroupRecommendations());
    }, [dispatch]);

    if (status === 'loading') {
        return (
            <div className="bg-white rounded-xl shadow p-4">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Recommended Groups</h2>
            </div>
            <div className="p-2">
                {!suggestions || suggestions.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                        No recommendations available
                    </p>
                ) : (
                    suggestions.map(group => (
                        <GroupSuggestionCard 
                            key={group._id} 
                            group={group} 
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Groups;
