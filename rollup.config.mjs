import ts from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))
const watch = { include: 'src/**' }
const external = [
  'typescript',
  'fast-glob',
  'path',
  'fs',
  'ts-simple-type',
  'yargs',
  'yargs/helpers',
  'get-caller-file',
  'y18n',
]
const replaceVersionConfig = {
  VERSION: pkg.version,
  delimiters: ['<@', '@>'],
  preventAssignment: true,
}

export default [
  // ESM config
  {
    input: {
      api: 'src/api.ts',
      cli: 'src/cli.ts',
    },
    output: [
      {
        dir: 'lib',
        format: 'esm',
        chunkFileNames: 'chunk-[name]-[hash].js',
      },
    ],
    plugins: [
      replace(replaceVersionConfig),
      ts({
        module: 'ES2022',
        target: 'ES2022',
      }),
      resolve({
        preferBuiltins: true,
        skip: ['get-caller-file', 'y18n'],
      }),
    ],
    external,
    watch,
  },
]
