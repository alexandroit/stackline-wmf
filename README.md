# @stackline/wmf

> Windows MetaFile (WMF) parser.

[![npm version](https://img.shields.io/npm/v/@stackline/wmf.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/wmf)
[![license](https://img.shields.io/npm/l/@stackline/wmf.svg?style=flat-square)](https://github.com/alexandroit/stackline-wmf)
[![GitHub repository](https://img.shields.io/badge/GitHub-repository-181717?style=flat-square&logo=github)](https://github.com/alexandroit/stackline-wmf)
[![Docs](https://img.shields.io/badge/docs-alexandro.net-0f766e?style=flat-square)](https://alexandro.net/docs/vanilla/wmf/)
[![Reddit community](https://img.shields.io/badge/community-r%2FStackline-ff4500?style=flat-square&logo=reddit&logoColor=white)](https://www.reddit.com/r/Stackline/)

**[Documentation](https://alexandro.net/docs/vanilla/wmf/)** | **[npm](https://www.npmjs.com/package/@stackline/wmf)** | **[Issues](https://github.com/alexandroit/stackline-wmf/issues)** | **[Repository](https://github.com/alexandroit/stackline-wmf)**

**Current package version:** `1.0.2`

---

## Why this package?

Independently maintained Apache-2.0 fork of `wmf@1.0.2`. Original implementation, attribution and license are retained; this is not an official SheetJS release. The precise published source, git commit and SHA-512 integrity are recorded in [UPSTREAM.json](https://github.com/alexandroit/stackline-wmf/blob/main/UPSTREAM.json).

```sh
npm install @stackline/wmf
```

```js
const library = require("@stackline/wmf");
```

### Changes in 1.0.0

- Accept a 22-byte META_PLACEABLE prefix before META_HEADER in both dimension extraction and action parsing (upstream issues #1 and #2).
- Reject truncated headers and invalid record lengths before parsing, including zero-length records that cannot make progress. Header failures now use Error objects.
- Restore the exact TypeScript source associated with the npm gitHead (also embedded in its published source map), build both Node and browser exports with pinned esbuild, and include the previously missing TypeScript declarations.

Processor for Windows MetaFile (WMF) files in JS (for the browser and nodejs).

## Compatibility

| Item | Value |
| --- | --- |
| Package | `@stackline/wmf@1.0.2` |
| Supported Node.js | `>=18` |
| Module entry | `./dist/wmf.node.js` (CommonJS) |
| Runtime dependencies | 0 direct dependencies |
| Types | `types` |

## Installation

```bash
npm install @stackline/wmf
```

With [npm](https://www.npmjs.com/package/@stackline/wmf):

```bash
$ npm install @stackline/wmf
```

In the browser:

```html
<script src="wmf.js"></script>
```

The browser exposes a variable `WMF`.

## Usage

```js
const fs = require('node:fs');
const WMF = require('@stackline/wmf');
const bytes = fs.readFileSync('example.wmf');
console.log(WMF.image_size(bytes));
const actions = WMF.get_actions(bytes);
```

The `data` argument is expected to be an `ArrayBuffer`, `Uint8Array` or `Buffer`

- `WMF.image_size(data)` extracts the image offset and extents, returns an Array
  `[width, height]` where both metrics are measured in pixels.

- `WMF.draw_canvas(data, canvas)` parses the WMF and draws to a `Canvas`.

### Notes

- The library assumes the global `ImageData` is available.  For nodejs-powered
  canvas implementations, a shim must be exposed as a global. Using the `canvas`
  npm package:

```js
const { createImageData } = require("canvas");
global.ImageData = createImageData;
```

- `OffscreenCanvas` in Chrome and some other Canvas implementations require
  the dimensions in the constructor:

```js
const size = WMF.image_size(data);
const canvas = new OffscreenCanvas(size[0], size[1]);
```

### Examples

<details>
  <summary><b>Browser Fetch into canvas</b> (click to show)</summary>

```js
// assume `canvas` is a DOM element
(async() => {
  const res = await fetch("url/for/image.wmf");
  const ab = await res.arrayBuffer();
  WMF.draw_canvas(ab, document.getElementById("canvas"));
})();
```

</details>

<details>
  <summary><b>NodeJS (using `canvas` npm module)</b> (click to show)</summary>

```js
const { createCanvas, createImageData } = require("canvas");
global.ImageData = createImageData;

const size = WMF.image_size(data);
const canvas = createCanvas(size[0], size[1]);
WMF.draw_canvas(data, canvas);
```

</details>

## Security

Truncated headers and invalid record lengths are rejected before parsing, including zero-length records that cannot make progress.

## API Surface

### References

- `MS-WMF`: Windows Metafile Format

## Local Development

Clone the [repository](https://github.com/alexandroit/stackline-wmf) and run the following commands from its root:

```bash
npm ci
npm run build
npm test
npm run lint
```

The retained upstream development notes below include historical tooling; the commands above are the maintained package checks.

### Development and verification

Use Node.js 18 or newer for development (verified locally with Node 24). Run `npm ci --ignore-scripts`, `npm run build`, `npm run lint`, `npm test`, and `npm run test:package`. The fork declares Node >=18 for its rebuilt distribution; the original Node >=0.8 declaration is not carried forward. Browser builds expose the same `WMF` global and four public functions, without requiring a Node Buffer polyfill. The renderer itself is retained, not rewritten.

`lint` is a JavaScript syntax check, not a claim of a full style/security analysis. All packages have no runtime npm dependencies. `npm audit` reports registry advisories only; absence of findings is not proof that all format parsing is safe.

Five regression tests cover Buffer, Uint8Array, ArrayBuffer, browser-global exports, drawing entrypoint and malformed inputs. Rendering fidelity for arbitrary real-world WMF records is not claimed.

Sources reviewed on 2026-09-27:

- https://github.com/SheetJS/js-wmf/issues/1
- https://github.com/SheetJS/js-wmf/issues/2
- https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-wmf/828e1864-7fe7-42d8-ab0a-1de161b32f27

Publication is performed by the repository GitHub workflow; do not publish from a local checkout. This fork does not modify or publish `@stackline/xlsx`.

## Consumer Smoke Test

`npm run test:package` packs the library and exercises an isolated consumer using the repository fixture.

## Release Checklist

1. Update the package version, lockfile, generated version fields, and changelog together.
2. Run the development checks above and audit both `npm audit` and `npm audit --omit=dev`.
3. Use the [GitHub publish workflow](https://github.com/alexandroit/stackline-wmf/actions/workflows/publish.yml) with its `Prod` environment to publish the exact CI tarball.
4. Verify public npm bytes, package identity, provenance, and the immutable GitHub release evidence.

## License

[Apache-2.0](https://github.com/alexandroit/stackline-wmf/blob/main/LICENSE). Original copyright notices and upstream attribution are retained.

Please consult the attached LICENSE file for details.  All rights not explicitly
granted by the Apache 2.0 License are reserved by the Original Author.

See [NOTICE](https://github.com/alexandroit/stackline-wmf/blob/main/NOTICE) for retained attribution.

## Credits and original authors

- Original project: [js-wmf](https://github.com/SheetJS/js-wmf).
- sheetjs.
- Copyright (C) 2020-present   SheetJS LLC.
- Stackline maintenance: [Alexandro Paixao Marques](https://www.linkedin.com/in/aleinfo/) and [Stackline contributors](https://github.com/alexandroit).

Original copyright, license notices and contributor acknowledgements remain part of this distribution. Stackline maintenance does not replace authorship of the original work.

## Community and Links

- [Stackline website](https://alexandro.net/)
- [GitHub projects](https://github.com/alexandroit)
- [npm packages](https://www.npmjs.com/~alex360qc)
- [Reddit community — r/Stackline](https://www.reddit.com/r/Stackline/)
- [Maintainer LinkedIn](https://www.linkedin.com/in/aleinfo/)

Use this repository's issue tracker for reproducible bugs and feature requests. Join r/Stackline for examples, usage questions and release discussions.
