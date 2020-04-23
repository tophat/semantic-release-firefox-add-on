module.exports = {
    ci: false,
    debug: true,
    dryRun: false,
    tagFormat: "e2e-v${version}",
    plugins: [
        [
            "../src/index.js",
            {
                apiUrlPrefix: "https://addons-dev.allizom.org/api/v3",
                artifactsDir: "./",
                channel: "unlisted",
                sourceDir: "./",
                extensionId: "{01234567-abcd-6789-cdef-0123456789ef}",
                targetXpi: "extension.xpi",
            },
        ],
    ],
};
