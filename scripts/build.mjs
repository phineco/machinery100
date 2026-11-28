import { access, cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { brand, publicOrigin } from '../src/identity.mjs';
import { content } from '../src/content.mjs';
import { capabilityImages, equipment, workshop } from '../src/media.mjs';
import { inquiryLimits } from '../src/assets/inquiry-payload.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const catalog = JSON.parse(await readFile(new URL('../src/catalog.json', import.meta.url), 'utf8'));
const locales = Object.keys(content);
const routes = {
  home: '',
  equipment: 'equipment/',
  attachments: 'attachments/',
  parts: 'parts/',
  manufacturing: 'manufacturing/',
  delivery: 'delivery/',
  contact: 'contact/'
};
const email = process.env.CONTACT_EMAIL?.trim() || 'machinery100.china@gmail.com';
const whatsapp = process.env.WHATSAPP_NUMBER?.trim() || '8618948913729';
const siteUrl = process.argv.includes('--preview') ? '' : (process.env.SITE_URL?.trim() ?? publicOrigin);
const facebook = process.env.FACEBOOK_URL?.trim() || '';
if (facebook) {
  const url = new URL(facebook);
  if (url.protocol !== 'https:' || !['facebook.com', 'www.facebook.com', 'm.facebook.com'].includes(url.hostname) ||
      url.username || url.password || url.pathname === '/') {
    throw new Error('FACEBOOK_URL must point to an HTTPS Facebook profile or page');
  }
}

if (email && !/^[^\s<>@?&]+@[^\s<>@?&]+\.[^\s<>@?&]+$/.test(email)) {
  throw new Error('CONTACT_EMAIL must be a valid public email address');
}
if (whatsapp && !/^[1-9]\d{6,14}$/.test(whatsapp)) {
  throw new Error('WHATSAPP_NUMBER must contain the international number using digits only');
}
if (siteUrl) {
  const url = new URL(siteUrl);
  if (url.protocol !== 'https:' || url.origin !== siteUrl) {
    throw new Error('SITE_URL must be an HTTPS origin without a trailing slash');
  }
}

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);
const pathFor = (locale, page = 'home') => '/' + locale + '/' + routes[page];
const contactFor = (locale, type) => pathFor(locale, 'contact') + (type ? '?type=' + type : '');
const asset = (file) => '/assets/' + file;
const button = (href, label, variant = 'primary') =>
  '<a class="button button--' + variant + '" href="' + escapeHtml(href) + '">' + escapeHtml(label) + '</a>';

function wordmark(locale) {
  return '<a class="wordmark" href="' + pathFor(locale) + '"><span class="brand-icon" aria-hidden="true">CED</span><span>China Equipment<br>Direct</span></a>';
}

function header(locale, page, t) {
  const other = locale === 'en' ? 'zh-CN' : 'en';
  const navLinks = Object.keys(routes).slice(1).map((key) =>
    '<a href="' + pathFor(locale, key) + '"' + (page === key ? ' aria-current="page"' : '') + '>' + t.nav[key] + '</a>'
  ).join('');
  return '<header class="site-header"><div class="wrap header-inner">' +
    wordmark(locale) +
    '<button type="button" class="menu-toggle" aria-expanded="false" aria-controls="site-nav" hidden>' + t.menu + '</button>' +
    '<nav class="site-nav" id="site-nav" aria-label="' + (locale === 'en' ? 'Main navigation' : '主导航') + '">' + navLinks + '</nav>' +
    '<div class="header-actions"><a class="language-link" data-language-switch href="' + pathFor(other, page) + '" lang="' + other + '" hreflang="' + other + '">' + content[other].language + '</a>' +
    button(contactFor(locale), t.request) +
    '</div></div></header>';
}

function footer(locale, t) {
  const nav = Object.keys(routes).slice(1).map((key) =>
    '<a href="' + pathFor(locale, key) + '">' + t.nav[key] + '</a>'
  ).join('');
  return '<footer class="site-footer"><div class="wrap footer-inner"><div>' + wordmark(locale) +
    '<p>' + t.brandLine + '</p><a class="footer-email" href="mailto:' + escapeHtml(email) + '">' + escapeHtml(email) + '</a></div><nav aria-label="' + (locale === 'en' ? 'Footer navigation' : '页脚导航') + '">' + nav + '</nav></div></footer>';
}

