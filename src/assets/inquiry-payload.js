export const inquiryLimits = Object.freeze({ name: 64, email: 64, phoneNumber: 64, country: 100, message: 1024 });

const locales = new Set(['en', 'zh-CN']);
const types = new Set(['equipment', 'attachments', 'parts', 'dealer', 'project']);
const fields = ['name', 'email', 'phoneNumber', 'country', 'type', 'requirements', 'locale', 'consent', 'website'];
const emailPattern = /^[^\s<>@"(),:;]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i;
const escaped = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => escaped[character]);
const text = (value) => typeof value === 'string' ? value.trim() : '';
const line = (value) => text(value).replace(/\s+/g, ' ');

export function inquiryMessage(values) {
  return [
    '[Machinery100]',
    'Destination: ' + line(values.country),
    'Inquiry type: ' + text(values.type),
    'Language: ' + text(values.locale),
    '',
    'Inquiry:',
    text(values.requirements)
  ].map(escapeHtml).join('\n');
}

export function prepareInquiry(values) {
  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    return { error: 'invalid_fields' };
  }
  if (fields.some((key) => Object.hasOwn(values, key) && typeof values[key] !== 'string')) {
    return { error: 'invalid_fields' };
  }
  if (values.website) return { error: 'invalid_submission' };

  const name = escapeHtml(line(values.name));
  const email = text(values.email);
  const phoneNumber = escapeHtml(line(values.phoneNumber));
  const country = line(values.country);
  if (
    !name || name.length > inquiryLimits.name ||
    !emailPattern.test(email) || email.length > inquiryLimits.email ||
    phoneNumber.length > inquiryLimits.phoneNumber ||
    !country || country.length > inquiryLimits.country ||
    !types.has(values.type) || !locales.has(values.locale) ||
    values.consent !== 'yes' || !text(values.requirements)
  ) {
    return { error: 'invalid_fields' };
  }
  const message = inquiryMessage(values);
  if (message.length > inquiryLimits.message) return { error: 'message_too_long' };

  // Sourcing categories are not Java product IDs.
  return { payload: { name, email, phoneNumber, message, productId: '' } };
}
