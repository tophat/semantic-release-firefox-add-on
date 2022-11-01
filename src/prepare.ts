import fs from 'fs'
import path from 'path'

import { verifyOptions } from './utils'

const withErrMsg = (e: any, message: string) => (
    (e.message = `${message}. ${e.message}`), e
)

export const prepare = (options: any, { nextRelease, logger }: any) => {
    const { sourceDir, manifestPath } = verifyOptions(options).verified

    const version = nextRelease.version
    const normalizedManifestPath = path.join(sourceDir, manifestPath)

    let manifest
    try {
        manifest = fs.readFileSync(normalizedManifestPath)
    } catch (e) {
        throw withErrMsg(e, 'Failed to read manifest file from dist folder')
    }

    try {
        const jsonManifest = JSON.parse(manifest.toString())
        jsonManifest.version = version
        manifest = JSON.stringify(jsonManifest, null, 2)
    } catch (e) {
        throw withErrMsg(e, 'Failed to parse manifest into JSON')
    }

    try {
        fs.writeFileSync(normalizedManifestPath, manifest)
    } catch (e) {
        throw withErrMsg(e, 'Failed to write updated manifest to dist folder')
    }

    logger.log('Wrote version %s to %s', version, normalizedManifestPath)
}
