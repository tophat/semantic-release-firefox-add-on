/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const webExt = require('web-ext').default

const defaultOptions = {
    artifactsDir: './',
    manifestPath: 'manifest.json',
    sourceDir: 'dist',
    targetXpi: 'dist.xpi',
}

const verifyConditions = ({ extensionId, ...options }) => {
    const { sourceDir, manifestPath } = {
        ...defaultOptions,
        ...options,
    }
    const { FIREFOX_API_KEY, FIREFOX_SECRET_KEY } = process.env
    const errors = []

    if (!FIREFOX_API_KEY) {
        errors.push('FIREFOX_API_KEY is missing from the environment')
    }

    if (!FIREFOX_SECRET_KEY) {
        errors.push('FIREFOX_SECRET_KEY is missing from the environment')
    }

    if (!extensionId) {
        errors.push(
            'No extensionId was specified in package.json, this would create a new extension instead of a new version.',
        )
    }

    const manifestExists = fs.existsSync(path.join(sourceDir, manifestPath))
    if (!manifestExists) {
        errors.push(
            `${manifestPath} was not found in ${sourceDir}, dist folder needs to exist to run`,
        )
    }

    if (errors.length > 0) {
        throw new Error(errors.join('\n'))
    }
}

const prepare = (options, { nextRelease, logger }) => {
    const { sourceDir, manifestPath } = {
        ...defaultOptions,
        ...options,
    }
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

const publish = async ({ extensionId, ...options }) => {
    // This will create an unsigned xpi from sourceDir folder (dist) it will
    // then pass the unsigned xpi to the signing api, mozilla will validate the
    // xpi and sign it if it's legitimate. They will give us back a signed xpi
    // which will be placed into artifactsDir
    // If there's an error with the validation, webExt sign will log a link to
    // the console which will lead to the validation page which should contain
    // detailed reasons why the extension was rejected
    const { artifactsDir, sourceDir, targetXpi } = {
        ...defaultOptions,
        ...options,
    }
    const { FIREFOX_API_KEY, FIREFOX_SECRET_KEY } = process.env
    const { success, downloadedFiles } = await webExt.cmd.sign({
        apiKey: FIREFOX_API_KEY,
        apiSecret: FIREFOX_SECRET_KEY,
        artifactsDir,
        channel: 'unlisted',
        id: extensionId,
        sourceDir,
    })
    if (!success) {
        throw new Error(
            'Signing the extension failed. See the console output from web-ext sign for the validation link',
        )
    }
    const [xpiFile] = downloadedFiles
    fs.renameSync(
        path.join(artifactsDir, xpiFile),
        path.join(artifactsDir, targetXpi),
    )
}

module.exports = {
    prepare,
    publish,
    verifyConditions,
}
