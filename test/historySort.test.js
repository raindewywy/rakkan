const { PredictionHistory } = require('../models/PredictionHistory');
const { makePrediction } = require('./helpers/factories');

describe('PredictionHistory.sortByDate', () => {
  let history;
  let old;
  let middle;
  let recent;

  beforeEach(() => {
    history = new PredictionHistory();
    old = makePrediction({ userId: 'u1', createdAt: new Date(2026, 10, 1) });
    middle = makePrediction({ userId: 'u1', createdAt: new Date(2026, 10, 5) });
    recent = makePrediction({ userId: 'u1', createdAt: new Date(2026, 10, 9) });
    // Added out of order on purpose.
    history.add(middle);
    history.add(recent);
    history.add(old);
  });

  test('puts the newest reading first by default', () => {
    expect(history.sortByDate('u1')).toEqual([recent, middle, old]);
  });

  test('puts the oldest reading first with order "asc"', () => {
    expect(history.sortByDate('u1', 'asc')).toEqual([old, middle, recent]);
  });

  test('does not change the order stored in the history', () => {
    history.sortByDate('u1');

    expect(history.getAll('u1')).toEqual([middle, recent, old]);
  });

  test('only sorts the readings of that user', () => {
    history.add(makePrediction({ userId: 'u2', createdAt: new Date(2026, 10, 20) }));

    expect(history.sortByDate('u1')).toHaveLength(3);
  });
});
