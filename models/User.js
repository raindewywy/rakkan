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


module.exports = { User };
