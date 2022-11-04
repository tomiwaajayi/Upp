module.exports = {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: 'spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  maxWorkers: 1,
  coverageDirectory: './coverage/jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/src/'],
  moduleNameMapper: {
    '@sh/(.*)': '<rootDir>/$1',
    '@upp/(.*)': '<rootDir>/services/upp/$1',
    '@test/(.*)': '<rootDir>/test/$1',
  },
};
