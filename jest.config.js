/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'index.ts',
    'src/db/db.connect.ts',
    'src/app.ts',
    'src/config.ts',
    'src/routers/instrument.router.ts',
    'src/routers/user.router.ts',
    'src/repository/user.mongo.model.ts',
    'src/repository/instrument.mongo.model.ts',
    'src/entities/user.ts',
  ],
};
