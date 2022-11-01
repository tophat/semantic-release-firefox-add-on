declare module 'sign-addon' {
    export interface SignResult {
        success: boolean
        id: string | null
        downloadedFiles: string[] | null
        errorCode: string | null
        errorDetails: string | null
    }

    export interface SignAddonOptions {
        /** Absolute path to add-on XPI file. */
        xpiPath: string
        /** The add-on ID as recognized by AMO. Example: my-addon@jetpack */
        id: string
        /** The add-on version number for AMO. */
        version: string
        /** Your API key (JWT issuer) from AMO Devhub. */
        apiKey: string
        /** Your API secret (JWT secret) from AMO Devhub. */
        apiSecret: string
        apiUrlPrefix?: string
        /** Number of seconds until the JWT token for the API request expires.
         * This must match the expiration time that the API server accepts. */
        apiJwtExpiresIn?: number
        verbose?: boolean
        /** The release channel (listed or unlisted).
         * Ignored for new add-ons, which are always unlisted.
         * Defaults to most recently used channel. */
        channel?: unknown
        /** Number of milliseconds to wait before giving up on a
         * response from Mozilla's web service. */
        timeout?: number
        /** Absolute directory to save downloaded files in. */
        downloadDir?: string
        /** Optional proxy to use for all API requests,
        such as "http://yourproxy:6000" */
        apiProxy?: unknown
        /** Optional object to pass into request() for additional configuration.
        Not all properties are guaranteed to be applied. */
        apiRequestConfig?: unknown
        /** Optional boolean passed to the AMO client to disable the progress bar. */
        disableProgressBar?: boolean
        AMOClient?: unknown
    }

    interface SignAddon {
        (options: SignAddonOptions): Promise<SignResult>
    }

    export const signAddon: SignAddon
}