function contactDock(locale) {
  const label = locale === 'en' ? 'Contact' : '联系';
  return '<aside class="contact-dock" aria-label="' + label + '">' +
    '<a class="dock-wa" href="https://wa.me/' + whatsapp + '">WhatsApp</a>' +
    '<details><summary>' + label + ' <span aria-hidden="true">＋</span></summary><div class="dock-links">' +
    '<a href="mailto:' + escapeHtml(email) + '">' + escapeHtml(email) + '</a>' +
    (facebook ? '<a href="' + escapeHtml(facebook) + '">Facebook</a>' : '') +
    '<a href="' + contactFor(locale) + '">' + content[locale].request + '</a></div></details></aside>';
}

function photoGallery(locale, photos) {
  const cards = photos.map((photo) =>
    '<figure class="media-card"><img loading="lazy" decoding="async" src="' + asset(photo.file) + '" alt="' + photo[locale] + '">' +
    '<figcaption>' + photo[locale] + '</figcaption></figure>'
  ).join('');
  return '<div class="gallery-grid">' + cards + '</div>';
}

function checklist(title, entries, ordered = false) {
  const tag = ordered ? 'ol' : 'ul';
  return '<section class="section wrap list-section"><h2>' + title + '</h2><' + tag + ' class="detail-list">' +
    entries.map(([label, description]) => '<li><h3>' + label + '</h3><p>' + description + '</p></li>').join('') +
    '</' + tag + '></section>';
}

function callToAction(locale, t, type, label = t.request) {
  return '<section class="section cta-section"><div class="wrap cta-inner"><div><h2>' + t.ctaTitle + '</h2>' +
    '<p>' + t.ctaText + '</p></div>' + button(contactFor(locale, type), label) + '</div></section>';
}

function lead(t, extra = '') {
  return '<section class="page-lead"><div class="wrap page-lead-inner"><div><h1>' + t.title + '</h1><p>' +
    t.description + '</p>' + extra + '</div></div></section>';
}

function capabilitySection(locale, topic) {
  const cards = Object.entries(topic.items).map(([key, item]) => {
    const photo = capabilityImages[key];
    return '<article class="capability-card"><img src="' + asset(photo.file) + '" width="' +
      photo.width + '" height="' + photo.height + '" alt="' + escapeHtml(item.alt) + '" loading="lazy" decoding="async">' +
      '<div><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.description) + '</p></div></article>';
  }).join('');
  return '<section class="section capability-section" id="capabilities" aria-labelledby="capabilities-title"><div class="wrap">' +
    '<div class="capability-heading"><div><h2 id="capabilities-title">' + escapeHtml(topic.title) +
    '</h2><p>' + escapeHtml(topic.intro) + '</p></div>' +
    button(contactFor(locale), topic.action, 'dark-outline') + '</div>' +
    '<div class="capability-grid">' + cards + '</div></div></section>';
}

