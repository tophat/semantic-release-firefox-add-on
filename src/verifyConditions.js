const fs = require('fs')
const path = require('path')

const { throwErrors, verifyConfig } = require('./utils')

const verifyConditions = options => {
    const { extensionId, sourceDir, manifestPath, targetXpi } = verifyConfig(options)
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
    if (!targetXpi) {
        errors.push(
            'No targetXpi was specified in package.json, this would leave the xpi file unnamed when it is returned from mozilla.',
        )
    }
    const manifestExists = fs.existsSync(path.join(sourceDir, manifestPath))
    if (!manifestExists) {
        errors.push(
            `${manifestPath} was not found in ${sourceDir}, dist folder needs to exist to run`,
        )
    }
    throwErrors(errors)
}

module.exports = {
    verifyConditions,
}
