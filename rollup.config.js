import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/app.ts',
  output: { file: 'dist/app.js', format: 'esm' },
  plugins: [typescript()]
}
