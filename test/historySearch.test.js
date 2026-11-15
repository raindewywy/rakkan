const { PredictionHistory } = require('../models/PredictionHistory');
const { makePrediction } = require('./helpers/factories');

function reading(userId, day, fields) {
  return makePrediction({
    userId,
    createdAt: new Date(2026, 10, day),
    category: fields.category || 'love',
    result: Object.assign({ level: 'high', headline: '', description: '', details: [], advice: '' }, fields.result)
  });
}

describe('PredictionHistory.search', () => {
  let history;
  let sunrise;
  let money;

  beforeEach(() => {
    history = new PredictionHistory();
    sunrise = reading('u1', 2, { result: { headline: 'Sunrise of hope', description: 'A new start', advice: 'Be bold' } });
    money = reading('u1', 6, { category: 'finance', result: { headline: 'Save more', description: 'Watch spending', advice: 'Track costs' } });
    history.add(sunrise);
    history.add(money);
  });

  test('finds a reading by a word in the headline', () => {
    expect(history.search('u1', 'Sunrise')).toEqual([sunrise]);
  });

  test('ignores upper and lower case', () => {
    expect(history.search('u1', 'sUnRiSe')).toEqual([sunrise]);
    expect(history.search('u1', 'SAVE MORE')).toEqual([money]);
  });

  test('also searches description, advice and category', () => {
    expect(history.search('u1', 'new start')).toEqual([sunrise]);
    expect(history.search('u1', 'track costs')).toEqual([money]);
    expect(history.search('u1', 'finance')).toEqual([money]);
  });

  test('returns an empty array when nothing matches', () => {
    expect(history.search('u1', 'zodiac')).toEqual([]);
  });

  test('an empty or blank keyword returns every reading, newest first', () => {
    expect(history.search('u1', '')).toEqual([money, sunrise]);
    expect(history.search('u1', '   ')).toEqual([money, sunrise]);
    expect(history.search('u1')).toEqual([money, sunrise]);
  });

  test('never returns the readings of another user', () => {
    history.add(reading('u2', 3, { result: { headline: 'Sunrise for someone else' } }));

    expect(history.search('u1', 'sunrise')).toEqual([sunrise]);
  });
});
