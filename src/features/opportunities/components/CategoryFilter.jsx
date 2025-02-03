import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loadOpportunitiesByCategory } from "../opportunitySlice";

const categories = [
    "All",
    "Job",
    "Internship",
    "Competition",
    "Program",
    "Event",
    "Workshop",
];

const CategoryFilter = () => {
    const dispatch = useDispatch();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isOpen, setIsOpen] = useState(false);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        dispatch(loadOpportunitiesByCategory(category));
        setIsOpen(false);
    };

    return (
        <div className="w-full p-4 bg-gray-100">
            <button
                className="md:hidden w-full flex justify-between items-center p-2 bg-white rounded-lg shadow"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>Category: {selectedCategory}</span>
                <svg
                    className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
            </button>

            <div
                className={`${isOpen ? "flex" : "hidden"} md:flex flex-wrap mt-2 md:mt-0`}
            >
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`p-2 m-1 ${
                            selectedCategory === category
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800"
                        } rounded-full`}
                        onClick={() => handleCategoryClick(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;
