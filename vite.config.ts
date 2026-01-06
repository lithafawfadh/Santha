import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build optimizations
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion': ['framer-motion'],
          'icons': ['lucide-react'],
          'supabase': ['@supabase/supabase-js']
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    }
  },
  
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', '@supabase/supabase-js', 'framer-motion']
  },
  
  // Enable compression
  server: {
    hmr: {
      overlay: false // Disable error overlay for better performance
    }
  }
});
