import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Explicitly serve sitemap.xml with correct application/xml content-type for Google Search Console
  app.get(['/sitemap.xml', '//sitemap.xml'], (req, res) => {
    const candidatePaths = [
      path.resolve(__dirname, 'public/sitemap.xml'),
      path.resolve(__dirname, 'dist/sitemap.xml'),
      path.resolve(__dirname, 'sitemap.xml'),
    ];
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        return res.sendFile(p);
      }
    }
    res.status(404).type('text/plain').send('Sitemap not found');
  });

  // Explicitly serve robots.txt with correct text/plain content-type for Googlebot
  app.get(['/robots.txt', '//robots.txt'], (req, res) => {
    const candidatePaths = [
      path.resolve(__dirname, 'public/robots.txt'),
      path.resolve(__dirname, 'dist/robots.txt'),
      path.resolve(__dirname, 'robots.txt'),
    ];
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        return res.sendFile(p);
      }
    }
    res.status(404).type('text/plain').send('Robots.txt not found');
  });

  if (!isProduction) {
    // Create Vite server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    
    // SPA fallback
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
