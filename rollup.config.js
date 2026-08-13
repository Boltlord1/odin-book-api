import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import nodeExternals from 'rollup-plugin-node-externals'

export default {
  input: 'src/app.ts',
  output: { file: 'dist/app.js', format: 'cjs' },
  plugins: [
    typescript(),
    nodeExternals(),
    nodeResolve({ extensions: ['.js', '.ts', '.json'] })
  ]
}
