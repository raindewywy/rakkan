const { PredictionHistory, sharedHistory } = require('../models/PredictionHistory');
const { makePrediction } = require('./helpers/factories');

describe('PredictionHistory add and getAll', () => {
  let history;

  beforeEach(() => {
    history = new PredictionHistory();
  });

  test('starts empty', () => {
    expect(history.getAll('u1')).toEqual([]);
  });

  test('add saves a reading and returns it', () => {
    const reading = makePrediction({ userId: 'u1' });

    expect(history.add(reading)).toBe(reading);
    expect(history.getAll('u1')).toEqual([reading]);
  });

  test('getAll keeps the order in which readings were added', () => {
    const first = makePrediction({ userId: 'u1' });
    const second = makePrediction({ userId: 'u1' });
    history.add(first);
    history.add(second);

    expect(history.getAll('u1')).toEqual([first, second]);
  });

  test('add rejects a reading without a userId', () => {
    expect(() => history.add({ id: 'x' })).toThrow(TypeError);
    expect(() => history.add(null)).toThrow(TypeError);
  });
});

describe('PredictionHistory per user storage', () => {
  let history;

  beforeEach(() => {
    history = new PredictionHistory();
  });

  test('each user only sees their own readings', () => {
    const mine = makePrediction({ userId: 'u1' });
    const theirs = makePrediction({ userId: 'u2' });
    history.add(mine);
    history.add(theirs);

    expect(history.getAll('u1')).toEqual([mine]);
    expect(history.getAll('u2')).toEqual([theirs]);
    expect(history.getAll('nobody')).toEqual([]);
  });

  test('getAll returns a copy, so changing it does not change the history', () => {
    history.add(makePrediction({ userId: 'u1' }));

    history.getAll('u1').pop();

    expect(history.getAll('u1')).toHaveLength(1);
  });

  test('getById finds a reading of the same user only', () => {
    const reading = makePrediction({ userId: 'u1' });
    history.add(reading);

    expect(history.getById('u1', reading.id)).toBe(reading);
    expect(history.getById('u2', reading.id)).toBeNull();
    expect(history.getById('u1', 'missing')).toBeNull();
  });

  test('clear removes the readings of every user', () => {
    history.add(makePrediction({ userId: 'u1' }));
    history.add(makePrediction({ userId: 'u2' }));

    history.clear();

    expect(history.getAll('u1')).toEqual([]);
    expect(history.getAll('u2')).toEqual([]);
  });

  test('sharedHistory is a PredictionHistory used by the whole app', () => {
    expect(sharedHistory).toBeInstanceOf(PredictionHistory);
  });
});
