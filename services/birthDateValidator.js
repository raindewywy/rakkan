/** Error messages (English / Thai) for each validation code. */
const MESSAGES = {
  EMPTY: { en: 'Please enter your birth date.', th: 'กรุณากรอกวันเกิดของคุณ' },
  INCOMPLETE: { en: 'Please fill in the day, month and year.', th: 'กรุณากรอกวัน เดือน และปีให้ครบ' },
  MONTH_RANGE: { en: 'Month must be between 1 and 12.', th: 'เดือนต้องอยู่ระหว่าง 1 ถึง 12' },
  YEAR_FORMAT: { en: 'Year must have 4 digits.', th: 'ปีต้องมี 4 หลัก' },
  YEAR_RANGE: { en: 'Year must be between 1900 and {max}.', th: 'ปีต้องอยู่ระหว่าง 1900 ถึง {max}' },
  DAY_RANGE: { en: 'Day must be between 1 and 31.', th: 'วันต้องอยู่ระหว่าง 1 ถึง 31' },
  DAY_IN_MONTH: { en: 'This month only has {days} days.', th: 'เดือนนี้มีเพียง {days} วัน' },
  FUTURE: { en: 'Birth date cannot be in the future.', th: 'วันเกิดต้องไม่อยู่ในอนาคต' }
};

/**
 * Builds a failed validation result.
 * @param {string} code - Key of MESSAGES.
 * @param {string} lang - 'en' or 'th'.
 * @param {object} [values] - Values replacing {placeholders} in the message.
 * @returns {{valid: false, code: string, message: string, date: null}}
 */
function fail(code, lang, values = {}) {
  let message = (MESSAGES[code][lang] || MESSAGES[code].en);
  Object.keys(values).forEach((key) => {
    message = message.replace(`{${key}}`, values[key]);
  });
  return { valid: false, code, message, date: null };
}

/**
 * Number of days in a month, leap years included.
 * @param {number} year - Full year.
 * @param {number} month - Month 1-12.
 * @returns {number} 28-31.
 */
function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * Validates a birth date typed in three fields.
 * @param {{day: string, month: string, year: string}} input - Raw form values.
 * @param {Date} [now=new Date()] - Current time (injectable for tests).
 * @param {string} [lang='en'] - Language of the error message.
 * @returns {{valid: boolean, code: (string|null), message: (string|null), date: (string|null)}}
 *   `date` is YYYY-MM-DD when valid.
 */
function validateBirthDate(input, now = new Date(), lang = 'en') {
  const source = input || {};
  const day = String(source.day === undefined || source.day === null ? '' : source.day).trim();
  const month = String(source.month === undefined || source.month === null ? '' : source.month).trim();
  const year = String(source.year === undefined || source.year === null ? '' : source.year).trim();

  if (!day && !month && !year) {
    return fail('EMPTY', lang);
  }
  if (!day || !month || !year) {
    return fail('INCOMPLETE', lang);
  }

  const monthNumber = Number(month);
  if (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12) {
    return fail('MONTH_RANGE', lang);
  }

  if (!/^\d{4}$/.test(year)) {
    return fail('YEAR_FORMAT', lang);
  }
  const yearNumber = Number(year);
  const maxYear = now.getFullYear();
  if (yearNumber < 1900 || yearNumber > maxYear) {
    return fail('YEAR_RANGE', lang, { max: maxYear });
  }

  const dayNumber = Number(day);
  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 31) {
    return fail('DAY_RANGE', lang);
  }
  const days = daysInMonth(yearNumber, monthNumber);
  if (dayNumber > days) {
    return fail('DAY_IN_MONTH', lang, { days });
  }
  const birth = new Date(yearNumber, monthNumber - 1, dayNumber);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (birth > today) {
    return fail('FUTURE', lang);
  }

  const pad = (n) => String(n).padStart(2, '0');
  return {
    valid: true,
    code: null,
    message: null,
    date: `${yearNumber}-${pad(monthNumber)}-${pad(dayNumber)}`
  };
}

module.exports = { validateBirthDate };
