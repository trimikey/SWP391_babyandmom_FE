import {defineConfig} from 'vite'
import react from  '@vitejs/plugin-react'
import tailwindcss from  'vite-plugin-tailwind'

export default defineConfig({
    plugins: [react(), tailwindcss()]
    })