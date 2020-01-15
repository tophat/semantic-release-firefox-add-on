const fs = require('fs')
const path = require('path')

const { requiredEnvs, requiredOptions } = require('./constants')
const { maybeThrowErrors, verifyOptions } = require('./utils')

const verifyConditions = options => {
    const verified = verifyOptions(options)
    const { manifestPath, sourceDir } = verified
    const errors = []

    Object.keys(requiredEnvs).forEach(envVarName => {
        if (!process.env[envVarName]) {
            errors.push(`${envVarName} is missing from the environment`)
        }
    })

    Object.keys(requiredOptions).forEach(option => {
        if (!verified[option]) {
            errors.push(
                `No ${option} was specified in package.json. ${requiredOptions[option]}`,
            )
        }
    })

    const manifestExists = fs.existsSync(path.join(sourceDir, manifestPath))
    if (!manifestExists) {
        errors.push(
            `${manifestPath} was not found in ${sourceDir}, path does not exist`,
        )
    }
    maybeThrowErrors(errors)
}

module.exports = {
    verifyConditions,
}
