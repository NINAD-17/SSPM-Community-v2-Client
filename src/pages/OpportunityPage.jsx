import React, { useState } from "react";
import CategoryFilter from "../features/opportunities/components/CategoryFilter";
import OpportunityList from "../features/opportunities/components/OpportunityList";
import OpportunityDetail from "../features/opportunities/components/OpportunityDetail";
import Layout from "../components/layout/Layout";

const OpportunityPage = () => {
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [category, setCategory] = useState("All");

    return (
        <Layout>
            <div className="flex flex-col min-h-screen mt-20">
                <CategoryFilter setCategory={setCategory} />
                <div className="flex flex-1 justify-center p-4">
                    <div className="flex flex-col md:flex-row max-w-7xl w-full gap-4 bg-white rounded-lg shadow-lg">
                        <OpportunityList
                            onSelectOpportunity={setSelectedOpportunity}
                        />
                        <div className="hidden md:block w-full md:w-2/3">
                            <OpportunityDetail
                                opportunity={selectedOpportunity}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default OpportunityPage;
