import { inquiryLimits, inquiryMessage, prepareInquiry } from './inquiry-payload.js';

const filters = document.querySelector('[data-filters]');
if (filters) {
  const categories = [...document.querySelectorAll('.category-list > li')];
  const fields = [...filters.querySelectorAll('select')];
  const feedback = filters.querySelector('output');
  const empty = document.querySelector('[data-filter-empty]');
  filters.hidden = false;
  filters.addEventListener('change', () => {
    for (const card of categories) {
      card.hidden = !fields.every((field) => !field.value || card.dataset[field.name] === field.value);
    }
    const visible = categories.filter((card) => !card.hidden).length;
    feedback.value = visible + ' / ' + categories.length;
    empty.hidden = visible > 0;
  });
}

const lookup = document.getElementById('inquiry-items');
const items = lookup ? JSON.parse(lookup.textContent) : {};
const quoteList = new Map();
const quoteKey = 'machinery100-quote-list';
try {
  for (const [id, quantity] of JSON.parse(localStorage.getItem(quoteKey) ?? '[]')) {
    if (Object.hasOwn(items, id) && Number.isInteger(quantity) && quantity >= 1 && quantity <= 99999) {
      quoteList.set(id, quantity);
    }
  }
} catch {
  // The quote list remains usable in this page when storage is unavailable.
}

function updateQuoteCount() {
  for (const badge of document.querySelectorAll('[data-quote-count]')) {
    badge.textContent = quoteList.size ? ' (' + quoteList.size + ')' : '';
  }
}
function saveQuoteList() {
  try {
    localStorage.setItem(quoteKey, JSON.stringify([...quoteList]));
  } catch {
    // The current page still holds the selected items.
  }
  updateQuoteCount();
}
updateQuoteCount();

for (const button of document.querySelectorAll('[data-add-quote]')) {
  const id = button.dataset.addQuote;
  const refresh = () => button.setAttribute('aria-pressed', String(quoteList.has(id)));
  button.hidden = false;
  refresh();
  button.addEventListener('click', () => {
    if (quoteList.has(id)) quoteList.delete(id);
    else quoteList.set(id, 1);
    saveQuoteList();
    refresh();
  });
}

const catalogSearch = document.querySelector('[data-catalog-search]');
if (catalogSearch) {
  const query = catalogSearch.querySelector('input');
  const results = catalogSearch.querySelector('.search-results');
  const rows = [...results.querySelectorAll('li')];
  const empty = results.querySelector('[data-no-match]');
  const inquiryLink = empty.querySelector('a');
  const inquiryUrl = new URL(inquiryLink.href);
  function filterCategories() {
    const term = query.value.trim();
    const words = term.toLowerCase().split(/\s+/);
    const normalized = term.toLowerCase().replace(/[\s-]/g, '');
    const canNormalize = normalized && /[0-9]/.test(normalized);
    let count = 0;
    for (const row of rows) {
      const name = row.dataset.searchName.toLowerCase();
      row.hidden = !words.every((word) => name.includes(word)) &&
        !(canNormalize && name.replace(/[\s-]/g, '').includes(normalized));
      if (!row.hidden) count++;
    }
    empty.hidden = count > 0;
    inquiryUrl.searchParams.set('q', term);
    inquiryLink.href = inquiryUrl.href;
    results.hidden = !term;
  }
  catalogSearch.hidden = false;
  query.addEventListener('input', filterCategories);
  query.addEventListener('focus', filterCategories);
  function focusFirstResult() {
    filterCategories();
    if (!results.hidden) (results.querySelector('li:not([hidden]) a') ?? inquiryLink).focus();
  }
  catalogSearch.addEventListener('submit', (event) => {
    event.preventDefault();
    focusFirstResult();
  });
  for (const shortcut of catalogSearch.querySelectorAll('[data-search-term]')) {
    shortcut.addEventListener('click', () => {
      query.value = shortcut.dataset.searchTerm;
      focusFirstResult();
    });
  }
  function focusFromHeader() {
    if (location.hash === '#catalog-search') query.focus({ preventScroll: true });
  }
  window.addEventListener('hashchange', focusFromHeader);
  focusFromHeader();
  catalogSearch.addEventListener('focusout', (event) => {
    if (!catalogSearch.contains(event.relatedTarget)) results.hidden = true;
  });
  catalogSearch.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      query.focus();
      results.hidden = true;
    }
    if (event.key === 'ArrowDown' && event.target === query && !results.hidden) {
      event.preventDefault();
      focusFirstResult();
    }
  });
}

const play = document.querySelector('[data-video]');
const slot = document.querySelector('[data-video-slot]');
if (play && slot) {
  play.hidden = false;
  play.addEventListener('click', () => {
    const video = document.createElement('video');
    video.src = play.dataset.video;
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.setAttribute('aria-label', play.dataset.videoLabel);
    slot.replaceChildren(video);
    slot.hidden = false;
    play.hidden = true;
    video.focus();
    video.play().catch(() => {});
  }, { once: true });
}

