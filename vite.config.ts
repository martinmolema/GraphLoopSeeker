import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
    plugins: [
        checker({ typescript: true }), // live type-checking
    ],
    server: {
        open: true, // opent de browser automatisch bij 'vite dev'
    },
});
