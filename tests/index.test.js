const main = require('../src')

describe('main', () => {
    it.each(['prepare', 'publish', 'verifyConditions'].map(Array))(
        'exports %s',
        prop => expect(typeof main[prop]).toBe('function'),
    )
})
