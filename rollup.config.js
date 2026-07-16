import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/app.ts',
  output: { file: 'dist/app.js', format: 'esm' },
  plugins: [typescript(), commonjs()]
}
