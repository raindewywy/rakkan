const { PredictionHistory } = require('../models/PredictionHistory');
const { makePrediction } = require('./helpers/factories');

describe('PredictionHistory.filterByCategory', () => {
  let history;
  let love1;
  let love2;
  let career;

  beforeEach(() => {
    history = new PredictionHistory();
    love1 = makePrediction({ userId: 'u1', category: 'love' });
    career = makePrediction({ userId: 'u1', category: 'career' });
    love2 = makePrediction({ userId: 'u1', category: 'love' });
    [love1, career, love2].forEach((entry) => history.add(entry));
  });

  test('returns only the readings of that category', () => {
    expect(history.filterByCategory('u1', 'love')).toEqual([love1, love2]);
    expect(history.filterByCategory('u1', 'career')).toEqual([career]);
  });

  test('returns an empty array for a category the user never used', () => {
    expect(history.filterByCategory('u1', 'finance')).toEqual([]);
  });

  test('ignores case and spaces around the category', () => {
    expect(history.filterByCategory('u1', ' Love ')).toEqual([love1, love2]);
  });

  test('an unknown category returns an empty array instead of throwing', () => {
    expect(history.filterByCategory('u1', 'weather')).toEqual([]);
  });

  test.each([undefined, null, '', '   ', 42, {}])('a non-text or blank category (%p) returns an empty array', (value) => {
    expect(history.filterByCategory('u1', value)).toEqual([]);
  });

  test('never returns the readings of another user', () => {
    history.add(makePrediction({ userId: 'u2', category: 'love' }));

    expect(history.filterByCategory('u1', 'love')).toHaveLength(2);
    expect(history.filterByCategory('nobody', 'love')).toEqual([]);
  });
});