function home(locale, t) {
  const tiles = Object.keys(catalog).map((key) =>
    '<a class="sourcing-tile" href="' + pathFor(locale, key) + '"><h3>' +
    t[key].title + '</h3><p>' + t[key].description + '</p><span class="text-link">' + (locale === 'en' ? 'Browse categories' : '浏览品类') + ' →</span></a>'
  ).join('');
  const audiences = t.audiences.map((item) =>
    '<article class="buyer-card"><h3>' + item.title + '</h3><p>' + item.detail + '</p>' +
    '<a class="text-link" href="' + contactFor(locale, item.type) + '">' + item.action + '</a></article>'
  ).join('');
  const results = Object.entries(catalog).flatMap(([type, items]) => items.map((item) =>
    '<li data-search-name="' + escapeHtml(item.en + ' ' + item['zh-CN']) + '"><a href="' +
    pathFor(locale, type) + '#' + item.id + '">' + escapeHtml(item[locale]) + '</a></li>'
  )).join('');
  return '<section class="hero"><div class="wrap hero-inner"><div class="hero-copy"><h1>' +
    'China Equipment <span>Direct</span></h1><p>' + t.home.intro + '</p>' +
    '<div class="catalog-search" data-catalog-search hidden><label for="catalog-query">' + t.home.search + '</label>' +
    '<input type="search" id="catalog-query" autocomplete="off" maxlength="100" placeholder="' + escapeHtml(t.home.placeholder) + '">' +
    '<div class="search-results" hidden><ul>' + results + '</ul><p data-no-match>' + t.home.empty +
    ' <a href="' + contactFor(locale, 'parts') + '">' + t.home.inquire + '</a></p></div></div>' +
    '<div class="button-row">' + button('#catalog', t.home.sourcing) +
    button(contactFor(locale), t.request, 'outline') +
    '</div></div><figure class="hero-photo"><img src="' + asset('mini-excavator.webp') +
    '" srcset="' + asset('mini-excavator-small.webp') + ' 600w, ' + asset('mini-excavator.webp') +
    ' 1200w" sizes="(max-width: 800px) 100vw, 50vw" width="1200" height="800" alt="' + t.home.caption +
    '" fetchpriority="high"><figcaption>' + t.home.caption + '</figcaption></figure></div></section>' +
    '<section class="section wrap sourcing" id="catalog"><h2>' + t.home.sourcing + '</h2><div class="sourcing-grid">' +
    tiles + '</div></section>' + capabilitySection(locale, t.capabilities) +
    '<section class="factory-band"><div class="wrap factory-band-inner"><img loading="lazy" decoding="async" src="' +
    asset('workshop-machinery.webp') + '" alt="' + t.photoCredit + '"><div><h2>' + t.home.manufacturingTitle +
    '</h2><p>' + t.home.manufacturingText + '</p>' + button(pathFor(locale, 'manufacturing'), t.factoryLink, 'outline') +
    '</div></div></section>' +
    '<section class="section wrap buyers"><h2>' + t.home.audienceTitle + '</h2><div class="buyer-grid">' +
    audiences + '</div></section>' + callToAction(locale, t);
}

function sourcing(locale, page, t) {
  const topic = t[page];
  return lead(topic, button(contactFor(locale, page), topic.action)) +
    '<section class="section wrap category-section"><h2>' + (locale === 'en' ? 'Categories for inquiry' : '可询价品类') +
    '</h2><ul class="category-list">' + catalog[page].map((item) =>
      '<li id="' + item.id + '"><a href="' + contactFor(locale, page) + '&amp;item=' + item.id + '">' +
      escapeHtml(item[locale]) + '<span aria-hidden="true"> ↗</span></a></li>'
    ).join('') + '</ul></section>' + checklist(topic.checklistTitle, topic.checklist);
}

function manufacturing(locale, t) {
  const topic = t.manufacturing;
  const gallery = (items, title) =>
    '<section class="gallery-section"><h2>' + title + '</h2>' + photoGallery(locale, items) + '</section>';
  return lead(topic) +
    '<section class="section wrap tour-section"><figure class="tour-figure"><img src="' + asset('tour-poster.webp') +
    '" loading="lazy" decoding="async" alt="' + t.photoCredit + '"><div class="video-slot" data-video-slot hidden></div></figure>' +
    '<div><h2>' + topic.tourTitle + '</h2><p>' + topic.tourNote + '</p><button type="button" class="button button--dark" data-video="' +
    asset('workshop-tour.mp4') + '" data-video-label="' + topic.videoLabel + '" hidden>' + topic.play + '</button>' +
    '<noscript><a href="' + asset('workshop-tour.mp4') + '">' + topic.videoFallback + '</a></noscript></div></section>' +
    '<div class="section wrap gallery-stack">' +
    gallery(equipment, topic.equipmentTitle) +
    gallery(workshop, topic.workshopTitle) + '</div>' +
    '<section class="section cta-section"><div class="wrap cta-inner"><div><h2>' + topic.qualityTitle + '</h2><p>' +
    topic.qualityText + '</p></div>' + button(contactFor(locale), t.request) + '</div></section>';
}

