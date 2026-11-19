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
  const type = form.elements.namedItem('type');
  const hint = document.querySelector('#inquiry-hint');
  const language = document.querySelector('[data-language-switch]');
  const draft = form.querySelector('[data-draft]');
  const preview = form.querySelector('[data-draft-preview]');
  const download = form.querySelector('[data-download]');
  const emailDraft = form.querySelector('[data-email-draft]');
  const validTypes = new Set([...type.options].map((option) => option.value));
  const fromQuery = new URL(location.href).searchParams.get('type');
  let draftUrl;

  if (validTypes.has(fromQuery)) type.value = fromQuery;

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

  function revokeDraft() {
    if (draftUrl) URL.revokeObjectURL(draftUrl);
    draftUrl = undefined;
    draft.hidden = true;
    preview.textContent = '';
    download.removeAttribute('href');
    emailDraft?.removeAttribute('href');
  }

  form.querySelector('button[type="submit"]').disabled = false;
  refreshType();
  type.addEventListener('change', refreshType);
  form.addEventListener('input', (event) => {
    event.target.setCustomValidity?.('');
    if (!draft.hidden) revokeDraft();
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const keys = ['name', 'email', 'country', 'type', 'requirements'];
    const fields = keys.map((key) => form.elements.namedItem(key));
    const blank = fields.find((field) => !field.value.trim());

    if (blank) {
      const message = document.documentElement.lang === 'en' ? 'Please fill in this field.' : '请填写此项。';
      blank.setCustomValidity(message);
      blank.reportValidity();
      blank.focus();
      return;
    }

    revokeDraft();
    const lines = fields.map((field) => {
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
}
