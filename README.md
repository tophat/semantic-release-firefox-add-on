# semantic-release-firefox

## Overview

This package provides a set of [`semantic-release`][semantic-release] plugins for you to easily publish Firefox add ons automatically. Firefox requires that even self-distributed packages are signed through the add on store. Given a built package, it will write the correct version number into `manifest.json` and upload the dist folder to the add on store. The package will be validated by Mozilla, and if valid, a signed distribution will be returned and downloaded into the artifacts folder.

## Motivation

We were working on a dev tooling extension internally and wanted to release it through the Chrome web store and Firefox Add On store. The `semantic-release-chrome` extension worked wonderfully, but we kept struggling to find a `semantic-release-firefox` plugin that worked the way we wanted. After finding that `web-ext` had a Node api, we just built our own plugins using `web-ext` to accomplish the goal.

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```bash
npm install --save-dev @tophat/semantic-release-firefox
```

## Usage

This package export the following plugins:

### `verifyConditions`

Verify the presence of the authentication parameters, which are set via environment variables (see [Firefox authentication][chrome-authentication]).

#### `verifyConditions` parameters

### `prepare`

Writes the correct version to the `manifest.json` and creates a `zip` file with everything inside the `dist` folder.

This plugin requires some parameters to be set, so be sure to check below and fill them accordingly.

#### `prepare` parameters

- `asset`: **REQUIRED** parameter. The filename of the zip file.

- `distFolder`: The folder that will be zipped. Defaults to `dist`.

- `manifestPath`: The path of the `manifest.json` file inside the dist folder. Defaults to `<distFolder parameter>/manifest.json`.

### `publish`

Uploads the generated zip file to the webstore and publishes a new release.

#### `publish` parameters

- `extensionId`: **REQUIRED** parameter. The `extension id` from the webstore. For example: If the url of your extension is [https://chrome.google.com/webstore/detail/webplayer-hotkeys-shortcu/ikmkicnmahfdilneilgibeppbnolgkaf](https://chrome.google.com/webstore/detail/webplayer-hotkeys-shortcu/ikmkicnmahfdilneilgibeppbnolgkaf), then the last portion, `ikmkicnmahfdilneilgibeppbnolgkaf`, will be the `extension id`. You can also take this ID on the [developers dashboard](https://chrome.google.com/webstore/developer/dashboard), under the name `Item ID` located inside the `More info` dialog.

  Unfortunately, due to Google's restrictions, this plugin can only publish extensions that already exists on the store, so you will have to at least make a draft release for yourself, so the plugin can create a proper release for the first time. You can create a draft release with just a minimum `manifest.json` with version `0.0.1` compressed in a zip file.

  If you decide to make the draft, make sure to fill all the required fields on the drafts page, otherwise the publishing will fail with a `400` status code (Bad request).

- `asset`: **REQUIRED** parameter. The zip file that will be published to the chrome webstore.

- `target`: can be `default` or `trustedTesters`. When released using the first, the extension will be publicly available to everyone. When `trustedTesters` is used, it will be released as a [private extension](https://support.google.com/chrome/a/answer/2663860). Defaults to `default`.

## Uninstalling

_If there is a specific procedure to uninstall your project that isn't straightforward and/or well-defined, you should outline it here to avoid frustrations._

## Contributing

_Instructions or guidelines on how to contribute are essential to any OSS project! You can easily split this off to a CONTRIBUTING document alongside the README, or keep it in here._

_In your contribution guide, you can outline best practices, how to set up a development environment that meets the needs of your project, and what the process is to get contributions merged._

## Contributors

_You don't really have to add this section yourself! Simply use [all-contributors](https://allcontributors.org/) by adding comments in your PRs like so:_

```
@all-contributors please add <username> for <contribution type>
```

_Find out more about All-Contributors on their website!_


