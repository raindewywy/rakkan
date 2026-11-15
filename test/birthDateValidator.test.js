const { validateBirthDate } = require('../services/birthDateValidator');

// Fixed "today" so the tests give the same result every day: 3 November 2026.
const NOW = new Date(2026, 10, 3);

function check(day, month, year, lang) {
  return validateBirthDate({ day, month, year }, NOW, lang);
}

describe('validateBirthDate', () => {
  test('accepts a normal date and returns it as YYYY-MM-DD', () => {
    expect(check('17', '5', '1999')).toEqual({ valid: true, code: null, message: null, date: '1999-05-17' });
  });

  test('trims spaces and accepts numbers', () => {
    expect(validateBirthDate({ day: ' 7 ', month: 12, year: 1990 }, NOW).date).toBe('1990-12-07');
  });

  test('reports EMPTY when every field is blank or missing', () => {
    expect(check('', '', '').code).toBe('EMPTY');
    expect(validateBirthDate(undefined, NOW).code).toBe('EMPTY');
  });

  test('reports INCOMPLETE when one field is missing', () => {
    expect(check('', '5', '1999').code).toBe('INCOMPLETE');
    expect(check('17', '5', '').code).toBe('INCOMPLETE');
  });

  test.each(['0', '13', 'abc'])('rejects month %s', (month) => {
    expect(check('10', month, '1999').code).toBe('MONTH_RANGE');
  });

  test('rejects a year that does not have 4 digits', () => {
    expect(check('10', '5', '99').code).toBe('YEAR_FORMAT');
    expect(check('10', '5', '19999').code).toBe('YEAR_FORMAT');
  });

  test('rejects a year before 1900 or after the current year', () => {
    expect(check('10', '5', '1899').code).toBe('YEAR_RANGE');
    expect(check('10', '5', '2027').code).toBe('YEAR_RANGE');
  });

  test.each(['0', '32'])('rejects day %s', (day) => {
    expect(check(day, '5', '1999').code).toBe('DAY_RANGE');
  });

  test('rejects a day that does not exist in that month', () => {
    const result = check('31', '4', '1999');

    expect(result.code).toBe('DAY_IN_MONTH');
    expect(result.message).toContain('30');
  });

  test('handles February in leap and non-leap years', () => {
    expect(check('29', '2', '2000').valid).toBe(true);
    expect(check('29', '2', '2001').code).toBe('DAY_IN_MONTH');
    expect(check('29', '2', '1900').code).toBe('DAY_IN_MONTH');
  });

  test('rejects a date in the future but accepts today', () => {
    expect(check('25', '12', '2026').code).toBe('FUTURE');
    expect(check('4', '11', '2026').code).toBe('FUTURE');
    expect(check('3', '11', '2026').valid).toBe(true);
  });

  test('writes the message in Thai when asked', () => {
    expect(check('', '', '', 'th').message).toBe('กรุณากรอกวันเกิดของคุณ');
    expect(check('', '', '', 'en').message).toBe('Please enter your birth date.');
  });
});
