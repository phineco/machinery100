import { createServer } from 'node:http';
import { stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInquiryHandler } from './inquiry-api.mjs';

const base = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.env.PORT ?? '4173');
const host = '127.0.0.1';
const production = process.argv.includes('--production');
const handleInquiry = createInquiryHandler({ production });
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

try {
  await stat(join(base, 'index.html'));
} catch (error) {
  if (!production || error.code !== 'ENOENT') throw error;
  await import('./build.mjs');
}

const server = createServer(async (request, response) => {
  if (request.url.split('?')[0] === '/api/inquiries') {
    await handleInquiry(request, response);
    return;
  }
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  let status = 200;
  let file;
  let details;

  try {
    const url = new URL(request.url, 'http://' + host);
    if (url.pathname === '/') {
      response.writeHead(302, { Location: '/en/' }).end();
      return;
    }
    file = resolve(base, '.' + decodeURIComponent(url.pathname));
    if (relative(base, file).startsWith('..')) throw new Error('Outside preview directory');
    details = await stat(file);
    if (details.isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        response.writeHead(308, { Location: url.pathname + '/' + url.search }).end();
        return;
      }
      file = join(file, 'index.html');
      details = await stat(file);
    }
  } catch {
    file = join(base, '404.html');
    details = await stat(file);
    status = 404;
  }

  const headers = {
    'Content-Type': mime[extname(file)] ?? 'application/octet-stream',
    'Content-Length': details.size,
    'X-Content-Type-Options': 'nosniff'
  };

  const range = status === 200 && extname(file) === '.mp4' && request.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  if (range) {
    const start = Number(range[1]);
    const end = range[2] ? Math.min(Number(range[2]), details.size - 1) : details.size - 1;
    if (start >= details.size || start > end) {
      response.writeHead(416, { 'Content-Range': 'bytes */' + details.size }).end();
      return;
    }
    headers['Content-Length'] = end - start + 1;
    headers['Content-Range'] = 'bytes ' + start + '-' + end + '/' + details.size;
    headers['Accept-Ranges'] = 'bytes';
    response.writeHead(206, headers);
    if (request.method === 'HEAD') response.end();
    else createReadStream(file, { start, end }).pipe(response);
    return;
  }

  response.writeHead(status, headers);
  if (request.method === 'HEAD') response.end();
  else createReadStream(file).pipe(response);
});

server.listen(port, host, () => {
  console.log((production ? 'Site server: ' : 'Local preview: ') + 'http://' + host + ':' + server.address().port + '/');
});
