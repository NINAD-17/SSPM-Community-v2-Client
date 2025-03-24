import apiClient from "../../../api/apiClient";

const fetchAllOpportunities = async () => {
    try {
        const response = await apiClient.get("/v2/opportunities");
        return response.data;
    } catch (error) {
        console.error("Error fetching all opportunities:", error.response?.data || error);
        throw error;
    }
};

const fetchOpportunitiesByCategory = async (category) => {
    try {
        const response = await apiClient.get(`/v2/opportunities/category/${category}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching opportunities by category ${category}:`, error.response?.data || error);
        throw error;
    }
};

const fetchOpportunityById = async (id) => {
    try {
        const response = await apiClient.get(`/v2/opportunities/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching opportunity by ID ${id}:`, error.response?.data || error);
        throw error;
    }
};

const fetchOpportunitiesByUser = async (userId) => {
    try {
        const response = await apiClient.get(`/v2/opportunities/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching opportunities by user ${userId}:`, error.response?.data || error);
        throw error;
    }
};

const createOpportunity = async (opportunityData) => {
    try {
        const response = await apiClient.post("/v2/opportunities/create", opportunityData);
        return response.data;
    } catch (error) {
        console.error("Error creating opportunity:", error.response?.data || error);
        throw error;
    }
};

const updateOpportunity = async (id, opportunityData) => {
    try {
        const response = await apiClient.patch(`/v2/opportunities/${id}/edit`, opportunityData);
        return response.data;
    } catch (error) {
        console.error(`Error updating opportunity ${id}:`, error.response?.data || error);
        throw error;
    }
};

const deleteOpportunity = async (id) => {
    try {
        const response = await apiClient.delete(`/v2/opportunities/${id}/delete`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting opportunity ${id}:`, error.response?.data || error);
        throw error;
    }
};

const opportunityService = {
    fetchAllOpportunities,
    fetchOpportunitiesByCategory,
    fetchOpportunityById,
    fetchOpportunitiesByUser,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity
};

export default opportunityService;


