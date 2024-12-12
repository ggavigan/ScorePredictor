export const isMatchWithinDateRange = (matchDate) => {
    const currentDate = new Date();
    const matchDateObj = new Date(matchDate);
    const timeDifference = matchDateObj - currentDate;
  
    const fourDaysInMs = 4 * 24 * 60 * 60 * 1000;
  
    return Math.abs(timeDifference) <= fourDaysInMs;
  };
  