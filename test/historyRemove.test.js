const { PredictionHistory } = require('../models/PredictionHistory');
const { makePrediction } = require('./helpers/factories');

describe('PredictionHistory.remove', () => {
  let history;
  let first;
  let second;

  beforeEach(() => {
    history = new PredictionHistory();
    first = makePrediction({ userId: 'u1' });
    second = makePrediction({ userId: 'u1' });
    history.add(first);
    history.add(second);
  });

  test('removes the reading and returns true', () => {
    expect(history.remove('u1', first.id)).toBe(true);
    expect(history.getAll('u1')).toEqual([second]);
  });

  test('returns false when no reading has that id', () => {
    expect(history.remove('u1', 'missing')).toBe(false);
    expect(history.getAll('u1')).toHaveLength(2);
  });

  test('a user cannot remove the reading of another user', () => {
    expect(history.remove('u2', first.id)).toBe(false);
    expect(history.getAll('u1')).toHaveLength(2);
  });

  test('removing the same reading twice only works once', () => {
    expect(history.remove('u1', first.id)).toBe(true);
    expect(history.remove('u1', first.id)).toBe(false);
  });

  test('returns false for a user who has no readings', () => {
    expect(history.remove('nobody', first.id)).toBe(false);
  });
});
