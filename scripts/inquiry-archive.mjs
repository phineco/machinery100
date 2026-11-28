import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, realpath, rename, rm, writeFile } from 'node:fs/promises';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inquiryLimits, prepareInquiry } from '../src/assets/inquiry-payload.js';

export const uploadLimit = 10_250_000;
const catalog = JSON.parse(await readFile(new URL('../src/catalog.json', import.meta.url), 'utf8'));
const catalogById = new Map(Object.values(catalog).flat().map((item) => [item.id, item]));
const publicDirectory = fileURLToPath(new URL('../dist', import.meta.url));

export async function privateInquiryDirectory(directory) {
  if (!directory) return null;
  if (!isAbsolute(directory)) throw new Error('INQUIRY_DATA_DIR must be absolute');
  const target = resolve(directory);
  const withinPublic = (path) => {
    const fromPublic = relative(publicDirectory, path);
    return fromPublic === '' || (!fromPublic.startsWith('..') && !isAbsolute(fromPublic));
  };
  if (withinPublic(target)) throw new Error('INQUIRY_DATA_DIR must be outside dist');
  await mkdir(target, { recursive: true, mode: 0o700 });
  const physical = await realpath(target);
  if (withinPublic(physical)) throw new Error('INQUIRY_DATA_DIR must be outside dist');
  return physical;
}

export async function prepareArchive(bytes, contentType) {
  let input, data;
  try {
    input = await new Response(bytes, { headers: { 'Content-Type': contentType } }).formData();
    data = JSON.parse(input.get('inquiry'));
  } catch {
    return { error: 'invalid_fields' };
  }
  if (!data || typeof data !== 'object' || typeof data.requirements !== 'string' ||
      data.requirements.length > inquiryLimits.message ||
      typeof data.submissionId !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(data.submissionId) ||
      !Array.isArray(data.lines) || data.lines.length > catalogById.size) return { error: 'invalid_fields' };

  const ids = new Set();
  const lines = [];
  for (const line of data.lines) {
    const item = catalogById.get(line?.id);
    if (!item || ids.has(line.id) || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 99999) {
      return { error: 'invalid_fields' };
    }
    ids.add(line.id);
    lines.push({ id: line.id, name: item[data.locale], quantity: line.quantity });
  }

  const uploads = input.getAll('files');
  if (uploads.length > 3 || uploads.some((file) => typeof file === 'string' || file.size < 1 || file.size > 5_000_000) ||
      uploads.reduce((total, file) => total + file.size, 0) > 10_000_000) return { error: 'invalid_files' };
  if (!lines.length && !uploads.length && !data.requirements.trim()) return { error: 'invalid_fields' };

  const files = [];
  for (const [index, file] of uploads.entries()) {
    const ext = file.name.toLowerCase().match(/\.(jpe?g|png|webp|xlsx?|csv)$/)?.[1];
    if (!ext) return { error: 'invalid_files' };
    const buffer = Buffer.from(await file.arrayBuffer());
    const validSignatures = {
      jpg: () => buffer.subarray(0, 3).toString('hex') === 'ffd8ff',
      jpeg: () => buffer.subarray(0, 3).toString('hex') === 'ffd8ff',
      png: () => buffer.subarray(0, 8).toString('hex') === '89504e470d0a1a0a',
      webp: () => buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP',
      xlsx: () => buffer.subarray(0, 4).toString('hex') === '504b0304',
      xls: () => buffer.subarray(0, 8).toString('hex') === 'd0cf11e0a1b11ae1',
      csv: () => !buffer.includes(0)
    };
    if (!validSignatures[ext]()) return { error: 'invalid_files' };
    files.push({
      originalName: file.name.slice(0, 255),
      storedName: 'file-' + (index + 1) + '.' + ext,
      size: buffer.length,
      buffer
    });
  }

  const reference = 'CED-' + data.submissionId;
  const notificationSummary = [
    'Inquiry reference: ' + reference,
    'Catalog lines: ' + lines.length + ' · Attachments: ' + files.length,
    data.requirements.trim().slice(0, 120)
  ].join('\n');
  const { payload, error } = prepareInquiry({ ...data, requirements: notificationSummary });
  if (error) return { error };

  const record = {
    reference, name: data.name, email: data.email, phoneNumber: data.phoneNumber,
    country: data.country, type: data.type, locale: data.locale, consent: data.consent,
    requirements: data.requirements, lines,
    files: files.map(({ buffer, ...file }) => ({
      ...file, sha256: createHash('sha256').update(buffer).digest('hex')
    }))
  };
  const digest = createHash('sha256').update(JSON.stringify(record)).digest('hex');
  return { record, reference, files, payload, digest };
}

export async function saveArchive(directory, archive) {
  const destination = join(directory, archive.reference);
  const staging = await mkdtemp(join(directory, '.inquiry-'));
  try {
    await Promise.all([
      writeFile(join(staging, 'inquiry.json'), JSON.stringify({
        ...archive.record, digest: archive.digest, receivedAt: new Date().toISOString()
      }, null, 2) + '\n', { mode: 0o600 }),
      ...archive.files.map((file) => writeFile(join(staging, file.storedName), file.buffer, { mode: 0o600 }))
    ]);
    try {
      await rename(staging, destination);
      return { destination, created: true };
    } catch (error) {
      if (error.code !== 'EEXIST' && error.code !== 'ENOTEMPTY') throw error;
      const previous = JSON.parse(await readFile(join(destination, 'inquiry.json'), 'utf8'));
      return { destination, created: false, conflict: previous.digest !== archive.digest };
    }
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}
