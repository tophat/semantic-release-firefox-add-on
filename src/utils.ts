import { defaultOptions } from './constants'

export const maybeThrowErrors = (errors: string[]) => {
    if (errors.length > 0) {
        throw new AggregateError(errors)
    }
}

export const verifyOptions = (
    options: any,
    required: Record<string, unknown> = {},
    throwErrors = true,
) => {
    const errors: string[] = []
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
