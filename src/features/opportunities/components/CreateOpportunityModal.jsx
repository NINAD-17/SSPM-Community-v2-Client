import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Dialog, Transition } from '@headlessui/react';
import { createOpportunity } from "../opportunitySlice";
import { toast } from "sonner";

const CreateOpportunityModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const { createStatus, error } = useSelector(state => state.opportunities);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Job",
        location: "",
        date: "",
        applicationLink: "",
        contactInfo: "",
        tags: []
    });
    const [tagInput, setTagInput] = useState("");
    const [errors, setErrors] = useState({});

    const categories = [
        "Job", 
        "Internship", 
        "Competition", 
        "Program", 
        "Event", 
        "Workshop"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when field is corrected
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleTagInputChange = (e) => {
        setTagInput(e.target.value);
    };

    const handleTagInputKeyDown = (e) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault(); // Prevent form submission
            if (formData.tags.length >= 5) {
                toast.error("Maximum 5 tags allowed");
                return;
            }
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, tagInput.trim()]
                }));
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        try {
            await dispatch(createOpportunity(formData)).unwrap();
            toast.success("Opportunity created successfully!");
            onClose();
        } catch (err) {
            toast.error(err || "Failed to create opportunity");
        }
    };

    return (
        <Transition show={true} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-[51]">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
                </Transition.Child>
                
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                            <div className="flex justify-between items-center border-b border-gray-200 p-4">
                                <Dialog.Title className="text-xl font-bold text-gray-800">
                                    Create New Opportunity
                                </Dialog.Title>
                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                            Title*
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                            placeholder="Enter opportunity title"
                                        />
                                        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                            Category*
                                        </label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                            Description*
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="4"
                                            className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                            placeholder="Describe the opportunity"
                                        ></textarea>
                                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                id="location"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Location (optional)"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                id="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label htmlFor="applicationLink" className="block text-sm font-medium text-gray-700 mb-1">
                                                Application Link
                                            </label>
                                            <input
                                                type="url"
                                                id="applicationLink"
                                                name="applicationLink"
                                                value={formData.applicationLink}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="https://example.com/apply"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">
                                                Contact Information
                                            </label>
                                            <input
                                                type="text"
                                                id="contactInfo"
                                                name="contactInfo"
                                                value={formData.contactInfo}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Email or phone number"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                                            Tags (max 5, press Enter to add)
                                        </label>
                                        <input
                                            type="text"
                                            id="tags"
                                            name="tags"
                                            value={tagInput}
                                            onChange={handleTagInputChange}
                                            onKeyDown={handleTagInputKeyDown}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Add tags and press Enter"
                                            disabled={formData.tags.length >= 5}
                                        />
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.tags.map((tag, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                                                >
                                                    {tag}
                                                    <button 
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                                                    >
                                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                                            {error}
                                        </div>
                                    )}
                                </form>
                            </div>

                            <div className="border-t border-gray-200 p-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={createStatus === "loading"}
                                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                                        createStatus === "loading" ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                                >
                                    {createStatus === "loading" ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating...
                                        </span>
                                    ) : (
                                        "Create Opportunity"
                                    )}
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

CreateOpportunityModal.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default CreateOpportunityModal; 