import { useDispatch, useSelector } from "react-redux";
import { joinGroupAction, leaveGroupAction } from "../groupsSlice";
import { toast } from "sonner";
import Spinner from "../../../components/common/Spinner";

const GroupInfoCard = ({ group }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    if (!group) return <Spinner />;

    // Destructure group data with defaults
    const {
        name,
        description,
        avatarImg,
        admins = [],
        members = [],
        createdAt
    } = group;

    const isMember = members.includes(user?._id);

    const handleJoinLeave = async () => {
        try {
            if (isMember) {
                await dispatch(leaveGroupAction(group._id)).unwrap();
                toast.success('Left group successfully');
            } else {
                await dispatch(joinGroupAction(group._id)).unwrap();
                toast.success('Joined group successfully');
            }
        } catch (error) {
            toast.error(error || 'Failed to update membership');
        }
    };

    return (
            <div className="bg-white shadow rounded-xl p-6 pb-3">
                <img
                src={avatarImg || "/default-group.png"}
                alt={name}
                className="h-24 w-24 rounded-xl mx-auto object-cover border"
            />
            <h2 className="text-xl font-semibold mt-2 text-center">
                {name}
                </h2>
                <p className="text-md text-center text-gray-600 sm:text-sm lg:text-base">
                {description}
                </p>
                <hr className="border-blue-400 my-2" />
                <div className="text-base sm:text-sm lg:text-base space-y-0">
                    <div className="flex justify-between">
                        <p className="text-gray-700">Admins </p>
                        <p className="font-semibold text-gray-700">
                        {admins.length}
                        </p>
                    </div>
                    <div className="flex justify-between flex-wrap">
                        <p className="text-gray-700">Members </p>
                        <p className="font-semibold text-gray-700">
                        {members.length}
                        </p>
                    </div>
                    <div className="flex justify-between mb-4">
                        <p className="text-gray-700 mb-2">Created On</p>
                        <p className="font-semibold text-gray-700">
                        {new Date(createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <hr className="border-blue-400 my-2" />
                <button
                    onClick={handleJoinLeave}
                    className={`w-full p-2 rounded-xl mt-3 font-semibold text-white flex space-x-2 justify-center ${
                        isMember 
                            ? 'bg-gray-500 hover:bg-red-600'
                            : 'bg-blue-800 hover:bg-blue-500'
                    }`}
                >
                    {isMember ? 'Leave Group' : 'Join Group'}
                </button>
            </div>
        </div>
    );
};

export default GroupInfoCard;
