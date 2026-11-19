import { prepareInquiry } from '../src/assets/inquiry-payload.js';

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

async function readBody(request) {
  if (Number(request.headers['content-length']) > requestLimit) return tooLarge;

  const chunks = [];
  let bytes = 0;
  for await (const chunk of request.iterator({ destroyOnReturn: false })) {
    bytes += chunk.length;
    if (bytes > requestLimit) return tooLarge;
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export function createInquiryHandler({ production = false, env = process.env } = {}) {
  const base = env.API_BASE_URL?.trim() || env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
    (production ? defaultProductionApi : '');
  const endpoint = env.INQUIRY_API_URL?.trim() || (base && base.replace(/\/+$/, '') + '/machiapi/saveInquiry');
  const siteOrigin = env.SITE_URL?.trim();
  const token = env.INQUIRY_API_TOKEN;

  if (endpoint) {
    const url = new URL(endpoint);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
      throw new Error('The inquiry API must be an HTTP(S) URL without embedded credentials.');
    }
  }

  return async function inquiryHandler(request, response) {
    if (request.method !== 'POST') return json(response, 405, { error: 'method' }, { Allow: 'POST' });
    const origin = request.headers.origin;
    if (origin && origin !== (siteOrigin || 'http://' + request.headers.host)) {
      return json(response, 403, { error: 'origin' });
    }
    if (request.headers['content-type']?.split(';')[0].trim().toLowerCase() !== 'application/json') {
      return json(response, 415, { error: 'content_type' });
    }

    let data;
    try {
      data = await readBody(request);
    } catch {
      return json(response, 400, { error: 'invalid_json' });
    }

    if (data === tooLarge) return json(response, 413, { error: 'too_large' }, { Connection: 'close' });
    const { payload, error } = prepareInquiry(data);
    if (error) return json(response, 400, { error });
    if (!endpoint) return json(response, 503, { error: 'unconfigured' });

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
        return json(response, 502, { error: 'delivery_failed' });
      }

      const body = await upstream.text();
      const emptyHtml = !body.trim() && upstream.headers.get('content-type')?.includes('text/html');
      if (emptyHtml || !acknowledged(body)) {
        console.warn('[inquiries] unconfirmed response from Java', upstream.status);
        return json(response, 502, { error: 'unconfirmed' });
      }
      return json(response, 201, { success: true, delivery: 'submitted' });
    } catch {
      // A connection drop or timeout can occur after Java accepted the request.
      console.warn('[inquiries] Java did not return an acknowledgement');
      return json(response, 502, { error: 'unconfirmed' });
    }
  };
}
