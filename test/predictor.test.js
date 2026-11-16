const { getZodiac } = require('../services/zodiac');
const { createPredictor } = require('../services/predictor');
const { READINGS, getLocalReading } = require('../services/localReadings');
const { CATEGORIES } = require('../models/Prediction');

/** A fake horoscope client: no network is ever used in these tests. */
function fakeClient({ configured = true, text = 'First sentence. Second sentence. Third one.', fail = false } = {}) {
  return {
    isConfigured: () => configured,
    getDailyHoroscope: jest.fn(() => (fail ? Promise.reject(new Error('API down')) : Promise.resolve(text)))
  };
}

describe('getZodiac', () => {
  test.each([
    ['1999-05-17', 'taurus'],
    ['2000-01-19', 'capricorn'],
    ['2000-01-20', 'aquarius'],
    ['2000-12-21', 'sagittarius'],
    ['2000-12-22', 'capricorn']
  ])('%s is %s', (date, sign) => {
    expect(getZodiac(date)).toBe(sign);
  });

  test('throws when the date is not YYYY-MM-DD', () => {
    expect(() => getZodiac('17/05/1999')).toThrow(TypeError);
  });
});

describe('createPredictor with a mocked API', () => {
  test('maps the API text to one reading for each of the five categories', async () => {
    const client = fakeClient();
    const predictor = createPredictor({ client });

    const out = await predictor.predictAll('1999-05-17', 'en');

    expect(client.getDailyHoroscope).toHaveBeenCalledWith('taurus');
    expect(out.source).toBe('api');
    expect(out.sign).toBe('taurus');
    expect(Object.keys(out.results)).toEqual(CATEGORIES);
    expect(out.results.love.description).toBe('First sentence.');
    expect(out.results.career.description).toBe('Second sentence.');
    expect(out.results.love.details).toHaveLength(3);
  });

  test('falls back to the local readings when the API fails', async () => {
    const onFallback = jest.fn();
    const predictor = createPredictor({ client: fakeClient({ fail: true }), onFallback });

    const out = await predictor.predictAll('1999-05-17', 'en');

    expect(out.source).toBe('local');
    expect(onFallback).toHaveBeenCalledTimes(1);
    expect(Object.keys(out.results)).toEqual(CATEGORIES);
  });

  test('does not call the API when it is not configured', async () => {
    const client = fakeClient({ configured: false });
    const predictor = createPredictor({ client });

    const out = await predictor.predictAll('1999-05-17', 'th');

    expect(client.getDailyHoroscope).not.toHaveBeenCalled();
    expect(out.source).toBe('local');
  });
});

describe('local readings', () => {
  test('there are 15 readings: 3 for each category', () => {
    expect(Object.keys(READINGS)).toEqual(CATEGORIES);
    CATEGORIES.forEach((category) => expect(READINGS[category]).toHaveLength(3));
  });

  test('the same birth date and category always give the same reading', () => {
    expect(getLocalReading('love', '1999-05-17', 'en')).toEqual(getLocalReading('love', '1999-05-17', 'en'));
  });

  test('a reading has a level, three detail cards and text in the chosen language', () => {
    const en = getLocalReading('career', '1999-05-17', 'en');
    const th = getLocalReading('career', '1999-05-17', 'th');

    expect(['high', 'medium', 'low']).toContain(en.level);
    expect(en.details).toHaveLength(3);
    expect(th.headline).not.toBe(en.headline);
    expect(th.headline).toMatch(/[ก-๙]/);
  });

  test('an unknown category throws', () => {
    expect(() => getLocalReading('weather', '1999-05-17')).toThrow(RangeError);
  });
});
