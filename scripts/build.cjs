const { buildSync } = require('esbuild');
const shared = { entryPoints: ['src/index.ts'], bundle: true, sourcemap: true, target: 'es2015', legalComments: 'inline' };
buildSync({ ...shared, platform: 'node', format: 'cjs', outfile: 'dist/wmf.node.js' });
buildSync({ ...shared, platform: 'browser', format: 'iife', globalName: 'WMF', outfile: 'dist/wmf.js' });
