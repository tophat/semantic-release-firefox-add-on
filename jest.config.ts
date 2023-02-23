import type { Config } from 'jest'

const config: Config = {
    setupFilesAfterEnv: ['./tests/setup.ts'],
    transform: {
        '^.+\\.[tj]s$': [
            'ts-jest',
            {
                tsconfig: './tsconfig.test.json',
            },
        ],
    },
}

export default config
