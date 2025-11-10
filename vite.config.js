import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    build: {
        target: 'es2015', // Target ES2015 for better compatibility
        rollupOptions: {
            output: {
                manualChunks: {
                    // Core React and Inertia
                    'react-vendor': ['react', 'react-dom'],
                    'inertia': ['@inertiajs/react'],
                    
                    // Material-UI core
                    'mui-core': ['@mui/material', '@emotion/react', '@emotion/styled'],
                    
                    // Material-UI icons (often large)
                    'mui-icons': ['@mui/icons-material'],
                    
                    // Material-UI Data Grid (if used)
                    'mui-data-grid': ['@mui/x-data-grid'],
                },
            },
        },
        chunkSizeWarningLimit: 600, // Increase limit slightly, but chunks should be smaller now
    },
    esbuild: {
        target: 'es2015', // Ensure esbuild targets ES2015
    },
});
