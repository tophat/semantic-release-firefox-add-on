const fs = require('fs')
const path = require('path')

const { verifyConfig } = require('./utils')

const prepare = (options, { nextRelease, logger }) => {
    const { sourceDir, manifestPath } = verifyConfig(options)

    const version = nextRelease.version
    const normalizedManifestPath = path.join(sourceDir, manifestPath)

    let manifest
    try {
        manifest = fs.readFileSync(normalizedManifestPath)
    } catch (e) {
        throw new Error('Unable to read manifest.json file from dist folder')
    }

    try {
        const jsonManifest = JSON.parse(manifest.toString())
        jsonManifest.version = version
        manifest = JSON.stringify(jsonManifest, null, 2)
    } catch (e) {
        throw new Error(
            'Failed to parse manifest.json from dist folder into JSON',
        )
    }

    try {
        fs.writeFileSync(normalizedManifestPath, manifest)
    } catch (e) {
        throw new Error(
            'Failed to write updated manifest.json to the dist folder',
        )
    }

    logger.log('Wrote version %s to %s', version, manifestPath)
}

module.exports = {
    prepare,
}
