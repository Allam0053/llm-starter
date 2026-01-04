import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [react()],
        define: {
            // Check if VITE_OLLAMA_API_KEY is loaded, if not try dotenv directly which might handle some encoding better or just be explicit
            'VITE_OLLAMA_API_KEY': JSON.stringify(process.env.VITE_OLLAMA_API_KEY),
        },
        server: {
            proxy: {
                '/api': {
                    target: 'http://localhost:8000',
                    changeOrigin: true,
                    secure: false,
                },
                '/ollama-cloud': {
                    target: 'https://ollama.com',
                    changeOrigin: true,
                    secure: true,
                    rewrite: (path) => path.replace(/^\/ollama-cloud/, ''),
                }
            }
        }
    }
})
