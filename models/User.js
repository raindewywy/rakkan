/**
 * A person who logged in with Google.
 * @class
 */
class User {
  /**
   * @param {string} id - Google profile id.
   * @param {string} displayName - Name shown in the header.
   * @param {string} [email=''] - Email address from the Google profile.
   * @param {string} [photo=''] - Profile picture URL.
   * @param {Date} [createdAt=new Date()] - When the user first logged in.
   */
  constructor(id, displayName, email = '', photo = '', createdAt = new Date()) {
    this.id = id;
    this.displayName = displayName;
    this.email = email;
    this.photo = photo;
    this.createdAt = createdAt;
  }

  /**
   * Plain object for JSON output.
   * @returns {{id: string, displayName: string, email: string, photo: string, createdAt: string}}
   */
  toJSON() {
    return {
      id: this.id,
      displayName: this.displayName,
      email: this.email,
      photo: this.photo,
      createdAt: this.createdAt.toISOString()
    };
  }
}

/**
 * In-memory store of users, same pattern as the course scaffolds.
 * @class
 */
class UserModel {
  constructor() {
    this.users = new Map();
  }

  /**
   * Returns the user of a Google profile, creating it on the first login.
   * @param {object} profile - Google profile ({id, displayName, emails, photos}).
   * @returns {User} The existing or newly created user.
   * @throws {TypeError} When the profile has no id.
   */
  findOrCreate(profile) {
    if (!profile || !profile.id) {
      throw new TypeError('profile with an id is required');
    }
    const existing = this.users.get(profile.id);
    if (existing) {
      return existing;
    }
    const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || '';
    const photo = (profile.photos && profile.photos[0] && profile.photos[0].value) || '';
    const user = new User(profile.id, profile.displayName || email || 'Astra user', email, photo);
    this.users.set(user.id, user);
    return user;
  }

  /**
   * Finds a user by id.
   * @param {string} id - User id.
   * @returns {User|null} The user, or null when unknown.
   */
  findById(id) {
    return this.users.get(id) || null;
  }

  /**
   * Counts how many readings a user has made.
   * @param {string} userId - User id.
   * @param {{getAll: function(string): Array}} history - A PredictionHistory.
   * @returns {number} Total readings (0 when none).
   */
  getTotalReadings(userId, history) {
    return history.getAll(userId).length;
  }

  /**
   * Finds the date of the user's oldest reading.
   * @param {string} userId - User id.
   * @param {{getAll: function(string): Array}} history - A PredictionHistory.
   * @returns {Date|null} The earliest createdAt, or null when there are no readings.
   */
  getFirstReadingDate(userId, history) {
    const times = history.getAll(userId).map((entry) => entry.createdAt.getTime());
    return times.length === 0 ? null : new Date(Math.min(...times));
  }
}

/** The single store shared by the whole app. */
const sharedUsers = new UserModel();

module.exports = { User, UserModel, sharedUsers };
