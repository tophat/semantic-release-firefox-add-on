import fs from 'fs'
import path from 'path'

import { signAddon as defaultAddonSigner } from 'sign-addon'
import webExt from 'web-ext'

import { allowedChannels, requiredOptions } from './constants'
import { verifyOptions } from './utils'

export const publish = async (options: any) => {
    // This will create an unsigned xpi from sourceDir folder (dist) it will
    // then pass the unsigned xpi to the signing api, mozilla will validate the
    // xpi and sign it if it's legitimate. They will give us back a signed xpi
    // which will be placed into artifactsDir
    // If there's an error with the validation, webExt sign will log a link to
    // the console which will lead to the validation page which should contain
    // detailed reasons why the extension was rejected
    const { extensionId, artifactsDir, channel, sourceDir, targetXpi } =
        verifyOptions(options, requiredOptions).verified

    const { FIREFOX_API_KEY, FIREFOX_SECRET_KEY } = process.env

    const signAddon = async (
        params: Parameters<typeof defaultAddonSigner>[0],
    ) => {
        const unsignedXpiFile = path.join(artifactsDir, `unsigned-${targetXpi}`)
        fs.writeFileSync(unsignedXpiFile, fs.readFileSync(params.xpiPath))
        const result = await defaultAddonSigner(params)
        if (
            channel === allowedChannels.LISTED &&
            !result.success &&
            result.errorCode === 'ADDON_NOT_AUTO_SIGNED'
        ) {
            result.success = true
            result.downloadedFiles = result.downloadedFiles || [unsignedXpiFile]
        }
        return result
    }

    const { downloadedFiles } = await webExt.cmd.sign(
        {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            apiKey: FIREFOX_API_KEY!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            apiSecret: FIREFOX_SECRET_KEY!,
            artifactsDir,
            channel,
            id: extensionId,
            sourceDir,
        },
        { signAddon },
    )
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [xpiFile] = downloadedFiles!
    fs.renameSync(xpiFile, path.join(artifactsDir, targetXpi))
}
