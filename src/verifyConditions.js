const fs = require('fs')
const path = require('path')

const { requiredEnvs, requiredOptions } = require('./constants')
const { maybeThrowErrors, verifyOptions } = require('./utils')

const verifyConditions = (options) => {
    const { verified, errors } = verifyOptions(options, requiredOptions, false)
    errors.push(...verifyOptions(process.env, requiredEnvs, false).errors)
    const { manifestPath, sourceDir } = verified
    const manifestExists = fs.existsSync(path.join(sourceDir, manifestPath))
    if (!manifestExists) {
        errors.push(
            `${manifestPath} was not found in ${sourceDir}, path does not exist.`,
        )
    }
    maybeThrowErrors(errors)
}

module.exports = {
    verifyConditions,
}
