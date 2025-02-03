import apiClient from "../../../api/apiClient";

const API_URL = "/v2/opportunities";

export const fetchAllOpportunities = async () => {
    const response = await apiClient.get(API_URL);
    return response.data;
};

export const fetchOpportunityById = async (id) => {
    const response = await apiClient.get(`${API_URL}/${id}`);
    return response.data;
};

export const fetchOpportunitiesByCategory = async (category) => {
    const response = await apiClient.get(`${API_URL}/category/${category}`);
    return response.data;
};

export const createOpportunity = async (opportunityData) => {
    const response = await apiClient.post(`${API_URL}/create`, opportunityData);
    return response.data;
};

const opportunityService = {
    fetchAllOpportunities,
    fetchOpportunityById,
    fetchOpportunitiesByCategory,
    createOpportunity
};

export default opportunityService;