function delivery(locale, t) {
  const topic = t.delivery;
  return lead(topic) + checklist(t.nav.delivery, topic.steps, true) + callToAction(locale, t);
}

function contact(locale, t) {
  const c = t.contact;
  const options = Object.entries(c.types).map(([key, label]) => '<option value="' + key + '">' + label + '</option>').join('');
  const hints = Object.entries(c.hints).map(([key, text]) => ' data-hint-' + key + '="' + escapeHtml(text) + '"').join('');
  const messages = Object.entries(c.messages).map(([key, text]) => ' data-' + key + '="' + escapeHtml(text) + '"').join('');
  const field = (key, type, autocomplete, required = true) =>
    '<label>' + c.labels[key] + '<input name="' + key + '" type="' + type + '" autocomplete="' + autocomplete +
    '" maxlength="' + inquiryLimits[key] + '"' + (required ? ' required' : '') + '></label>';
  const config = email ? ' data-contact-email="' + escapeHtml(email) + '"' : '';
  const channels = '<div class="button-row">' +
    (email ? button('mailto:' + email, c.emailContact, 'dark-outline') : '') +
    (whatsapp ? button('https://wa.me/' + whatsapp, c.whatsapp, 'dark-outline') : '') + '</div>';
  return lead(c) + '<section class="section wrap inquiry-layout"><div><h2>' + c.formTitle + '</h2><p>' + c.note + '</p>' +
    channels + '</div><div><noscript><p>' + c.noScript + '</p></noscript><form class="inquiry-form" method="post" data-inquiry' +
    config + ' data-subject="' + escapeHtml(c.briefLabel) + '">' +
    '<fieldset class="inquiry-fields"><div class="form-grid">' + field('name', 'text', 'name') + field('email', 'email', 'email') +
    field('phoneNumber', 'tel', 'tel', false) + field('country', 'text', 'country-name') +
    '<label>' + c.labels.type + '<select name="type" required><option value="">' + c.select + '</option>' +
    options + '</select></label></div>' +
    '<label>' + c.labels.requirements + '<textarea name="requirements" required maxlength="' +
    inquiryLimits.message + '" rows="5" aria-describedby="inquiry-hint inquiry-budget"></textarea></label>' +
    '<p class="form-hint" id="inquiry-hint"' + hints + '>' + c.hints.default + '</p>' +
    '<p class="form-hint" id="inquiry-budget">' + c.budget + ' <span data-budget></span></p>' +
    '<label hidden>Website<input name="website" type="text" tabindex="-1" autocomplete="off"></label>' +
    '<label class="inquiry-consent"><input type="checkbox" name="consent" value="yes" required><span>' + c.consent + '</span></label>' +
    '<div class="button-row"><button type="submit" class="button button--dark" disabled>' + c.submit +
    '</button><button type="button" class="button button--dark-outline" data-prepare-draft disabled>' + c.prepare +
    '</button></div></fieldset><p data-inquiry-status role="status" tabindex="-1"' + messages + '></p>' +
    '<section class="draft" data-draft hidden><p role="status" tabindex="-1">' + c.draftNote + '</p><pre tabindex="0" aria-label="' +
    c.briefLabel + '" data-draft-preview></pre><div class="button-row"><a class="button button--dark" download="machinery100-inquiry.txt" data-download>' +
    c.download + '</a>' + (email ? '<a class="button button--dark-outline" data-email-draft>' + c.emailAction + '</a>' : '') +
    '</div></section></form></div></section>';
}

const pageRenderers = {
  home,
  equipment: (locale, t) => sourcing(locale, 'equipment', t),
  attachments: (locale, t) => sourcing(locale, 'attachments', t),
  parts: (locale, t) => sourcing(locale, 'parts', t),
  manufacturing,
  delivery,
  contact
};

