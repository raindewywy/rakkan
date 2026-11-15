const { User, UserModel } = require('../models/User');

describe('UserModel.findOrCreate', () => {
  const profile = {
    id: 'g-10',
    displayName: 'Luna Star',
    emails: [{ value: 'luna@example.com' }],
    photos: [{ value: 'http://img/luna.png' }]
  };

  test('creates a User from a Google profile', () => {
    const model = new UserModel();

    const user = model.findOrCreate(profile);

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe('g-10');
    expect(user.displayName).toBe('Luna Star');
    expect(user.email).toBe('luna@example.com');
    expect(user.photo).toBe('http://img/luna.png');
  });

  test('returns the same user when the same profile logs in again', () => {
    const model = new UserModel();

    const first = model.findOrCreate(profile);
    const second = model.findOrCreate(profile);

    expect(second).toBe(first);
    expect(model.users.size).toBe(1);
  });

  test('falls back to the email when the profile has no display name', () => {
    const model = new UserModel();

    const user = model.findOrCreate({ id: 'g-11', emails: [{ value: 'a@example.com' }] });

    expect(user.displayName).toBe('a@example.com');
  });

  test('throws when the profile has no id', () => {
    const model = new UserModel();

    expect(() => model.findOrCreate({ displayName: 'No id' })).toThrow(TypeError);
    expect(() => model.findOrCreate(null)).toThrow(TypeError);
  });
});

describe('UserModel.findById', () => {
  test('finds a user that was created and returns null for an unknown id', () => {
    const model = new UserModel();
    const user = model.findOrCreate({ id: 'g-12', displayName: 'Sol' });

    expect(model.findById('g-12')).toBe(user);
    expect(model.findById('missing')).toBeNull();
  });
});
