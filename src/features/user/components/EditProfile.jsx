import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { updateProfile, updateAvatar, setUser } from "../userSlice";
import { toast } from "sonner";
import Layout from "../../../components/layout/Layout";
import defaultAvatar from "../../../assets/user.png";

const EditProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, status } = useSelector((state) => state.user);
    const userId = user._id;
    
    const [formData, setFormData] = useState({
        email: user?.email || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        headline: user?.headline || "",
        about: user?.about || "",
        status: user?.status || "Student",
        branch: user?.branch || "",
        graduationYear: user?.graduationYear || "",
        currentlyWorkingAt: user?.currentlyWorkingAt || "",
        skills: user?.skills || [],
        socialHandles: user?.socialHandles || [],
    });

    const [isPictureSelected, setIsPictureSelected] = useState(false);
    const [picture, setPicture] = useState(null);
    const [newSkill, setNewSkill] = useState("");
    const [isAddingSocial, setIsAddingSocial] = useState(false);
    const [newSocialHandle, setNewSocialHandle] = useState({ name: "", url: "" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleAddSocialHandle = () => {
        if (newSocialHandle.name && newSocialHandle.url) {
            setFormData(prev => ({
                ...prev,
                socialHandles: [...prev.socialHandles, newSocialHandle]
            }));
            setNewSocialHandle({ name: "", url: "" });
            setIsAddingSocial(false);
        }
    };

    const handleRemoveSocialHandle = (index) => {
        setFormData(prev => ({
            ...prev,
            socialHandles: prev.socialHandles.filter((_, i) => i !== index)
        }));
    };

    const handleAvatarUpdate = async () => {
        if (!picture) return;

        try {
            const avatarData = new FormData();
            avatarData.append("avatar", picture[0]);
            
            const result = await dispatch(updateAvatar({ avatarData, userId })).unwrap();
            toast.success("Profile picture updated successfully!");
            setPicture(null);
            setIsPictureSelected(false);
        } catch (error) {
            toast.error(error || "Failed to update profile picture");
        }
    };

    const handleProfileUpdate = async (event) => {
        event.preventDefault();

        try {
            // First update avatar if there's a pending avatar change
            if (picture) {
                const shouldUpdateAvatar = window.confirm(
                    "You have an unsaved profile picture. Would you like to save it as well?"
                );
                
                if (shouldUpdateAvatar) {
                    const avatarData = new FormData();
                    avatarData.append("avatar", picture[0]);
                    
                    try {
                        await dispatch(updateAvatar({ avatarData, userId })).unwrap();
                        toast.success("Profile picture updated successfully!");
                    } catch (error) {
                        toast.error("Failed to update profile picture");
                        return;
                    }
                }
                setPicture(null);
                setIsPictureSelected(false);
            }

            // Update other profile fields
            const response = await dispatch(updateProfile({ 
                formData,
                userId 
            })).unwrap();

            if (response?.profile) {
                toast.success("Profile updated successfully!");
                navigate(`/user/profile/${userId}`);
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error?.message || "Failed to update profile");
        }
    };

    return (
        <Layout>
            <div className="bg-white mt-20 mb-5 rounded-xl px-8 py-5 mx-2 md:mx-24 lg:mx-32 xl:mx-40 max-w-7xl 2xl:mx-auto">
                <div className="flex justify-center relative mb-12">
                    <div className="h-24 w-24 relative">
                        {isPictureSelected ? (
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setPicture(e.target.files)
                                    }
                                    className="hidden"
                                    id="picture-input"
                                />
                                <label
                                    htmlFor="picture-input"
                                    className="cursor-pointer"
                                >
                                    {picture ? (
                                        <img
                                            src={
                                                URL.createObjectURL(
                                                    picture[0]
                                                ) || ""
                                            }
                                            alt="Preview"
                                            className="h-24 w-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="material-symbols-outlined">
                                                add_photo_alternate
                                            </span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        ) : (
                            <div
                                className="cursor-pointer relative"
                                onClick={() => setIsPictureSelected(true)}
                            >
                                <img
                                    className="rounded-full hover:opacity-50 h-24 w-24 object-cover"
                                    src={user?.avatar || defaultAvatar}
                                    alt="Profile"
                                />
                                <div className="absolute inset-0 rounded-full bg-black opacity-0 hover:opacity-50 flex items-center justify-center transition-opacity duration-200">
                                    <span className="material-symbols-outlined text-white">
                                        edit
                                    </span>
                                </div>
                            </div>
                        )}
                        {isPictureSelected && picture && (
                            <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleAvatarUpdate}
                                    className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-700 flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        check
                                    </span>
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPicture(null);
                                        setIsPictureSelected(false);
                                    }}
                                    className="bg-gray-600 text-white px-4 py-1 rounded-full text-sm hover:bg-gray-700 flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        close
                                    </span>
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleProfileUpdate}>
                    <div className="text-2xl font-semibold text-center m-3">
                        <h1>
                            {user?.firstName} {user?.lastName}
                        </h1>
                    </div>
                    <hr className="border-gray-200" />

                    {/* Email (disabled) */}
                    <div className="mt-5">
                        <label className="block text-sm font-semibold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full px-3 py-2 bg-gray-100 rounded-xl text-gray-500"
                        />
                    </div>

                    {/* Add back all the form fields */}
                    <div className="mt-5">
                        <label className="block text-sm font-semibold mb-2">
                            Headline
                        </label>
                        <textarea
                            name="headline"
                            value={formData.headline}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="mt-5">
                        <label className="block text-sm font-semibold mb-2">
                            About
                        </label>
                        <textarea
                            name="about"
                            value={formData.about}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            rows={4}
                        />
                    </div>

                    <div className="mt-5">
                        <label className="block text-sm font-semibold mb-2">
                            Branch
                        </label>
                        <input
                            type="text"
                            name="branch"
                            value={formData.branch}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="mt-5">
                        <label className="block text-sm font-semibold mb-2">
                            Graduation Year
                        </label>
                        <input
                            type="text"
                            name="gradYear"
                            value={formData.graduationYear}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="mt-5">
                        <label className="block text-sm font-semibold mb-2">
                            Status
                        </label>
                        <input
                            type="text"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {formData.status !== "Student" && (
                        <div className="mt-5">
                            <label className="block text-sm font-semibold mb-2">
                                Working At
                            </label>
                            <input
                                type="text"
                                name="workingAt"
                                value={formData.workingAt}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    )}

                    {/* Skills Section */}
                    <div className="mt-5">
                        <label className="block text-sm font-semibold mb-2">
                            Skills
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1"
                                >
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSkill(skill)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            close
                                        </span>
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Add a skill"
                                className="flex-1 px-3 py-2 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Social Handles Section */}
                    <div className="mt-5">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold">
                                Social Handles
                            </label>
                            <button
                                type="button"
                                onClick={() => setIsAddingSocial(true)}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                <span className="material-symbols-outlined">
                                    add
                                </span>
                            </button>
                        </div>

                        {formData.socialHandles.map((handle, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 mb-2"
                            >
                                <input
                                    className="w-1/3 px-3 py-2 bg-gray-50 rounded-xl"
                                    value={handle.name}
                                    disabled
                                />
                                <input
                                    className="w-2/3 px-3 py-2 bg-gray-50 rounded-xl"
                                    value={handle.url}
                                    disabled
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveSocialHandle(index)
                                    }
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <span className="material-symbols-outlined">
                                        delete
                                    </span>
                                </button>
                            </div>
                        ))}

                        {isAddingSocial && (
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    className="w-1/3 px-3 py-2 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="Platform name"
                                    value={newSocialHandle.name}
                                    onChange={(e) =>
                                        setNewSocialHandle((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                />
                                <input
                                    className="w-2/3 px-3 py-2 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="Profile URL"
                                    value={newSocialHandle.url}
                                    onChange={(e) =>
                                        setNewSocialHandle((prev) => ({
                                            ...prev,
                                            url: e.target.value,
                                        }))
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSocialHandle}
                                    className="text-green-500 hover:text-green-700"
                                >
                                    <span className="material-symbols-outlined">
                                        check
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddingSocial(false);
                                        setNewSocialHandle({
                                            name: "",
                                            url: "",
                                        });
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <span className="material-symbols-outlined">
                                        close
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full bg-blue-800 p-2 rounded-xl mt-7 text-white hover:bg-blue-700 disabled:bg-blue-400 cursor-pointer"
                    >
                        {status === "loading" ? (
                            <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            "Update Profile"
                        )}
                    </button>
                    <p className="text-center text-sm text-gray-500 mt-3">Go to <Link to={`/user/profile/${userId}`}><span className="underline hover:font-semibold hover:text-blue-600">Profile</span></Link></p>
                </form>
            </div>
        </Layout>
    );
};

export default EditProfile; 