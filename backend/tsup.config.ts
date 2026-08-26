import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],       // Changed from 'cjs' to 'esm'
  splitting: false,
  sourcemap: true,
  clean: true,
  outExtension() {
    return {
      js: '.js',         // Since "type": "module" is set, this will output index.js as ESM
    }
  },
})