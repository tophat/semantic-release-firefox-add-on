const { fs, vol } = require('memfs')
const { default: webExt } = require('web-ext')

const { publish } = require('../src')

describe('prepare', () => {
    const extensionId = '{01234567-abcd-6789-cdef-0123456789ef}'
    const targetXpi = 'target-extension.xpi'
    const mockOptions = {
        artifactsDir: 'mock_artifacts',
        manifestPath: 'mock_manifest.json',
        sourceDir: 'mock_source',
    }
    const completeOptions = { extensionId, targetXpi, ...mockOptions }

    beforeAll(() => {
        jest.spyOn(console, 'log')
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
        webExt.cmd.sign.mockResolvedValueOnce({ success: false })
        return expect(publish(completeOptions)).rejects.toThrow(
            'Signing the extension failed',
        )
    })

    it('renames downloaded file to target xpi', async () => {
        const downloadedFile = 'mock_downloaded.xpi'
        vol.fromJSON({
            [`${mockOptions.artifactsDir}/${downloadedFile}`]: 'some fake signed xpi',
        })
        webExt.cmd.sign.mockResolvedValueOnce({
            success: true,
            downloadedFiles: [downloadedFile],
        })
        const targetXpiPath = `${mockOptions.artifactsDir}/${targetXpi}`
        expect(fs.existsSync(targetXpiPath)).toBe(false)
        await publish(completeOptions)
        expect(fs.existsSync(targetXpiPath)).toBe(true)
    })
})