const form = document.querySelector('[data-inquiry]');
if (form) {
  const fields = form.querySelector('.inquiry-fields');
  const type = form.elements.namedItem('type');
  const hint = document.querySelector('#inquiry-hint');
  const budget = form.querySelector('[data-budget]');
  const status = form.querySelector('[data-inquiry-status]');
  const submit = form.querySelector('button[type="submit"]');
  const prepareDraft = form.querySelector('[data-prepare-draft]');
  const language = document.querySelector('[data-language-switch]');
  const draft = form.querySelector('[data-draft]');
  const preview = form.querySelector('[data-draft-preview]');
  const download = form.querySelector('[data-download]');
  const emailDraft = form.querySelector('[data-email-draft]');
  const validTypes = new Set([...type.options].map((option) => option.value));
  const params = new URL(location.href).searchParams;
  const fromQuery = params.get('type');
  const id = params.get('item');
  const item = Object.hasOwn(items, id) && items[id].type === fromQuery ? items[id] : null;
  const term = (params.get('q') ?? '').slice(0, 100);
  if (item || term) form.elements.requirements.value = item?.name ?? term;
  const initialType = validTypes.has(fromQuery) ? fromQuery : '';
  const locale = document.documentElement.lang;
  let draftUrl;

  const quoteSection = form.querySelector('#quote-list');
  const quoteLines = form.querySelector('[data-quote-lines]');
  const quoteEmpty = form.querySelector('[data-quote-empty]');
  const uploads = form.elements.files;
  let submissionId;

  function renderQuoteList() {
    quoteEmpty.hidden = quoteList.size > 0;
    quoteLines.replaceChildren();
    for (const [id, quantity] of quoteList) {
      const line = document.createElement('div');
      line.className = 'quote-line';
      const name = document.createElement('span');
      name.textContent = items[id].name;
      const label = document.createElement('label');
      label.textContent = quoteLines.dataset.quantity;
      const field = document.createElement('input');
      field.type = 'number';
      field.min = '1';
      field.max = '99999';
      field.required = true;
      field.value = quantity;
      field.setAttribute('aria-label', quoteLines.dataset.quantity + ' · ' + items[id].name);
      field.addEventListener('change', () => {
        if (!field.checkValidity()) return;
        quoteList.set(id, field.valueAsNumber);
        saveQuoteList();
      });
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = quoteLines.dataset.remove;
      remove.setAttribute('aria-label', quoteLines.dataset.remove + ' · ' + items[id].name);
      remove.addEventListener('click', () => {
        quoteList.delete(id);
        saveQuoteList();
        submissionId = undefined;
        renderQuoteList();
        uploads.focus();
        updateBudget();
      });
      label.append(field);
      line.append(name, label, remove);
      quoteLines.append(line);
    }
  }

  quoteSection.hidden = false;
  uploads.closest('label').hidden = false;
  document.getElementById('file-hint').hidden = false;
  renderQuoteList();

  const values = () => {
    const data = new FormData(form);
    data.delete('files');
    return { ...Object.fromEntries(data), locale };
  };
  const hasExtras = () => quoteList.size > 0 || uploads.files.length > 0;

  function refreshType() {
    hint.textContent = hint.dataset['hint' + type.value.charAt(0).toUpperCase() + type.value.slice(1)] ??
      hint.dataset.hintDefault;
    if (language) {
      const url = new URL(language.href);
      if (type.value) url.searchParams.set('type', type.value);
      else url.searchParams.delete('type');
      if (item && item.type === type.value) url.searchParams.set('item', id);
      else url.searchParams.delete('item');
      if (term) url.searchParams.set('q', term);
      language.href = url.pathname + url.search;
    }
  }

  function updateBudget() {
    form.elements.requirements.required = !hasExtras();
    budget.parentElement.hidden = hasExtras();
    const used = inquiryMessage(values()).length;
    budget.textContent = used + ' / ' + inquiryLimits.message;
    budget.classList.toggle('over', used > inquiryLimits.message);
  }

  function showStatus(message, state = 'error') {
    status.textContent = status.dataset[message] ?? '';
    status.dataset.state = state;
  }

  function revokeDraft() {
    if (draftUrl) URL.revokeObjectURL(draftUrl);
    draftUrl = undefined;
    draft.hidden = true;
    preview.textContent = '';
    download.removeAttribute('href');
    emailDraft?.removeAttribute('href');
  }

  const publicFields = ['name', 'email', 'phoneNumber', 'country', 'type', 'requirements']
    .map((key) => form.elements.namedItem(key));

  function validateTextFields() {
    for (const field of publicFields) {
      if (field.required && !field.value.trim()) {
        field.setCustomValidity(locale === 'en' ? 'Please fill in this field.' : '请填写此项。');
      }
      if (!field.reportValidity()) return false;
    }
    return true;
  }

  function resetFields() {
    form.reset();
    type.value = initialType;
    refreshType();
    revokeDraft();
  }

  function showDeliveryError(response, result) {
    const errors = {
      message_too_long: 'tooLong',
      invalid_fields: 'invalid',
      invalid_submission: 'invalid',
      unconfigured: 'unavailable',
      delivery_failed: 'failed'
    };
    if ([404, 405, 503].includes(response.status)) {
      showStatus('unavailable');
      return;
    }
    showStatus(Object.hasOwn(errors, result?.error) ? errors[result.error] : 'unconfirmed');
  }

  type.value = initialType || (quoteList.size ? (quoteList.size === 1 ? items[quoteList.keys().next().value].type : 'project') : '');
  submit.disabled = false;
  prepareDraft.disabled = false;
  refreshType();
  updateBudget();
  type.addEventListener('change', refreshType);
  form.addEventListener('input', (event) => {
    event.target.setCustomValidity?.('');
    submissionId = undefined;
    if (!draft.hidden) revokeDraft();
    showStatus('');
    updateBudget();
  });

  uploads.addEventListener('change', updateBudget);

  prepareDraft.addEventListener('click', () => {
    if (!validateTextFields() || [...quoteLines.querySelectorAll('input')].some((field) => !field.reportValidity())) return;
    revokeDraft();
    const lines = publicFields.filter((field) => field.value.trim()).map((field) => {
      const label = field.labels[0].firstChild.textContent;
      const value = field === type ? type.selectedOptions[0].textContent : field.value.trim();
      return label + ': ' + value;
    });
    for (const [id, quantity] of quoteList) lines.push(items[id].name + ' × ' + quantity);
    for (const file of uploads.files) lines.push(file.name);
    const text = lines.join('\n');
    draftUrl = URL.createObjectURL(new Blob([text + '\n'], { type: 'text/plain;charset=utf-8' }));
    download.href = draftUrl;
    if (emailDraft) {
      emailDraft.href = 'mailto:' + form.dataset.contactEmail + '?subject=' +
        encodeURIComponent(form.dataset.subject) + '&body=' + encodeURIComponent(text);
    }
    preview.textContent = text;
    draft.hidden = false;
    draft.querySelector('[role="status"]').focus();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (fields.disabled || !validateTextFields()) return;
    const data = values();
    const extended = hasExtras() || Boolean(submissionId);
    const files = [...uploads.files];
    if (files.length > 3 || files.some((file) => file.size < 1 || file.size > 5000000 ||
        !/\.(jpe?g|png|webp|xlsx?|csv)$/i.test(file.name)) || files.reduce((size, file) => size + file.size, 0) > 10000000) {
      showStatus('invalidFiles');
      status.focus();
      return;
    }
    const { error } = prepareInquiry(extended ? { ...data, requirements: 'Inquiry with files or a quote list.' } : data);
    if (error) {
      showStatus(error === 'message_too_long' ? 'tooLong' : 'invalid');
      status.focus();
      return;
    }

    let body = JSON.stringify(data);
    if (extended) {
      if (!globalThis.crypto?.randomUUID) {
        showStatus('storageError');
        status.focus();
        return;
      }
      submissionId ??= crypto.randomUUID();
      body = new FormData();
      const lines = [...quoteList].map(([id, quantity]) => ({ id, quantity }));
      body.set('inquiry', JSON.stringify({ ...data, lines, submissionId }));
      for (const file of files) body.append('files', file);
    }

    fields.disabled = true;
    showStatus('sending', 'sending');
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: extended ? undefined : { 'Content-Type': 'application/json' },
        body
      });
      const result = await response.json().catch(() => null);
      if (response.ok && result?.success === true && result.reference) {
        quoteList.clear();
        saveQuoteList();
        resetFields();
        renderQuoteList();
        submissionId = undefined;
        showStatus(result.delivery === 'submitted' ? 'success' : 'pending', 'success');
        status.textContent += ' ' + status.dataset.received + result.reference;
      } else if (extended && result?.error === 'invalid_files') {
        showStatus('invalidFiles');
      } else if (extended && response.status >= 400) {
        showStatus('storageError');
      } else if (response.status === 201 && result?.success === true && result.delivery === 'submitted') {
        resetFields();
        showStatus('success', 'success');
      } else {
        showDeliveryError(response, result);
      }
    } catch {
      showStatus('unconfirmed');
    } finally {
      fields.disabled = false;
      updateBudget();
      status.focus();
    }
  });
}
