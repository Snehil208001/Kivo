import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Make .env values visible to the dev proxy below (which reads process.env,
  // like the Vercel function does in production).
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return {
    plugins: [
      react(),
      // Serve /api/shopify in `vite dev` by reusing the same forward logic the
      // Vercel function uses in production, so dev and prod behave identically.
      {
        name: 'shopify-dev-proxy',
        configureServer(server) {
          server.middlewares.use('/api/shopify', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              return res.end('POST only');
            }
            const { shopifyForward } = await import('./api/shopify.js');
            let raw = '';
            req.on('data', (c) => (raw += c));
            req.on('end', async () => {
              res.setHeader('Content-Type', 'application/json');
              try {
                const { status, body } = await shopifyForward(JSON.parse(raw || '{}'));
                res.statusCode = status;
                res.end(body);
              } catch (e) {
                res.statusCode = 502;
                res.end(JSON.stringify({ errors: [{ message: e.message }] }));
              }
            });
          });
        },
      },
    ],
    server: { port: 5173, host: true },
  };
});
