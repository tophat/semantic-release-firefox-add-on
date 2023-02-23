import fs from 'fs'

import { vol } from 'memfs'

import addOn from 'semantic-release-firefox-add-on'

const { prepare } = addOn

jest.mock('fs')

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
        expect(() => void prepare(mockOptions, defaultConfig)).toThrow(
            'Failed to read manifest',
        )
    })

    it('fails if cannot parse manifest file', () => {
        vol.fromJSON({ 'dist/manifest.json': 'this is not valid json' })
        expect(() => void prepare({}, defaultConfig)).toThrow(
            'Failed to parse manifest',
        )
    })

    it('fails if cannot update manifest file', () => {
        jest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => '{}')
        expect(
            () => void prepare({ sourceDir: 'sourceDir' }, defaultConfig),
        ).toThrow('Failed to write updated manifest')
    })

    it.each([
        [{}, 'dist/manifest.json'],
        [mockOptions, 'mock_dist/mock_manifest.json'],
    ])('successfully updates manifest file', (options, manifestPath) => {
        vol.fromJSON({ [manifestPath]: '{}' })
        prepare(options, defaultConfig)
        expect(JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))).toEqual(
            expect.objectContaining({
                version: 'v3.2.1',
            }),
        )
    })
})
