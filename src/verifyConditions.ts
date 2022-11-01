import fs from 'fs'
import path from 'path'

import { requiredEnvs, requiredOptions } from './constants'
import { maybeThrowErrors, verifyOptions } from './utils'

export const verifyConditions = (options: any) => {
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
