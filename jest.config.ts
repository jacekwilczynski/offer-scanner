import { JestConfigWithTsJest } from 'ts-jest';

export default {
    preset: 'ts-jest',
    modulePaths: ['.'],
    resetMocks: true,
    verbose: true,
    testEnvironment: 'node',
} satisfies JestConfigWithTsJest;
