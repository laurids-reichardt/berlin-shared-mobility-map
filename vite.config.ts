import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/proj/berlin-shared-mobility-map/',
  plugins: [react()],
})
