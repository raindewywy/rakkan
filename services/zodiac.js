/** Last day of each sign as [sign, month, day], in calendar order from January. */
const SIGN_ENDS = [
  ['capricorn', 1, 19],
  ['aquarius', 2, 18],
  ['pisces', 3, 20],
  ['aries', 4, 19],
  ['taurus', 5, 20],
  ['gemini', 6, 20],
  ['cancer', 7, 22],
  ['leo', 8, 22],
  ['virgo', 9, 22],
  ['libra', 10, 22],
  ['scorpio', 11, 21],
  ['sagittarius', 12, 21]
];

/**
 * Finds the western zodiac sign of a birth date.
 * @param {string} birthDate - Date as YYYY-MM-DD.
 * @returns {string} Lower-case sign name, e.g. 'leo'.
 * @throws {TypeError} When the date is not YYYY-MM-DD.
 */
function getZodiac(birthDate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(birthDate));
  if (!match) {
    throw new TypeError(`birthDate must be YYYY-MM-DD, got: ${birthDate}`);
  }
  const month = Number(match[2]);
  const day = Number(match[3]);
  const found = SIGN_ENDS.find(([, endMonth, endDay]) => month < endMonth || (month === endMonth && day <= endDay));
  return found ? found[0] : 'capricorn';
}

module.exports = { getZodiac };
