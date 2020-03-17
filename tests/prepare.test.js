const fs = require('fs')

const { vol } = require('memfs')

const { prepare } = require('../src')

describe('prepare', () => {
    const mockOptions = {
        sourceDir: 'mock_dist',
        manifestPath: 'mock_manifest.json',
    }
    const defaultConfig = {
        nextRelease: { version: 'v3.2.1' },
        logger: console,
    }

    beforeAll(() => {
        jest.spyOn(console, 'log')
    })
    afterEach(() => {
        vol.reset()
    })
    afterAll(() => {
        jest.restoreAllMocks()
    })

    it('uses default options when nothing supplied', () => {
        vol.fromJSON({ 'dist/manifest.json': '{}' })
        prepare({}, defaultConfig)
        expect(console.log).toHaveBeenCalledWith(
            'Wrote version %s to %s',
            defaultConfig.nextRelease.version,
            'dist/manifest.json',
        )
    })

    it('uses supplied configuration options', () => {
        vol.fromJSON({ 'mock_dist/mock_manifest.json': '{}' })
        prepare(mockOptions, defaultConfig)
        expect(console.log).toHaveBeenCalledWith(
            'Wrote version %s to %s',
            defaultConfig.nextRelease.version,
            'mock_dist/mock_manifest.json',
        )
    })

    it('fails if cannot read manifest file', () => {
        expect(() => prepare(mockOptions, defaultConfig)).toThrowError(
            'Unable to read manifest.json file',
        )
    })

    it('fails if cannot parse manifest file', () => {
        vol.fromJSON({ 'dist/manifest.json': 'this is not valid json' })
        expect(() => prepare({}, defaultConfig)).toThrowError(
            'Failed to parse manifest.json',
        )
    })

    it('fails if cannot update manifest file', () => {
        jest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => '{}')
        expect(() =>
            prepare({ sourceDir: 'sourceDir' }, defaultConfig),
        ).toThrowError('Failed to write updated manifest.json')
    })

    it.each([
        [{}, 'dist/manifest.json'],
        [mockOptions, 'mock_dist/mock_manifest.json'],
    ])('successfully updates manifest file', (options, manifestPath) => {
        vol.fromJSON({ [manifestPath]: '{}' })
        prepare(options, defaultConfig)
        expect(JSON.parse(fs.readFileSync(manifestPath))).toEqual(
            expect.objectContaining({
                version: 'v3.2.1',
            }),
        )
    })
})
