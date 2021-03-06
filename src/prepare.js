const fs = require('fs')
const path = require('path')

const { verifyOptions } = require('./utils')

const withErrMsg = (e, message) => ((e.message = `${message}. ${e.message}`), e)

const prepare = (options, { nextRelease, logger }) => {
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

module.exports = {
    prepare,
}
