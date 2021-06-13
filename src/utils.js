const AggregateError = require('aggregate-error')

const { defaultOptions } = require('./constants')

const maybeThrowErrors = (errors) => {
    if (errors.length > 0) {
        throw new AggregateError(errors)
    }
}

const verifyOptions = (options, required = {}, throwErrors = true) => {
    const errors = []
    const mergedOptions = { ...defaultOptions, ...options }
    Object.keys(required).forEach((prop) => {
        mergedOptions[prop] = options[prop]
        if (mergedOptions[prop] === undefined) {
            errors.push(`${prop} is missing. ${required[prop]}`)
        }
    })
    if (throwErrors) {
        maybeThrowErrors(errors)
    }
    return { verified: mergedOptions, errors }
}

module.exports = {
    maybeThrowErrors,
    verifyOptions,
}
