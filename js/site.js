(() => {
  'use strict';
  const HOME = 'sumber-konten/beranda.html';
  const main = document.getElementById('render-konten');
  const nav = document.getElementById('main-nav');
  const menu = document.getElementById('mobile-toggle');
  const search = document.getElementById('search-dialog');
  const viewer = document.getElementById('image-dialog');
  const cache = new Map([[HOME, main.innerHTML]]);
  let activeRoute = HOME, controller, serial = 0, searchIndex;
  const validRoute = route => /^sumber-konten\/[a-zA-Z0-9_/-]+\.html$/.test(route) && !route.includes('..');
  function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); }
  function themeLabel() {
    const dark = document.documentElement.dataset.theme === 'dark';
    document.getElementById('theme-toggle').setAttribute('aria-label', dark ? 'Gunakan tema terang' : 'Gunakan tema gelap');
    document.getElementById('theme-toggle').setAttribute('aria-pressed', String(dark));
  }
  themeLabel();
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('fajar-theme',theme); } catch {}
    themeLabel();
  });
  menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded',String(open)); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });
  function enhance(focus = false) {
    for(const a of document.querySelectorAll('a.nav-link-ajax')) {
      const route = a.dataset.route || a.getAttribute('href');
      if(validRoute(route)) {a.dataset.route=route;a.setAttribute('href','#'+route);}
    }
    const heading = main.querySelector('h1');
    const label = heading?.textContent.trim() || 'Portofolio';
    document.title = activeRoute === HOME ? 'Fajar Nugraha — Soil Science & Geospatial' : `${label} — Fajar Nugraha`;
    for (const a of nav.querySelectorAll('a')) {
      const href = a.dataset.route || a.getAttribute('href');
      const current = href === activeRoute || (href !== HOME && activeRoute.startsWith(href.slice(0,href.lastIndexOf('/')+1)));
      if(current) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    }
    if(focus && heading) { heading.tabIndex = -1; heading.focus({preventScroll:true}); }
    document.getElementById('route-status').textContent = label;
    closeMenu();
    initFilters();
  }
  function errorView() {
    main.innerHTML = '<section class="error-panel container"><span class="eyebrow">Halaman belum tersedia</span><h1>Tujuan ini belum bisa dibuka.</h1><p>Periksa koneksi atau kembali ke beranda untuk menjelajahi proyek lainnya.</p><a class="nav-link-ajax btn-primary" href="sumber-konten/beranda.html">Kembali ke beranda</a> <button class="btn-secondary" data-retry>Coba lagi</button></section>';
  }
  async function load() {
    const route = location.hash.slice(1) || HOME;
    const ticket = ++serial;
    controller?.abort(); controller = new AbortController();
    const progress = document.getElementById('loading-line');
    main.setAttribute('aria-busy','true'); progress.hidden = false;
    try {
      if(!validRoute(route)) throw new Error('Invalid route');
      let content = cache.get(route);
      if(content === undefined) {
        const response = await fetch(route, {signal:controller.signal});
        if(!response.ok) throw new Error('Page unavailable');
        content = await response.text();
        if(/<!doctype|<html[\s>]/i.test(content)) throw new Error('Expected a page fragment');
        if(cache.size >= 24) cache.delete([...cache.keys()].find(k => k !== HOME));
        cache.set(route,content);
      }
      if(ticket !== serial) return;
      main.innerHTML = content; activeRoute = route;
      main.classList.remove('page-enter'); void main.offsetWidth; main.classList.add('page-enter');
      enhance(true); window.scrollTo({top:0,behavior:'instant'});
    } catch(error) {
      if(error.name === 'AbortError' || ticket !== serial) return;
      errorView(); activeRoute = route; enhance(true);
    } finally { if(ticket === serial) {main.removeAttribute('aria-busy');progress.hidden = true;} }
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a.nav-link-ajax');
    if(a && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault(); const route = a.dataset.route || a.getAttribute('href').replace(/^#/,'');
      if(search.open) search.close();
      if(location.hash.slice(1) === route) {closeMenu();window.scrollTo({top:0,behavior:'smooth'});} else location.hash = route;
      return;
    }
    const local = e.target.closest('a[href^="#"]');
    if(local && local.getAttribute('href') !== '#') {
      const target = document.getElementById(local.getAttribute('href').slice(1));
      if(target) {e.preventDefault();target.scrollIntoView({behavior:'smooth'});target.tabIndex=-1;target.focus({preventScroll:true});}
    }
    if(e.target.closest('[data-retry]')) load();
    if(e.target.closest('[data-close-dialog]')) e.target.closest('dialog').close();
    const image = e.target.closest('[data-image]');
    if(image) {
      viewer.querySelector('img').src = image.dataset.image;
      viewer.querySelector('img').alt = image.querySelector('img').alt;
      viewer.querySelector('p').textContent = image.dataset.caption || image.querySelector('img').alt;
      viewer.showModal();
    }
    const demo = e.target.closest('[data-demo]');
    if(demo) {
      const card = demo.closest('.demo-card'), frame = document.createElement('iframe');
      frame.src = demo.dataset.demo; frame.title = demo.dataset.title; frame.allowFullscreen = true;
      card.querySelector('[data-demo-preview]')?.replaceWith(frame);
      demo.hidden = true;
      frame.addEventListener('load',()=>{card.querySelector('[data-demo-status]').textContent='Demo dibuka. Ketersediaan peta dan analisis bergantung pada layanan aplikasi.';},{once:true});
    }
  });
  for(const dialog of [search,viewer]) dialog.addEventListener('click', e => {if(e.target === dialog) {const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  function initFilters() {
    const grid = main.querySelector('[data-project-grid]'); if(!grid) return;
    let category = 'semua'; const input = main.querySelector('#project-search');
    const cards = [...grid.children];
    function filter() {
      const query = input.value.trim().toLocaleLowerCase('id'); let count=0;
      for(const card of cards) { const match = (category === 'semua' || card.dataset.category === category) && `${card.textContent} ${card.dataset.search || ''}`.toLocaleLowerCase('id').includes(query);card.hidden=!match;if(match)count++; }
      main.querySelector('[data-result-count]').textContent=`${count} proyek ditampilkan`;
      main.querySelector('[data-empty]').hidden=count>0;
    }
    input.addEventListener('input',filter);
    main.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;main.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filter();}));
    filter();
  }
  document.getElementById('open-search').addEventListener('click', async () => {
    search.showModal(); search.querySelector('input').focus();
    if(!searchIndex) {
      try { const r=await fetch('aset/search-index.json');if(!r.ok)throw new Error();searchIndex=await r.json();renderSearch(); }
      catch { search.querySelector('.search-results').textContent='Pencarian belum dapat dimuat. Silakan buka halaman Proyek melalui menu.'; }
    } else renderSearch();
  });
  function renderSearch() {
    if(!searchIndex) return;
    const q=search.querySelector('input').value.trim().toLocaleLowerCase('id');
    const items=searchIndex.filter(x=>`${x.title} ${x.keywords}`.toLocaleLowerCase('id').includes(q)).slice(0,12);
    const results=search.querySelector('.search-results'); results.replaceChildren();
    if(!items.length) {results.textContent='Tidak ada hasil. Coba kata lain, misalnya LULC atau tanah.';return;}
    items.forEach(item=>{const a=document.createElement('a');a.href='#'+item.route;a.dataset.route=item.route;a.className='nav-link-ajax';a.textContent=item.title;const small=document.createElement('small');small.textContent=item.type;a.append(small);results.append(a);});
  }
  search.querySelector('input').addEventListener('input',renderSearch);
  document.addEventListener('submit', e=>{
    if(e.target.id !== 'contact-form') return;
    e.preventDefault();const form=e.target;if(!form.reportValidity())return;
    const data=new FormData(form);
    const subject=`Diskusi ${data.get('layanan')} — ${data.get('nama')}`;
    const body=`Halo Fajar,\n\n${data.get('pesan')}\n\nSalam,\n${data.get('nama')}\n${data.get('email')}`;
    const link=form.querySelector('[data-email-draft]');
    link.href=`mailto:nugrahafajar0@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    link.hidden=false;
    form.querySelector('[role=status]').textContent='Draf siap. Buka aplikasi email melalui tombol di bawah, lalu kirim dari sana.';
  });
  window.addEventListener('hashchange',load);
  enhance(); if(location.hash && location.hash.slice(1)!==HOME)load();
})();
