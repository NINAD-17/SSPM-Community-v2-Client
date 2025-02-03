import { useSelector } from "react-redux"

const ProfileInfo = ({userId}) => {
    let profile = useSelector((state) => state.profile.profile);
    const loggedInUser = useSelector((state) => state.user.user);

    profile = userId === loggedInUser?._id ? loggedInUser : profile;
    const { email, about, role, currentlyWorkingAt, socialHandles, skills } = profile || {};


    if (!profile) {
        return (
            <div className="p-6 bg-white rounded-xl mb-4 shadow animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-xl mb-4 shadow space-y-6">
            {/* About Section */}
            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <span className="material-symbols-outlined">person</span>
                    About
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    {about || "No bio added yet."}
                </p>
            </div>

            {/* Skills Section */}
            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <span className="material-symbols-outlined">psychology</span>
                    Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                    {skills?.length > 0 ? (
                        skills.map((skill) => (
                            <span
                                key={skill}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                                {skill}
                            </span>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No skills added yet.</p>
                    )}
                </div>
            </div>

            {/* Work Section */}
            {role !== "student" && currentlyWorkingAt && (
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <span className="material-symbols-outlined">work</span>
                        Work
                    </h2>
                    <p className="text-gray-700">
                        Currently working at{" "}
                        <span className="font-medium text-blue-600">
                            {currentlyWorkingAt}
                        </span>
                    </p>
                </div>
            )}

            {/* Contact Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <span className="material-symbols-outlined">contact_page</span>
                    Contact
                </h2>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-600">
                            mail
                        </span>
                        <a
                            href={`mailto:${email}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            {email}
                        </a>
                    </div>
                    
                    {/* Social Handles */}
                    {socialHandles?.length > 0 && (
                        <div className="flex flex-wrap gap-4 mt-3">
                            {socialHandles.map((handle) => (
                                <a
                                    key={handle.url}
                                    href={handle.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        link
                                    </span>
                                    {handle.name}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;
