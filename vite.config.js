import { defineConfig } from 'vite';
import react from '@vitejs/react-plugin';

export default defineConfig({
  plugins: [react()],
  // This dot makes asset paths relative (./), fixing BOTH Chrome Extensions and GitHub Pages!
  base: './', 
});