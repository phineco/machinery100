import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { prepareArchive, saveArchive, privateInquiryDirectory, uploadLimit } from './inquiry-archive.mjs';
import { prepareInquiry } from '../src/assets/inquiry-payload.js';

import { publicOrigin } from '../src/identity.mjs';

const defaultProductionApi = 'https://q.scyllatech.cn/quant';
const javaSuccess = '保存留言信息成功';
const acceptedCodes = new Set([0, 200, '0', '200', 'success', 'SUCCESS']);
const acceptedStatuses = new Set([...acceptedCodes, 'ok']);
const requestLimit = 12000;
const tooLarge = Symbol('tooLarge');

function acknowledged(body) {
  const text = body.trim();
  if (!text) return true;

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    return text === javaSuccess || /^(ok|success)$/i.test(text);
  }

  if (result === true || result === javaSuccess || result === 'success' || result === 'OK') return true;
  if (!result || typeof result !== 'object' || Array.isArray(result)) return false;
  if ([false, 'false'].includes(result.success) || [false, 'false'].includes(result.result) || result.error) return false;
  if (Object.hasOwn(result, 'code') && !acceptedCodes.has(result.code)) return false;
  if (Object.hasOwn(result, 'status') && !acceptedStatuses.has(result.status)) return false;
  return result.success === true || result.result === true || Object.hasOwn(result, 'code') || Object.hasOwn(result, 'status');
}

function json(response, status, body, headers = {}) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...headers
  });
  response.end(JSON.stringify(body));
}

async function readBody(request, limit = requestLimit) {
  if (Number(request.headers['content-length']) > limit) return tooLarge;

  const chunks = [];
  let bytes = 0;
  for await (const chunk of request.iterator({ destroyOnReturn: false })) {
    bytes += chunk.length;
    if (bytes > limit) return tooLarge;
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export function createInquiryHandler({ production = false, env = process.env } = {}) {
  const base = env.API_BASE_URL?.trim() || env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
    (production ? defaultProductionApi : '');
  const endpoint = env.INQUIRY_API_URL?.trim() || (base && base.replace(/\/+$/, '') + '/machiapi/saveInquiry');
  const siteOrigin = env.SITE_URL?.trim() || (production ? publicOrigin : '');
  const token = env.INQUIRY_API_TOKEN;

  let directory;
  if (endpoint) {
    const url = new URL(endpoint);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
      throw new Error('The inquiry API must be an HTTP(S) URL without embedded credentials.');
    }
  }

  async function notify(payload) {
    if (!endpoint) return 'unconfigured';
    try {
      const upstream = await fetch(endpoint, {
        method: 'POST',
        redirect: 'error',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: 'Bearer ' + token } : {})
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000)
      });
      if (!upstream.ok) {
        await upstream.body?.cancel();
        return 'delivery_failed';
      }

      const body = await upstream.text();
      const emptyHtml = !body.trim() && upstream.headers.get('content-type')?.includes('text/html');
      if (emptyHtml || !acknowledged(body)) {
        console.warn('[inquiries] unconfirmed response from Java', upstream.status);
        return 'unconfirmed';
      }
      return 'submitted';
    } catch {
      // A connection drop or timeout can occur after Java accepted the request.
      console.warn('[inquiries] Java did not return an acknowledgement');
      return 'unconfirmed';
    }
  }

  async function archiveInquiry(response, body, contentType) {
    try {
      directory ??= privateInquiryDirectory(env.INQUIRY_DATA_DIR?.trim());
      const privateDirectory = await directory;
      if (!privateDirectory) return json(response, 503, { error: 'storage_unavailable' });
      const archive = await prepareArchive(body, contentType);
      if (archive.error) return json(response, 400, { error: archive.error });
      const stored = await saveArchive(privateDirectory, archive);
      if (stored.conflict) return json(response, 409, { error: 'submission_conflict' });

      const notification = join(stored.destination, 'notification.txt');
      let delivery = 'pending';
      if (stored.created) {
        delivery = await notify(archive.payload);
        await writeFile(notification, delivery + '\n', { mode: 0o600 }).catch(() => {
          console.warn('[inquiries] Could not save notification status for', archive.reference);
        });
      } else {
        delivery = (await readFile(notification, 'utf8').catch(() => 'pending')).trim();
      }
      return json(response, 201, {
        success: true, reference: archive.reference, delivery: delivery === 'submitted' ? 'submitted' : 'saved'
      });
    } catch (error) {
      directory = undefined;
      console.warn('[inquiries] Could not save inquiry archive:', error.code ?? error.name);
      return json(response, 503, { error: 'storage_unavailable' });
    }
  }

  return async function inquiryHandler(request, response) {
    if (request.method !== 'POST') return json(response, 405, { error: 'method' }, { Allow: 'POST' });
    const origin = request.headers.origin;
    if (origin && origin !== (siteOrigin || 'http://' + request.headers.host)) {
      return json(response, 403, { error: 'origin' });
    }
    const contentType = request.headers['content-type'] ?? '';
    const mime = contentType.split(';')[0].trim().toLowerCase();
    const multipart = mime === 'multipart/form-data';
    if (!multipart && mime !== 'application/json') return json(response, 415, { error: 'content_type' });
    if (multipart && !env.INQUIRY_DATA_DIR?.trim()) return json(response, 503, { error: 'storage_unavailable' });

    let body, data;
    try {
      body = await readBody(request, multipart ? uploadLimit : requestLimit);
      if (!multipart && body !== tooLarge) data = JSON.parse(body.toString('utf8'));
    } catch {
      return json(response, 400, { error: multipart ? 'invalid_body' : 'invalid_json' });
    }
    if (body === tooLarge) return json(response, 413, { error: 'too_large' }, { Connection: 'close' });
    if (multipart) return archiveInquiry(response, body, contentType);

    const { payload, error } = prepareInquiry(data);
    if (error) return json(response, 400, { error });
    const delivery = await notify(payload);
    if (delivery === 'unconfigured') return json(response, 503, { error: delivery });
    if (delivery !== 'submitted') return json(response, 502, { error: delivery });
    return json(response, 201, { success: true, delivery });
  };
}
