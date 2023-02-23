import main from 'semantic-release-firefox-add-on'

describe('main', () => {
    it.each(['prepare', 'publish', 'verifyConditions'] as Array<
        keyof typeof main
    >)('exports %s', (exp) => void expect(typeof main[exp]).toBe('function'))
})
