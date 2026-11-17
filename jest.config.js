/**
 * Jest settings. They used to live in package.json; they moved here so that
 * Jest only runs the unit tests in test/ and never the Playwright files in tests/.
 */
module.exports = {
  testMatch: ['<rootDir>/test/**/*.test.js'],
  collectCoverage: true,
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
  reporters: ['default', ['jest-junit', { outputDirectory: 'test-results/jest' }]],
  // The course requires at least 80% statement coverage of the data-structure classes in models/.
  collectCoverageFrom: ['models/**/*.js'],
  coverageThreshold: {
    './models/': { statements: 80 }
  }
};
