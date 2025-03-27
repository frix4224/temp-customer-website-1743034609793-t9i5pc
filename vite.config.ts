import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createPayment } from './src/api/create-payment';
import { checkPayment } from './src/api/check-payment';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-server',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          try {
            // Handle CORS preflight
            if (req.method === 'OPTIONS') {
              res.writeHead(204, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
              });
              res.end();
              return;
            }

            // Route handling
            if (req.url?.startsWith('/api/create-payment')) {
              if (req.method !== 'POST') {
                res.writeHead(405, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Method not allowed' }));
                return;
              }

              // Parse request body
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });

              await new Promise<void>((resolve) => {
                req.on('end', () => {
                  try {
                    (req as any).body = JSON.parse(body);
                    resolve();
                  } catch (e) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                  }
                });
              });

              // Create Request object for createPayment function
              const request = new Request('http://localhost/api/create-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify((req as any).body)
              });

              // Handle payment creation
              const response = await createPayment(request);
              const data = await response.json();
              const headers = Object.fromEntries(response.headers.entries());

              res.writeHead(response.status, {
                'Content-Type': 'application/json',
                ...headers
              });
              res.end(JSON.stringify(data));
              return;
            }

            if (req.url?.startsWith('/api/check-payment')) {
              if (req.method !== 'GET') {
                res.writeHead(405, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Method not allowed' }));
                return;
              }

              // Create Request object for checkPayment function
              const request = new Request(`http://localhost${req.url}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                }
              });

              // Handle payment check
              const response = await checkPayment(request);
              const data = await response.json();
              const headers = Object.fromEntries(response.headers.entries());

              res.writeHead(response.status, {
                'Content-Type': 'application/json',
                ...headers
              });
              res.end(JSON.stringify(data));
              return;
            }

            next();
          } catch (error) {
            console.error('Server error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              error: error instanceof Error ? error.message : 'Internal server error' 
            }));
          }
        });
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  }
});