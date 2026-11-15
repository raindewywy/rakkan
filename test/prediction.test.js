const { Prediction, CATEGORIES } = require('../models/Prediction');

const result = {
  level: 'high',
  headline: 'A bright day',
  description: 'Good things are coming.',
  details: [{ title: 'Heart', text: 'Open', score: 80 }],
  advice: 'Stay kind.'
};

describe('Prediction', () => {
  test('keeps the values given to the constructor', () => {
    const createdAt = new Date(2026, 10, 5);
    const prediction = new Prediction('p1', 'u1', 'love', '1999-05-17', result, createdAt);

    expect(prediction.id).toBe('p1');
    expect(prediction.userId).toBe('u1');
    expect(prediction.category).toBe('love');
    expect(prediction.birthDate).toBe('1999-05-17');
    expect(prediction.result).toBe(result);
    expect(prediction.createdAt).toBe(createdAt);
  });

  test('uses the current time when createdAt is not given', () => {
    const before = Date.now();
    const prediction = new Prediction('p2', 'u1', 'career', '1999-05-17', result);

    expect(prediction.createdAt).toBeInstanceOf(Date);
    expect(prediction.createdAt.getTime()).toBeGreaterThanOrEqual(before);
  });

  test('CATEGORIES lists the five categories', () => {
    expect(CATEGORIES).toEqual(['love', 'career', 'finance', 'education', 'life']);
  });

  test.each(CATEGORIES)('accepts the category %s', (category) => {
    expect(Prediction.isValidCategory(category)).toBe(true);
    expect(() => new Prediction('p3', 'u1', category, '1999-05-17', result)).not.toThrow();
  });

  test('rejects an unknown category', () => {
    expect(Prediction.isValidCategory('weather')).toBe(false);
    expect(() => new Prediction('p4', 'u1', 'weather', '1999-05-17', result)).toThrow(RangeError);
  });

  test('toJSON writes createdAt as an ISO string', () => {
    const prediction = new Prediction('p5', 'u1', 'life', '1999-05-17', result, new Date('2026-11-05T10:00:00.000Z'));

    expect(prediction.toJSON()).toEqual({
      id: 'p5',
      userId: 'u1',
      category: 'life',
      birthDate: '1999-05-17',
      result,
      createdAt: '2026-11-05T10:00:00.000Z'
    });
  });

  test('JSON.stringify uses toJSON', () => {
    const prediction = new Prediction('p6', 'u1', 'finance', '1999-05-17', result, new Date('2026-11-05T10:00:00.000Z'));

    expect(JSON.parse(JSON.stringify(prediction)).createdAt).toBe('2026-11-05T10:00:00.000Z');
  });
});
