import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // <-- Notice the name change here!

export default defineConfig({
  plugins: [react()],
  base: './', 
});