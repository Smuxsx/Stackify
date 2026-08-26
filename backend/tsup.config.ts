import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['cjs'],        // Generates the index.cjs file you're currently using
  splitting: false,       // Keep code bundled in a single file for simple backend deployments
  sourcemap: true,        // Helpful for production debugging/error tracking
  clean: true,            // Cleans the dist folder before every fresh build
  noExternal: [           // Forces tsup to bundle Clerk packages directly into your code
    /^@clerk/
  ],
})