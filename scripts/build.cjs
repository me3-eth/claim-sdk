const { build } = require('esbuild')
const { dependencies, peerDependencies } = require('../package.json')

const shared = {
  entryPoints: ['index.js'],
  bundle: true,
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV !== 'production',
  target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  external: [
    ...Object.keys(dependencies || {}),
    ...Object.keys(peerDependencies || {})
  ]
}

build({
  ...shared,
  format: 'esm',
  outfile: process.env.NODE_ENV === 'production' ? 'dist/bundle.esm.js' : 'dist/bundle.dev.esm.js'
}).catch(() => process.exit(1))

build({
  ...shared,
  format: 'cjs',
  outfile: process.env.NODE_ENV === 'production' ? 'dist/bundle.cjs.js' : 'dist/bundle.dev.cjs.js'
}).catch(() => process.exit(1))
