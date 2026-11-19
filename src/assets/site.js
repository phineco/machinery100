import { inquiryLimits, inquiryMessage, prepareInquiry } from './inquiry-payload.js';

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

if (menu && nav) {
  const narrow = matchMedia('(max-width: 1120px)');
  function resetMenu() {
    menu.hidden = !narrow.matches;
    menu.toggleAttribute('data-ready', narrow.matches);
    menu.setAttribute('aria-expanded', 'false');
    nav.toggleAttribute('data-collapsed', narrow.matches);
  }
  resetMenu();
  narrow.addEventListener('change', resetMenu);
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.toggleAttribute('data-collapsed', !open);
  });
  nav.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && narrow.matches) {
      resetMenu();
      menu.focus();
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
  const fromQuery = new URL(location.href).searchParams.get('type');
  const initialType = validTypes.has(fromQuery) ? fromQuery : '';
  const locale = document.documentElement.lang;
  let draftUrl;

  const values = () => ({ ...Object.fromEntries(new FormData(form)), locale });

  function refreshType() {
    hint.textContent = hint.dataset['hint' + type.value.charAt(0).toUpperCase() + type.value.slice(1)] ??
      hint.dataset.hintDefault;
    if (language) {
      const url = new URL(language.href);
      if (type.value) url.searchParams.set('type', type.value);
      else url.searchParams.delete('type');
      language.href = url.pathname + url.search;
    }
  }

  function updateBudget() {
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

  type.value = initialType;
  submit.disabled = false;
  prepareDraft.disabled = false;
  refreshType();
  updateBudget();
  type.addEventListener('change', refreshType);
  form.addEventListener('input', (event) => {
    event.target.setCustomValidity?.('');
    if (!draft.hidden) revokeDraft();
    showStatus('');
    updateBudget();
  });

  prepareDraft.addEventListener('click', () => {
    if (!validateTextFields()) return;
    revokeDraft();
    const lines = publicFields.filter((field) => field.value.trim()).map((field) => {
      const label = field.labels[0].firstChild.textContent;
      const value = field === type ? type.selectedOptions[0].textContent : field.value.trim();
      return label + ': ' + value;
    });
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
    const { error } = prepareInquiry(data);
    if (error) {
      showStatus(error === 'message_too_long' ? 'tooLong' : 'invalid');
      status.focus();
      return;
    }

    fields.disabled = true;
    showStatus('sending', 'sending');
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json().catch(() => null);
      if (response.status === 201 && result?.success === true && result.delivery === 'submitted') {
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
