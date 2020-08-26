const path = require('path')
import buble from '@rollup/plugin-buble'
import commonjs from '@rollup/plugin-commonjs'
import node from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import { terser } from "rollup-plugin-terser"

const version = process.env.VERSION || require('../package.json').version
const resolve = dir => path.resolve(__dirname, '../', dir)

const banner =
  '/**\n' +
  ` * xlmongo.js v${version}\n` +
  ` * (c) 2020-${new Date().getFullYear()} 君惜\n` +
  ' * Released under the ISC License.\n' +
  ' */'

const external = Object.keys(require('../package.json').dependencies)

const builds = {
  'cjs': {
    entry: resolve('src/index.js'),
    dest: resolve('dist/xlmongo.cjs.js'),
    format: 'cjs',
    env: 'production',
    exports: 'default',
    external,
    banner
  },
  'es': {
    entry: resolve('src/index.js'),
    dest: resolve('dist/xlmongo.es.js'),
    format: 'es',
    env: 'production',
    external,
    banner
  },
  'umd': {
    entry: resolve('src/index.js'),
    dest: resolve('dist/xlmongo.min.js'),
    format: 'umd',
    env: 'production',
    plugins: [
      babel({ babelHelpers: 'bundled', exclude: 'node_modules/**' }),
      terser()
      // babel({ babelHelpers: 'runtime', exclude: 'node_modules/**' })
    ],
    external,
    banner
  }
}

function genConfig (format) {
  const opts = builds[format]
  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [
      node(),
      commonjs(),
      json()
    ].concat(opts.plugins || []),
    output: {
      file: opts.dest,
      format: opts.format,
      exports: opts.exports ? opts.exports : 'auto',
      banner: opts.banner,
      name: opts.moduleName || 'xlmongo'
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }

  const vars = {}

  if (opts.env) {
    vars['process.env.NODE_ENV'] = JSON.stringify(opts.env)
  }
  config.plugins.push(replace(vars))

  if (opts.transpile !== false) {
    config.plugins.push(buble({
      objectAssign: 'Object.assign',
      transforms: {
        arrow: true,
        dangerousForOf: true,
        asyncAwait: false,
        generator: false
      }
    }))
  }

  Object.defineProperty(config, '_format', {
    enumerable: false,
    value: format
  })

  return config
}

const format = process.env.FORMAT || 'cjs'

export default genConfig(format)
