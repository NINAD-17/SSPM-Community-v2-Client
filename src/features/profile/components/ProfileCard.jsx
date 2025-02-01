import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { academicYearCalc } from "../../../utils/academicYear";

const ProfileCard = ({ userId }) => {
    const navigate = useNavigate();
    const loggedInUser = useSelector((state) => state.user.user);
    const users = useSelector((state) => state.users?.users); // We'll need a users slice later
    
    // Get the user to display (either logged in user or other user)
    const user = userId === loggedInUser?._id ? loggedInUser : users?.find(u => u._id === userId);

    if (!user) {
        return (
            <div className="bg-white shadow rounded-xl p-6 pb-3 animate-pulse">
                <div className="h-24 w-24 sm:h-20 sm:w-20 rounded-full mx-auto bg-gray-200" />
                <div className="h-6 w-32 bg-gray-200 mx-auto mt-2 rounded" />
                <div className="h-4 w-24 bg-gray-200 mx-auto mt-2 rounded" />
            </div>
        );
    }

    const {
        firstName,
        lastName,
        headline,
        avatar, // Changed from picturePath to match our current state
        status,
        branch,
        gradYear,
    } = user;

    return (
        <div className="bg-white shadow rounded-xl p-6 pb-3">
            <img
                src={avatar || "../../assets/user.png"}
                alt="Profile"
                className="h-24 w-24 sm:h-20 sm:w-20 rounded-full mx-auto object-cover border"
            />
            <h2
                className="text-xl font-semibold mt-2 text-center hover:underline sm:text-lg lg:text-xl cursor-pointer"
                onClick={() => navigate(`/profile/${userId}`)}
            >
                {`${firstName} ${lastName}`}
            </h2>
            <p className="text-md text-center text-gray-600 sm:text-sm lg:text-base">
                {headline}
            </p>
            <hr className="border-blue-400 my-2" />
            <div className="text-base sm:text-sm lg:text-base space-y-0">
                <div className="flex justify-between">
                    <p className="text-gray-700">Status </p>
                    <p className="font-semibold text-gray-700">{status}</p>
                </div>
                {status === "Student" && (
                    <div className="flex justify-between">
                        <p className="text-gray-700">Currently In </p>
                        <p className="font-semibold text-gray-700">
                            {academicYearCalc(gradYear)} Year
                        </p>
                    </div>
                )}
                <div className="flex justify-between flex-wrap">
                    <p className="text-gray-700">Branch </p>
                    <p className="font-semibold text-gray-700">{branch}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-gray-700">Graduation Year </p>
                    <p className="font-semibold text-gray-700">{gradYear}</p>
                </div>
            </div>
            <hr className="border-blue-400 my-2" />
            {user.socialHandles?.length > 0 && (
                <>
                    <div className="text-base sm:text-sm lg:text-base">
                        <h3 className="font-semibold text-gray-900">
                            Social Profiles
                        </h3>
                        <ul>
                            {user.socialHandles.map((handle) => (
                                <li key={handle.url}>
                                    <a
                                        className="cursor-pointer hover:underline text-gray-700 hover:text-blue-400"
                                        href={handle.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {handle.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <hr className="border-blue-400 my-2" />
                </>
            )}

            {userId === loggedInUser?._id ? (
                <div
                    className="flex justify-center items-center text-blue-700 hover:text-blue-400"
                    onClick={() => navigate(`/user/edit`)}
                >
                    <p className="text-center text-sm cursor-pointer">
                        Edit Profile{" "}
                    </p>
                    <span className="material-symbols-outlined text-base ml-1 cursor-pointer">
                        edit
                    </span>
                </div>
            ) : (
                <div className="flex justify-center items-center text-blue-700 hover:text-blue-400">
                    {/* Friend functionality will be added later */}
                    <button
                        className="w-full bg-blue-800 p-2 rounded-xl mt-3 text-white hover:bg-blue-500 flex space-x-2 justify-center"
                    >
                        <p>Add as a Friend</p>
                        <span className="material-symbols-outlined">
                            person_add
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileCard;
