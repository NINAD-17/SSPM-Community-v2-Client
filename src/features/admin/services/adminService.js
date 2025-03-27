import apiClient from "../../../api/apiClient";

/**
 * Fetch inactive users with pagination
 * @param {Object} params - Query parameters { page, limit }
 * @returns {Promise} - API response
 */
export const getInactiveUsers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const response = await apiClient.get(
      `/v2/admin/inactive-users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    );
    
    return response.data;
  } catch (error) {
    console.error("Error fetching inactive users:", error);
    throw error.response?.data || error;
  }
};

/**
 * Send notifications to inactive users
 * @param {Array} userIds - Optional array of specific user IDs to notify
 * @returns {Promise} - API response
 */
export const sendInactiveUserNotifications = async (userIds = []) => {
  try {
    const response = await apiClient.post('/v2/admin/inactive-users/notify', {
      userIds: userIds.length > 0 ? userIds : undefined
    });
    
    return response.data;
  } catch (error) {
    console.error("Error sending notifications to inactive users:", error);
    throw error.response?.data || error;
  }
};

/**
 * Get user activity statistics
 * @returns {Promise} - API response
 */
export const getUserActivityStats = async () => {
  try {
    const response = await apiClient.get('/v2/admin/user-activity-stats');
    return response.data;
  } catch (error) {
    console.error("Error fetching user activity stats:", error);
    throw error.response?.data || error;
  }
}; 