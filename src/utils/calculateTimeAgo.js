export const calculateTimeAgo = (dateInString) => {
    const date = new Date(dateInString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        // console.log(`${diffInSeconds} seconds ago`)
        if(diffInSeconds === 0) return `now`;
        return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
        // console.log(`${Math.floor(diffInSeconds / 60)} minutes ago`)
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
        // console.log(`${Math.floor(diffInSeconds / 3600)} hours ago`)
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else {
        // console.log(`${Math.floor(diffInSeconds / 86400)} days ago`)
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
}
