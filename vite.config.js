import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' keeps every asset reference relative, so the build works under a
// GitHub Pages project subpath (e.g. /weekly/) without hardcoding the repo name.
export default defineConfig({
  base: './',
  plugins: [react()],
})
