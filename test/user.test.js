const { User } = require('../models/User');

describe('User', () => {
  test('keeps the values given to the constructor', () => {
    const createdAt = new Date(2026, 10, 3);
    const user = new User('g-1', 'Luna', 'luna@example.com', 'http://img/luna.png', createdAt);

    expect(user.id).toBe('g-1');
    expect(user.displayName).toBe('Luna');
    expect(user.email).toBe('luna@example.com');
    expect(user.photo).toBe('http://img/luna.png');
    expect(user.createdAt).toBe(createdAt);
  });

  test('uses an empty email and photo and the current time by default', () => {
    const before = Date.now();
    const user = new User('g-2', 'Sol');

    expect(user.email).toBe('');
    expect(user.photo).toBe('');
    expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(before);
  });

  test('toJSON turns createdAt into an ISO string', () => {
    const user = new User('g-3', 'Nova', 'n@example.com', '', new Date('2026-11-03T00:00:00.000Z'));

    expect(user.toJSON()).toEqual({
      id: 'g-3',
      displayName: 'Nova',
      email: 'n@example.com',
      photo: '',
      createdAt: '2026-11-03T00:00:00.000Z'
    });
  });
});
