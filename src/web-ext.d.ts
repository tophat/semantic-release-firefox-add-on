declare module 'web-ext' {
    import type { SignResult, signAddon } from 'sign-addon'

    interface SignParams {
        amoBaseUrl?: string
        apiKey: string
        apiProxy?: string
        apiSecret: string
        apiUrlPrefix?: string
        useSubmissionApi?: boolean
        artifactsDir: string
        id?: string
        ignoreFiles?: Array<string>
        sourceDir: string
        timeout?: number
        verbose?: boolean
        channel?: string
        amoMetadata?: string
    }

    interface SignOptions {
        build?: unknown
        signAddon?: typeof signAddon
        submitAddon?: unknown
        preValidatedManifest?: unknown
        shouldExitProgram?: boolean
        asyncFsReadFile?: unknown
    }

    interface Command {
        sign(params: SignParams, options: SignOptions): Promise<SignResult>
    }

    export const cmd: Command
}
