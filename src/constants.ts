export const allowedChannels = {
    LISTED: 'listed',
    UNLISTED: 'unlisted',
}

export const defaultOptions = {
    artifactsDir: './artifacts',
    channel: allowedChannels.UNLISTED,
    manifestPath: 'manifest.json',
    sourceDir: 'dist',
}

export const requiredOptions = {
    extensionId:
        'Omitting this would create a new extension instead of a new version.',
    targetXpi:
        'Omitting this would leave the xpi file unnamed when it is returned from mozilla.',
}

export const requiredEnvs = {
    FIREFOX_API_KEY: 'Firefox api key used in webext sign command.',
    FIREFOX_SECRET_KEY: 'Firefox api secret used in webext signing.',
}
