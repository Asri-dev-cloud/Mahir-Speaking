// ⚡ Konfigurasi Vite Frontend Mahir Speaking: Wusss kenceng anti lag & proxy backend super sat-set! 🚀
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (_err, _req, res) => {
            if (res && !res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, isOffline: true, message: 'Backend offline' }));
            }
          });
        }
      }
    }
  }
});
