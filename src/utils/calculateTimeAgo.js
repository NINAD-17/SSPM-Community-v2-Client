export const calculateTimeAgo = (dateInString) => {
    const date = new Date(dateInString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const minutes = 60;
    const hours = minutes * 60;
    const days = hours * 24;
    const weeks = days * 7;
    const months = days * 30; // Rough approximation
    const years = days * 365; // Rough approximation

    if (diffInSeconds < minutes) {
        return diffInSeconds === 0 ? 'now' : (diffInSeconds === 1 ? `${diffInSeconds} second ago` : `${diffInSeconds} seconds ago`);
    } else if (diffInSeconds < hours) {
        const actualMinutes = Math.floor(diffInSeconds / minutes);
        if(actualMinutes === 1) {
            return `${actualMinutes} minute ago`;
        }
        return `${actualMinutes} minutes ago`;
    } else if (diffInSeconds < days) {
        const actualHours = Math.floor(diffInSeconds / hours);
        if(actualHours === 1) {
            return `${actualHours} hour ago`;
        }
        return `${actualHours} hours ago`;
    } else if (diffInSeconds < weeks) {
        const actualDays = Math.floor(diffInSeconds / days);
        if(actualDays === 1) {
            return `${actualDays} day ago`;
        }
        return `${actualDays} days ago`;
    } else if (diffInSeconds < months) {
        const actualWeeks = Math.floor(diffInSeconds / weeks);
        if(actualWeeks === 1) {
            return `${actualWeeks} week ago`;
        }
        return `${actualWeeks} weeks ago`;
    } else if (diffInSeconds < years) {
        const actualMonths = Math.floor(diffInSeconds / months);
        if(actualMonths === 1) {
            return `${actualMonths} month ago`;
        }
        return `${actualMonths} months ago`;
    } else {
        const actualYears = Math.floor(diffInSeconds / years);
        if(actualYears === 1) {
            return `${actualYears} year ago`;
        }
        return `${actualYears} years ago`;
    }
};
