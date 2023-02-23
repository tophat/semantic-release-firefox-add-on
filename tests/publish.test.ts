import fs from 'fs'
import path from 'path'

import { vol } from 'memfs'

import addOn from 'semantic-release-firefox-add-on'

const { publish } = addOn

const mockSignAddon = jest.fn()

jest.mock('fs')
jest.mock('sign-addon', () => ({ signAddon: mockSignAddon }))
jest.mock('web-ext')

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
        channel: 'unlisted',
        manifestPath: 'manifest.json',
        sourceDir: 'mock_source',
    }
    const completeOptions = { extensionId, targetXpi, ...mockOptions }
    const mockAddonSignFailed = { success: false }
    const mockAddonSignSuccess = { success: true, id: extensionId }
    const clearMockArtifacts = () => {
        const actualFs = jest.requireActual('fs')
        if (actualFs.existsSync(mockOptions.artifactsDir)) {
            actualFs.rmdirSync(mockOptions.artifactsDir, { recursive: true })
        }
    }

    beforeAll(() => {
        jest.spyOn(console, 'log')
        process.env.FIREFOX_API_KEY = 'test'
        process.env.FIREFOX_SECRET_KEY = 'test'
    })
    beforeEach(() => {
        vol.fromJSON({
            [path.join(mockOptions.sourceDir, mockOptions.manifestPath)]:
                JSON.stringify(mockManifestJSON),
        })
    })
    afterEach(() => {
        vol.reset()
        clearMockArtifacts()
        jest.clearAllMocks()
    })
    afterAll(() => {
        jest.restoreAllMocks()
    })

    it('fails if extensionId is not given', () => {
        // @ts-expect-error testing javascript
        return expect(publish(mockOptions)).rejects.toThrow(
            'extensionId is missing',
        )
    })

    it('fails if targetXpi is not given', () => {
        // @ts-expect-error testing javascript
        return expect(publish(mockOptions)).rejects.toThrow(
            'targetXpi is missing',
        )
    })

    it.each`
        signCase                                               | signResults
        ${'signing unsuccessful'}                              | ${mockAddonSignFailed}
        ${'auto signing unsuccessful and channel is unlisted'} | ${{ ...mockAddonSignFailed, errorCode: 'ADDON_NOT_AUTO_SIGNED' }}
    `('raises error if $signCase', async ({ signResults }) => {
        mockSignAddon.mockResolvedValueOnce(signResults)
        return expect(publish(completeOptions)).rejects.toThrow(
            'The extension could not be signed',
        )
    })

    it('uses unsigned xpi if auto signing unsuccessful and channel is listed', async () => {
        mockSignAddon.mockResolvedValueOnce({
            ...mockAddonSignFailed,
            errorCode: 'ADDON_NOT_AUTO_SIGNED',
            id: null,
            downloadedFiles: null,
            errorDetails: null,
        })
        const targetXpiPath = path.join(mockOptions.artifactsDir, targetXpi)
        expect(fs.existsSync(targetXpiPath)).toBe(false)
        await publish({
            ...completeOptions,
            channel: 'listed',
        })
        expect(fs.existsSync(targetXpiPath)).toBe(true)
    })

    it('renames downloaded file to target xpi', async () => {
        const downloadedFile = 'mock_downloaded.xpi'
        const mockFileContent = 'some fake signed xpi'
        const downloadedFilePath = path.join(
            mockOptions.artifactsDir,
            downloadedFile,
        )
        vol.fromJSON({
            [downloadedFilePath]: mockFileContent,
        })
        mockSignAddon.mockResolvedValueOnce({
            ...mockAddonSignSuccess,
            downloadedFiles: [downloadedFilePath],
            errorCode: null,
            errorDetails: null,
        })
        const targetXpiPath = path.join(mockOptions.artifactsDir, targetXpi)
        expect(fs.existsSync(targetXpiPath)).toBe(false)
        await publish(completeOptions)
        expect(fs.readFileSync(targetXpiPath).toString()).toEqual(
            mockFileContent,
        )
    })
})
