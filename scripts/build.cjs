const { nodeExternalsPlugin } = require('esbuild-node-externals')

require('esbuild').build({
  entryPoints: ['index.js'],
  bundle: true,
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV !== 'production',
  target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  plugins: [
    nodeExternalsPlugin({ packagePath: 'package.json' })
  ],
  outfile: process.env.NODE_ENV === 'production' ? 'dist/bundle.js' : 'dist/bundle.dev.js'
}).catch(() => process.exit(1))
