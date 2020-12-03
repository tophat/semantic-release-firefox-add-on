const { vol } = require('memfs')
require('jest-mock-props').extend(jest)

const { verifyConditions } = require('../src')

describe('verifyConditions', () => {
    const firefoxApiKeySpy = jest.spyOnProp(process.env, 'FIREFOX_API_KEY')
    const firefoxSecretKeySpy = jest.spyOnProp(
        process.env,
        'FIREFOX_SECRET_KEY',
    )
    const extensionId = '{01234567-abcd-6789-cdef-0123456789ef}'
    const targetXpi = 'target-extension.xpi'

    beforeEach(() => {
        firefoxApiKeySpy.mockValueOnce('some-api-key')
        firefoxSecretKeySpy.mockValueOnce('shh-its-a-secret')
    })
    afterEach(() => {
        jest.resetAllMocks()
    })
    afterAll(() => {
        jest.restoreAllMocks()
    })

    it('fails if FIREFOX_API_KEY is missing from env', () => {
        firefoxApiKeySpy.mockReset()
        expect(() => verifyConditions({ extensionId, targetXpi })).toThrow(
            'FIREFOX_API_KEY is missing',
        )
    })

    it('fails if FIREFOX_SECRET_KEY is missing from env', () => {
        firefoxSecretKeySpy.mockReset()
        expect(() => verifyConditions({ extensionId, targetXpi })).toThrow(
            'FIREFOX_SECRET_KEY is missing',
        )
    })

    it('fails if extensionId is missing from options', () => {
        expect(() => verifyConditions({ targetXpi })).toThrow(
            'No extensionId was specified',
        )
    })

    it('fails if targetXpi is missing from options', () => {
        expect(() => verifyConditions({ extensionId })).toThrow(
            'No targetXpi was specified',
        )
    })

    it('fails if manifest.json file does not exist', () => {
        expect(() => verifyConditions({ extensionId, targetXpi })).toThrow(
            'manifest.json was not found',
        )
    })

    it('succeeds if all conditions are met', () => {
        vol.fromJSON({ 'dist/manifest.json': '{}' })
        expect(() => verifyConditions({ extensionId, targetXpi })).not.toThrow()
    })
})
