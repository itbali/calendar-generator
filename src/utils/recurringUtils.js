// Time constants in milliseconds
const MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
const MILLIS_PER_WEEK = MILLIS_PER_DAY * 7;

/**
 * Calculate all occurrences of a recurring event for a given year
 * @param {object} event - Recurring event object
 * @param {number} year - Year to calculate occurrences for
 * @returns {Array} - Array of dates in MM-DD format
 */
export const calculateEventOccurrences = (event, year) => {
  const occurrences = [];
  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const interval = event.interval || 1;

  // Validate year range
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);

  // If event hasn't started yet for this year
  if (startDate > yearEnd) {
    return occurrences;
  }

  // If event ended before this year
  if (endDate && endDate < yearStart) {
    return occurrences;
  }

  switch (event.pattern) {
    case 'daily':
      calculateDailyOccurrences(startDate, endDate, interval, year, occurrences);
      break;
    case 'weekly':
      calculateWeeklyOccurrences(startDate, endDate, interval, year, occurrences);
      break;
    case 'monthly':
      calculateMonthlyOccurrences(startDate, endDate, interval, year, occurrences);
      break;
    case 'yearly':
      calculateYearlyOccurrences(startDate, endDate, interval, year, occurrences);
      break;
  }

  return occurrences;
};

/**
 * Calculate daily occurrences
 */
const calculateDailyOccurrences = (startDate, endDate, interval, year, occurrences) => {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);

  // Start from the first occurrence in the year or the event start date
  let currentDate = new Date(Math.max(startDate, yearStart));

  // If startDate is before year, align to interval
  if (startDate < yearStart) {
    const daysSinceStart = Math.floor((yearStart - startDate) / MILLIS_PER_DAY);
    const offset = daysSinceStart % interval;
    if (offset > 0) {
      currentDate.setDate(currentDate.getDate() + (interval - offset));
    }
  }

  while (currentDate <= yearEnd) {
    if (!endDate || currentDate <= endDate) {
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      occurrences.push(`${month}-${day}`);
    }

    currentDate.setDate(currentDate.getDate() + interval);
  }
};

/**
 * Calculate weekly occurrences
 */
const calculateWeeklyOccurrences = (startDate, endDate, interval, year, occurrences) => {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);

  // Start from the first occurrence in the year or the event start date
  let currentDate = new Date(Math.max(startDate, yearStart));

  // If startDate is before year, align to interval
  if (startDate < yearStart) {
    const weeksSinceStart = Math.floor((yearStart - startDate) / MILLIS_PER_WEEK);
    const offset = weeksSinceStart % interval;
    if (offset > 0) {
      currentDate.setDate(currentDate.getDate() + (interval - offset) * 7);
    } else {
      // Align to same day of week as start date
      const daysDiff = startDate.getDay() - currentDate.getDay();
      if (daysDiff !== 0) {
        currentDate.setDate(currentDate.getDate() + (daysDiff < 0 ? daysDiff + 7 : daysDiff));
      }
    }
  }

  while (currentDate <= yearEnd) {
    if (!endDate || currentDate <= endDate) {
      if (currentDate >= startDate) {
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        occurrences.push(`${month}-${day}`);
      }
    }

    currentDate.setDate(currentDate.getDate() + interval * 7);
  }
};

/**
 * Calculate monthly occurrences
 */
const calculateMonthlyOccurrences = (startDate, endDate, interval, year, occurrences) => {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);

  // Start from event start or beginning of year
  let currentDate = new Date(startDate);

  // Move to first occurrence in target year if needed
  while (currentDate < yearStart) {
    currentDate.setMonth(currentDate.getMonth() + interval);
  }

  while (currentDate <= yearEnd) {
    if (!endDate || currentDate <= endDate) {
      if (currentDate >= startDate) {
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        occurrences.push(`${month}-${day}`);
      }
    }

    currentDate.setMonth(currentDate.getMonth() + interval);
  }
};

/**
 * Calculate yearly occurrences
 */
const calculateYearlyOccurrences = (startDate, endDate, interval, year, occurrences) => {
  const eventYear = startDate.getFullYear();
  const yearsSinceStart = year - eventYear;

  // Check if this year should have an occurrence
  if (yearsSinceStart >= 0 && yearsSinceStart % interval === 0) {
    const occurrenceDate = new Date(year, startDate.getMonth(), startDate.getDate());

    if (!endDate || occurrenceDate <= endDate) {
      const month = String(occurrenceDate.getMonth() + 1).padStart(2, '0');
      const day = String(occurrenceDate.getDate()).padStart(2, '0');
      occurrences.push(`${month}-${day}`);
    }
  }
};

/**
 * Get all recurring events occurrences for a specific year
 * @param {Array} recurringEvents - Array of recurring events
 * @param {number} year - Target year
 * @returns {object} - Object with dates as keys and arrays of event titles as values
 */
export const getAllRecurringOccurrences = (recurringEvents, year) => {
  const occurrencesByDate = {};

  recurringEvents.forEach(event => {
    const dates = calculateEventOccurrences(event, year);

    dates.forEach(date => {
      if (!occurrencesByDate[date]) {
        occurrencesByDate[date] = [];
      }
      occurrencesByDate[date].push(event.title);
    });
  });

  return occurrencesByDate;
};
