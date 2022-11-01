import type { Config } from 'jest'

const config: Config = {
    setupFilesAfterEnv: ['./tests/setup.js'],
    transform: {
        '^.+\\.[tj]s$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.test.json',
            },
        ],
    },
    transformIgnorePatterns: [
        'node_modules\\/(?!aggregate-error|indent-string|clean-stack|escape-string-regexp|sign-addon|web-ext)',
    ],
}

export default config
