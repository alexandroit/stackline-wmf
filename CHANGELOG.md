# Changelog

## 1.0.1 (2026-09-28)

- Standardize package documentation, preserve the API reference and upstream attribution, and add Stackline community links.
- Add focused npm discovery keywords and consistent repository metadata.
- Keep runtime behavior and dependency versions unchanged.
- Correct the pinned artifact-upload action commit while preserving the publish.yml workflow and Prod environment.

## 1.0.0

- Accept a 22-byte META_PLACEABLE prefix before META_HEADER in both dimension extraction and action parsing (upstream issues #1 and #2).
- Reject truncated headers and invalid record lengths before parsing, including zero-length records that cannot make progress. Header failures now use Error objects.
- Restore the exact TypeScript source associated with the npm gitHead (also embedded in its published source map), build both Node and browser exports with pinned esbuild, and include the previously missing TypeScript declarations.

Initial scoped release based on upstream wmf@1.0.2. See UPSTREAM.json for exact source identity.
