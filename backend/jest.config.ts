import type { Config } from 'jest';


const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.test.ts'],
  clearMocks: true,
  moduleFileExtensions: ['ts', 'js', 'json'],
  globalSetup: './testSetup.ts',
  globalTeardown: './testTeardown.ts',
};

export default config;
