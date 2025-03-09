import { useState, useEffect } from 'react';

const useMediaQuery = (query) => {
  // Initialize with the current match state
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Update the state when the match changes
    const updateMatch = (e) => {
      setMatches(e.matches);
    };

    // Add the callback as a listener
    mediaQuery.addEventListener('change', updateMatch);

    // Initial check
    setMatches(mediaQuery.matches);

    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', updateMatch);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
