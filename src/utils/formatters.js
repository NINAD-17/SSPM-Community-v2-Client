import { format, formatDistanceToNow } from "date-fns";

/**
 * Format a date string or Date object to a readable format
 * @param {string|Date} date - The date to format
 * @param {string} formatString - Optional format string (default: 'PPP')
 * @returns {string} The formatted date string
 */
export const formatDate = (date, formatString = "PPP") => {
    if (!date) return "N/A";
    try {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        return format(dateObj, formatString);
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid date";
    }
};

/**
 * Format a date to a relative time (e.g., "2 days ago")
 * @param {string|Date} date - The date to format
 * @param {Object} options - Options for formatDistanceToNow
 * @returns {string} The relative time string
 */
export const formatRelativeTime = (date, options = { addSuffix: true }) => {
    if (!date) return "N/A";
    try {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        return formatDistanceToNow(dateObj, options);
    } catch (error) {
        console.error("Error formatting relative time:", error);
        return "Invalid date";
    }
};

/**
 * Format a number with commas (e.g., 1000 -> 1,000)
 * @param {number} number - The number to format
 * @returns {string} The formatted number
 */
export const formatNumber = (number) => {
    if (number === null || number === undefined) return "0";
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Truncate text to a specified length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} length - The maximum length
 * @returns {string} The truncated text
 */
export const truncateText = (text, length = 100) => {
    if (!text) return "";
    if (text.length <= length) return text;
    return `${text.substring(0, length)}...`;
};