const fs = require('fs')
const path = require('path')

const { vol } = require('memfs')
const signAddon = require('sign-addon')

const { publish } = require('../src')

describe('publish', () => {
    const mockManifestJSON = {
        manifest_version: 2,
        name: 'Mock Extension',
        version: '0.0.1',
    }
    const extensionId = '{01234567-abcd-6789-cdef-0123456789ef}'
    const targetXpi = 'target-extension.xpi'
    const mockOptions = {
        artifactsDir: 'mock_artifacts',
        manifestPath: 'manifest.json',
        sourceDir: 'mock_source',
    }
    const completeOptions = { extensionId, targetXpi, ...mockOptions }
    const mockAddonSignFailed = { success: false }
    const mockAddonSignSuccess = { success: true, id: extensionId }

    beforeAll(() => {
        jest.spyOn(console, 'log')
    })
    beforeEach(() => {
        vol.fromJSON({
            [mockOptions.artifactsDir]: {},
            [path.join(
                mockOptions.sourceDir,
                mockOptions.manifestPath,
            )]: JSON.stringify(mockManifestJSON),
        })
    })
    afterEach(() => {
        vol.reset()
        jest.clearAllMocks()
    })
    afterAll(() => {
        jest.restoreAllMocks()
    })

    it('fails if extensionId is not given', () => {
        return expect(publish(mockOptions)).rejects.toThrow(
            'extensionId is missing',
        )
    })

    it('fails if targetXpi is not given', () => {
        return expect(publish(mockOptions)).rejects.toThrow(
            'targetXpi is missing',
        )
    })

    it('raises error if signing unsuccessful', () => {
        signAddon.mockResolvedValueOnce(mockAddonSignFailed)
        return expect(publish(completeOptions)).rejects.toThrow(
            'The extension could not be signed',
        )
    })

    it('uses unsigned xpi file when auto signing unlisted fails', async () => {
        signAddon.mockResolvedValueOnce({
            ...mockAddonSignFailed,
            errorCode: 'ADDON_NOT_AUTO_SIGNED',
        })
        const targetXpiPath = path.join(mockOptions.artifactsDir, targetXpi)
        expect(fs.existsSync(targetXpiPath)).toBe(false)
        await publish(completeOptions)
        expect(fs.existsSync(targetXpiPath)).toBe(true)
    })

    it('renames downloaded file to target xpi', async () => {
        const downloadedFile = 'mock_downloaded.xpi'
        vol.fromJSON({
            [path.join(
                mockOptions.artifactsDir,
                downloadedFile,
            )]: 'some fake signed xpi',
        })
        signAddon.mockResolvedValueOnce({
            ...mockAddonSignSuccess,
            downloadedFiles: [downloadedFile],
        })
        const targetXpiPath = path.join(mockOptions.artifactsDir, targetXpi)
        expect(fs.existsSync(targetXpiPath)).toBe(false)
        await publish(completeOptions)
        expect(fs.existsSync(targetXpiPath)).toBe(true)
    })
})
