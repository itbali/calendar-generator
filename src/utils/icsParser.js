/**
 * Parse .ics (iCalendar) files and extract events
 * Supports VEVENT components with DTSTART and SUMMARY properties
 */

/**
 * Parse a single line from .ics file
 * @param {string} line - Line from .ics file
 * @returns {object} - { key, value }
 */
const parseICSLine = line => {
  const colonIndex = line.indexOf(':');
  if (colonIndex === -1) return null;

  const key = line.substring(0, colonIndex).split(';')[0]; // Remove parameters like ;VALUE=DATE
  const value = line.substring(colonIndex + 1).trim();

  return { key, value };
};

/**
 * Parse date from various iCalendar formats
 * Supports:
 * - DATE: YYYYMMDD
 * - DATE-TIME: YYYYMMDDTHHmmss or YYYYMMDDTHHmmssZ
 * @param {string} dateStr - Date string from DTSTART
 * @returns {string} - Date in MM-DD format or null
 */
const parseICSDate = dateStr => {
  try {
    // Remove timezone info (Z suffix or timezone identifiers)
    let cleanDate = dateStr.replace(/Z$/, '').split('T')[0];

    // Expected format: YYYYMMDD
    if (cleanDate.length === 8) {
      const month = cleanDate.substring(4, 6);
      const day = cleanDate.substring(6, 8);

      // Validate
      const monthNum = parseInt(month, 10);
      const dayNum = parseInt(day, 10);

      if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
        return `${month}-${day}`;
      }
    }

    return null;
  } catch (error) {
    console.error('Error parsing ICS date:', dateStr, error);
    return null;
  }
};

/**
 * Parse .ics file content and extract events
 * @param {string} icsContent - Content of .ics file
 * @returns {Array} - Array of events { date: 'MM-DD', name: 'Event name' }
 */
export const parseICSFile = icsContent => {
  try {
    const lines = icsContent.split(/\r?\n/);
    const events = [];
    let inEvent = false;
    let currentEvent = {};

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      // Handle line folding (lines starting with space or tab are continuations)
      while (i + 1 < lines.length && /^[ \t]/.test(lines[i + 1])) {
        i++;
        line += lines[i].trim();
      }

      // Check for event boundaries
      if (line === 'BEGIN:VEVENT') {
        inEvent = true;
        currentEvent = {};
        continue;
      }

      if (line === 'END:VEVENT') {
        inEvent = false;
        // Add event if it has required fields
        if (currentEvent.date && currentEvent.name) {
          events.push({
            date: currentEvent.date,
            name: currentEvent.name,
          });
        }
        continue;
      }

      // Parse event properties
      if (inEvent) {
        const parsed = parseICSLine(line);
        if (!parsed) continue;

        const { key, value } = parsed;

        if (key === 'DTSTART') {
          const date = parseICSDate(value);
          if (date) {
            currentEvent.date = date;
          }
        } else if (key === 'SUMMARY') {
          currentEvent.name = value;
        }
      }
    }

    return events;
  } catch (error) {
    console.error('Error parsing ICS file:', error);
    throw new Error('Failed to parse ICS file');
  }
};

/**
 * Validate that the content is a valid .ics file
 * @param {string} content - File content
 * @returns {boolean} - True if valid
 */
export const validateICSFile = content => {
  if (!content || typeof content !== 'string') return false;

  // Check for required iCalendar structure
  const hasBeginCalendar = content.includes('BEGIN:VCALENDAR');
  const hasEndCalendar = content.includes('END:VCALENDAR');
  const hasVersion = content.includes('VERSION:');

  return hasBeginCalendar && hasEndCalendar && hasVersion;
};

/**
 * Import events from .ics file
 * @param {File} file - File object from input
 * @returns {Promise<Array>} - Promise resolving to array of events
 */
export const importFromICS = file => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    // Check file extension
    if (!file.name.toLowerCase().endsWith('.ics')) {
      reject(new Error('File must have .ics extension'));
      return;
    }

    // eslint-disable-next-line no-undef
    const reader = new FileReader();

    reader.onload = e => {
      try {
        const content = e.target.result;

        // Validate file format
        if (!validateICSFile(content)) {
          reject(new Error('Invalid ICS file format'));
          return;
        }

        // Parse events
        const events = parseICSFile(content);

        if (events.length === 0) {
          reject(new Error('No events found in file'));
          return;
        }

        resolve(events);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};
