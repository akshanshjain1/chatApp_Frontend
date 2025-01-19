import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv'
dotenv.config({
 
})
// https://vite.dev/config/
console.log(process.env.VITE_BACKEND_URL)
export default defineConfig({
  server:{
    proxy:{
      "/api": {
        target: process.env.VITE_BACKEND_URL,
        changeOrigin: true, 
        
         
      }
    }
  },
  plugins: [react()],
})
