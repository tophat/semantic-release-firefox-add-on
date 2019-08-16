const fs = require('fs')
const path = require('path')

const { maybeThrowErrors, verifyConfig } = require('./utils')

const prepare = (options, { nextRelease, logger }) => {
    const {
        options: { sourceDir, manifestPath },
        errors,
    } = verifyConfig(options)
    maybeThrowErrors(errors)

    const version = nextRelease.version
    const normalizedManifestPath = path.join(sourceDir, manifestPath)

    let manifest
    try {
        manifest = fs.readFileSync(normalizedManifestPath)
    } catch (e) {
        throw new Error('Unable to read manifest.json file from dist folder', e)
    }

    try {
        const jsonManifest = JSON.parse(manifest)
        jsonManifest.version = version
        manifest = JSON.stringify(jsonManifest, null, 2)
    } catch (e) {
        throw new Error(
            'Failed to parse manifest.json from dist folder into JSON',
            e,
        )
    }

    try {
        fs.writeFileSync(normalizedManifestPath, manifest)
    } catch (e) {
        throw new Error(
            'Failed to write updated manifest.json to the dist folder',
            e,
        )
    }

    logger.log('Wrote version %s to %s', version, manifestPath)
}

module.exports = {
    prepare,
}
