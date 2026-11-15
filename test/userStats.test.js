const { UserModel } = require('../models/User');
const { PredictionHistory } = require('../models/PredictionHistory');
const { makePrediction } = require('./helpers/factories');

describe('UserModel statistics', () => {
  let users;
  let history;

  beforeEach(() => {
    users = new UserModel();
    history = new PredictionHistory();
  });

  test('getTotalReadings is 0 for a user without readings', () => {
    expect(users.getTotalReadings('u1', history)).toBe(0);
  });

  test('getTotalReadings counts only the readings of that user', () => {
    history.add(makePrediction({ userId: 'u1' }));
    history.add(makePrediction({ userId: 'u1' }));
    history.add(makePrediction({ userId: 'u2' }));

    expect(users.getTotalReadings('u1', history)).toBe(2);
    expect(users.getTotalReadings('u2', history)).toBe(1);
  });

  test('getFirstReadingDate is null when there are no readings', () => {
    expect(users.getFirstReadingDate('u1', history)).toBeNull();
  });

  test('getFirstReadingDate returns the oldest reading date, whatever the order added', () => {
    history.add(makePrediction({ userId: 'u1', createdAt: new Date(2026, 10, 9) }));
    history.add(makePrediction({ userId: 'u1', createdAt: new Date(2026, 10, 2) }));
    history.add(makePrediction({ userId: 'u1', createdAt: new Date(2026, 10, 5) }));

    expect(users.getFirstReadingDate('u1', history)).toEqual(new Date(2026, 10, 2));
  });
});
