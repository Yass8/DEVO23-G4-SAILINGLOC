export default {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'services/**/*.js',
    'routes/**/*.js',
    '!**/node_modules/**',
  ],
  coverageDirectory: './coverage',
  testMatch: ['**/tests/unit/**/*.test.js'],
  transform: {},
  testTimeout: 30000,
  moduleNameMapping: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  clearMocks: true,
  resetMocks: true
};