function head(locale, key, t) {
  const title = t[key].title;
  const description = key === 'home' ? t.home.intro : t[key].description;
  const alternatives = siteUrl
    ? '<link rel="canonical" href="' + siteUrl + pathFor(locale, key) + '">' +
      locales.map((lang) => '<link rel="alternate" hreflang="' + lang + '" href="' + siteUrl + pathFor(lang, key) + '">').join('') +
      '<link rel="alternate" hreflang="x-default" href="' + siteUrl + pathFor('en', key) + '">'
    : '<meta name="robots" content="noindex,nofollow">';
  const schema = key === 'home' && siteUrl ? '<script type="application/ld+json">' + JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Organization', '@id': siteUrl + '/#organization',
    name: brand, url: siteUrl, email, telephone: '+' + whatsapp, ...(facebook ? { sameAs: [facebook] } : {})
  }).replaceAll('<', '\\u003c') + '</script>' : '';
  return '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>' + escapeHtml(title) + ' | ' + brand + '</title><meta name="description" content="' + escapeHtml(description) + '">' +
    alternatives + schema + '<link rel="icon" href="/assets/favicon.png"><link rel="stylesheet" href="/assets/site.css">' +
    '<script src="/assets/site.js" type="module"></script>';
}

async function render() {
  await Promise.all([
    ...Object.values(capabilityImages).map(({ file }) => access(join(root, 'src/assets', file))),
    ...workshop.map(({ file }) => access(join(root, 'src/assets', file))),
    ...equipment.map(({ file }) => access(join(root, 'src/assets', file)))
  ]);
  await mkdir(dist, { recursive: true });
  await cp(join(root, 'src/assets'), join(dist, 'assets'), { recursive: true });

  for (const locale of locales) {
    const t = content[locale];
    for (const key of Object.keys(routes)) {
      const directory = join(dist, locale, routes[key]);
      await mkdir(directory, { recursive: true });
      const lookup = key === 'contact' ? '<script type="application/json" id="inquiry-items">' +
        JSON.stringify(Object.fromEntries(Object.entries(catalog).flatMap(([type, items]) =>
          items.map((item) => [item.id, { name: item[locale], type }])))).replaceAll('<', '\\u003c') + '</script>' : '';
      const doc = '<!doctype html><html lang="' + locale + '"><head>' + head(locale, key, t) +
        '</head><body><a class="skip" href="#content">' + t.skip + '</a>' + header(locale, key, t) +
        '<main id="content" tabindex="-1">' + pageRenderers[key](locale, t) +
        '</main>' + footer(locale, t) + contactDock(locale) + lookup + '</body></html>\n';
      await writeFile(join(directory, 'index.html'), doc);
    }
  }
  await writeFile(join(dist, 'index.html'), '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=/en/"><title>China Equipment Direct</title><p><a href="/en/">English</a> · <a lang="zh-CN" href="/zh-CN/">简体中文</a></p></html>\n');
  await writeFile(join(dist, '404.html'), '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><link rel="stylesheet" href="/assets/site.css"><title>Page not found | China Equipment Direct</title><main class="section wrap"><h1>' + content.en.notFound + ' / ' + content['zh-CN'].notFound + '</h1><p><a href="/en/">Home</a> · <a lang="zh-CN" href="/zh-CN/">首页</a></p></main></html>\n');
  const robots = siteUrl ? 'User-agent: *\nAllow: /\nSitemap: ' + siteUrl + '/sitemap.xml\n' : 'User-agent: *\nDisallow: /\n';
  await writeFile(join(dist, 'robots.txt'), robots);
  await writeFile(join(dist, 'sitemap.xml'),
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    (siteUrl ? locales.flatMap((lang) => Object.keys(routes).map((key) => '<url><loc>' + siteUrl + pathFor(lang, key) + '</loc></url>')).join('\n') : '') +
    '</urlset>\n');
  console.log('Built ' + locales.length * Object.keys(routes).length + ' pages into dist/ with ' + (await readdir(join(dist, 'assets'))).length + ' assets.');
}

await render();
