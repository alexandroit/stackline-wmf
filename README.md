# @stackline/wmf

Independently maintained Apache-2.0 fork of `wmf@1.0.2`. Original implementation, attribution and license are retained; this is not an official SheetJS release. The precise published source, git commit and SHA-512 integrity are recorded in [UPSTREAM.json](UPSTREAM.json).

```sh
npm install @stackline/wmf
```

```js
const library = require("@stackline/wmf");
```

## Changes in 1.0.0

- Accept a 22-byte META_PLACEABLE prefix before META_HEADER in both dimension extraction and action parsing (upstream issues #1 and #2).
- Reject truncated headers and invalid record lengths before parsing, including zero-length records that cannot make progress. Header failures now use Error objects.
- Restore the exact TypeScript source associated with the npm gitHead (also embedded in its published source map), build both Node and browser exports with pinned esbuild, and include the previously missing TypeScript declarations.

## Development and verification

Use Node.js 18 or newer for development (verified locally with Node 24). Run `npm ci --ignore-scripts`, `npm run build`, `npm run lint`, `npm test`, and `npm run test:package`. The fork declares Node >=18 for its rebuilt distribution; the original Node >=0.8 declaration is not carried forward. Browser builds expose the same `WMF` global and four public functions, without requiring a Node Buffer polyfill. The renderer itself is retained, not rewritten.

`lint` is a JavaScript syntax check, not a claim of a full style/security analysis. All packages have no runtime npm dependencies. `npm audit` reports registry advisories only; absence of findings is not proof that all format parsing is safe.

Five regression tests cover Buffer, Uint8Array, ArrayBuffer, browser-global exports, drawing entrypoint and malformed inputs. Rendering fidelity for arbitrary real-world WMF records is not claimed.

Sources reviewed on 2026-09-27:

- https://github.com/SheetJS/js-wmf/issues/1
- https://github.com/SheetJS/js-wmf/issues/2
- https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-wmf/828e1864-7fe7-42d8-ab0a-1de161b32f27

Publication is performed by the repository GitHub workflow; do not publish from a local checkout. This fork does not modify or publish `@stackline/xlsx`.

## Original upstream documentation

The following retained documentation describes the original library and may use its original package name. For this fork install and import the scoped package shown above.

---

# js-wmf

Processor for Windows MetaFile (WMF) files in JS (for the browser and nodejs).


## Installation

With [npm](https://www.npmjs.org/package/wmf):

```bash
$ npm install wmf
```

In the browser:

```html
<script src="wmf.js"></script>
```

The browser exposes a variable `WMF`.


## Usage

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


## Examples

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


## License

Please consult the attached LICENSE file for details.  All rights not explicitly
granted by the Apache 2.0 License are reserved by the Original Author.


## References

 - `MS-WMF`: Windows Metafile Format

