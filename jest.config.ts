import { JestConfigWithTsJest } from 'ts-jest';

export default {
    preset: 'ts-jest',
    modulePaths: ['.'],
    resetMocks: true,
    testEnvironment: 'node',
    transform: {
        '\\.ts$': [
            'ts-jest',
            {
                // TypeScript issues should not prevent running the tests
                diagnostics: {
                    exclude: ['**'],
                },
            },
        ],
    },
    verbose: true,
} satisfies JestConfigWithTsJest;
