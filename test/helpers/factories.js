let counter = 0;

/**
 * Builds a plain prediction-like object for tests.
 * createdAt moves forward one day for every call so sorting tests are predictable.
 * @param {object} [overrides] - Fields that replace the defaults.
 * @returns {object} A prediction-like object.
 */
function makePrediction(overrides = {}) {
  counter += 1;
  return Object.assign(
    {
      id: `p${counter}`,
      userId: 'u1',
      category: 'love',
      birthDate: '1999-05-17',
      result: {
        level: 'high',
        headline: `Headline ${counter}`,
        description: 'A short description',
        details: [],
        advice: 'Some advice'
      },
      createdAt: new Date(2026, 10, counter)
    },
    overrides
  );
}

module.exports = { makePrediction };
