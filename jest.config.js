module.exports = {
  testMatch: ['**/tests/**/*.test.js'],
  testEnvironment: 'node',
  verbose: true,
  setupFiles: ['<rootDir>/tests/testEnv.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  collectCoverageFrom: [
    'middlewares/**/*.js',
    'services/**/*.js',
    'utils/**/*.js',
    'config/**/*.js',
    '!tests/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov']
};
