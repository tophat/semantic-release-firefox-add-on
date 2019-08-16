# TopHat Semantic Release Firefox Plugin

This package is a [semantic release plugin](https://semantic-release.gitbook.io/semantic-release/) for the [web-ext package](https://github.com/mozilla/web-ext). This allows us to sign a firefox extension through addons.mozilla.org and then stores it.

## Steps

### Verify Conditions

This step verifies that the following exists:
- Environment variables exist and are truthy (non-empty). These are addons.mozilla.org credentials. You can read more about them [here](https://addons-server.readthedocs.io/en/latest/topics/api/auth.html#access-credentials) and generate your own [here](https://addons.mozilla.org/en-US/developers/addon/api/key/).
  - `FIREFOX_API_KEY`
  - `FIREFOX_SECRET_KEY`
- `extensionId` exists in the parameters. Without this setting, we would create a new package each run.
- A valid manifest.json in the source directory
  - There are parameters for sourceDir and manifestPath to point this to any folder needed.


### Prepare

This step writes the correct version to the `manifest.json` using the parameters verified in [Verify Conditions](#verify-conditions).

### Publish

This step calls the [sign command](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/web-ext_command_reference#web-ext_sign) of web-ext. This command will:
- zip the sourceDir
- upload the zip to `addons.mozilla.org` (using the `extensionId` from the parameters)
- the package will be verified the package by Mozilla
- if the package is valid and has no errors, Mozilla will return a signed version (to the root directory semantic release runs from)
- we receive the signed version and put it in the path/file specified by `targetXpi`
