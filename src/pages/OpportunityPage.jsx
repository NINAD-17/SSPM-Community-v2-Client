import { useState, useEffect } from "react";
import CategoryFilter from "../features/opportunities/components/CategoryFilter";
import OpportunityList from "../features/opportunities/components/OpportunityList";
import OpportunityDetail from "../features/opportunities/components/OpportunityDetail";
import Layout from "../components/layout/Layout";
import CreateOpportunityModal from "../features/opportunities/components/CreateOpportunityModal";

const OpportunityPage = () => {
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [category, setCategory] = useState("All");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [mobileView, setMobileView] = useState("list"); // "list" or "detail"

    // Reset selected opportunity when category changes
    useEffect(() => {
        setSelectedOpportunity(null);
        setMobileView("list");
    }, [category]);

    const handleOpportunitySelect = (opportunity) => {
        setSelectedOpportunity(opportunity);
        setMobileView("detail");
    };

    const handleBackToList = () => {
        setMobileView("list");
    };

    return (
        <Layout>
            <div className="flex flex-col min-h-screen bg-gray-50">
                <div className="w-full max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center mb-2">
                            <h1 className="text-2xl font-bold text-gray-800">Opportunities</h1>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
                            >
                                <span className="material-symbols-outlined text-sm">add</span>
                                Create Opportunity
                            </button>
                        </div>

                        <CategoryFilter setCategory={setCategory} category={category} />

                        <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-12rem)]">
                            <div className={`${mobileView === "detail" ? "hidden" : "block"} md:block w-full md:w-2/5 lg:w-1/3 overflow-hidden`}>
                                <div className="h-full overflow-y-auto rounded-xl shadow-md">
                                    <OpportunityList
                                        onSelectOpportunity={handleOpportunitySelect}
                                        category={category}
                                    />
                                </div>
                            </div>
                            
                            <div className={`${mobileView === "list" ? "hidden" : "block"} md:block w-full md:w-3/5 lg:w-2/3 overflow-hidden`}>
                                <div className="h-full overflow-y-auto rounded-xl shadow-md">
                                    {selectedOpportunity ? (
                                        <div className="bg-white">
                                            <div className="md:hidden p-2 bg-gray-50 border-b">
                                                <button 
                                                    onClick={handleBackToList}
                                                    className="flex items-center text-blue-600 font-medium"
                                                >
                                                    <span className="material-symbols-outlined mr-1">arrow_back</span>
                                                    Back to list
                                                </button>
                                            </div>
                                            <OpportunityDetail opportunity={selectedOpportunity} />
                                        </div>
                                    ) : (
                                        <div className="bg-white p-8 h-full flex flex-col items-center justify-center text-center">
                                            <div className="text-gray-400 text-6xl mb-4">
                                                <span className="material-symbols-outlined" style={{ fontSize: "4rem" }}>
                                                    feed
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-medium text-gray-700 mb-2">No Opportunity Selected</h3>
                                            <p className="text-gray-500 max-w-md">
                                                Select an opportunity from the list to view its details or create a new one.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile floating action button */}
                <div className="md:hidden fixed bottom-6 right-6">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors"
                    >
                        <span className="material-symbols-outlined">add</span>
                    </button>
                </div>

                {/* Create Opportunity Modal */}
                {showCreateModal && (
                    <CreateOpportunityModal 
                        onClose={() => setShowCreateModal(false)} 
                    />
                )}
            </div>
        </Layout>
    );
};

export default OpportunityPage;
