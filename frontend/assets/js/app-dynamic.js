// Dynamic rendering + filters + lightbox + simple utilities
import { events as localEvents, products as localProducts, blogPosts as localBlogPosts, startups as localStartups, teamMembers as localTeam, advisors as localAdvisors, blogCategories as localBlogCats, productCategories as localProdCats, eventCategories as localEventCats, galleryImages as localGalleryImages, youtubeVideos as localYouTube } from './data.js';

// Attempt fetching from API if available; fallback to local data
let events = localEvents;
let products = localProducts;
let blogPosts = localBlogPosts;
let startups = localStartups;
let teamMembers = localTeam;
let advisors = localAdvisors;
let blogCategories = localBlogCats;
let productCategories = localProdCats;
let eventCategories = localEventCats;
let galleryImages = localGalleryImages;
let youtubeVideos = localYouTube;

async function tryFetchAll(){
  const base = window.API_BASE_URL || '';
  try {
    const [ev, prod, posts, su, team, advResp] = await Promise.all([
      fetchJSON(base + '/api/content/events'),
      fetchJSON(base + '/api/content/products'),
      fetchJSON(base + '/api/content/posts'),
      fetchJSON(base + '/api/content/startups'),
      fetchJSON(base + '/api/content/team'),
      fetchJSON(base + '/api/content/advisors').catch(()=>({ items: [] }))
    ]);
    if (ev?.items?.length) { events = ev.items.map(x=>({ ...x, type: x.type || (new Date(x.date) > new Date() ? 'upcoming':'past') })); eventCategories = [...new Set(events.map(e=>e.category).filter(Boolean))]; }
    if (prod?.items?.length) { products = prod.items; productCategories = [...new Set(products.map(p=>p.category).filter(Boolean))]; }
    if (posts?.items?.length) { blogPosts = posts.items; blogCategories = [...new Set(blogPosts.map(p=>p.category).filter(Boolean))]; }
    if (su?.items?.length) { startups = su.items; }
    if (team?.items?.length) { teamMembers = team.items; }
    if (advResp?.items?.length) { advisors = advResp.items; }
  } catch (e) {
    console.warn('Content API fetch failed, using local data', e);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await tryFetchAll();
  // Normalize event types by date so sections are accurate
  events = normalizeEventTypes(events);
  eventCategories = [...new Set(events.map(e=>e.category).filter(Boolean))];
  renderIf('#eventsDynamic', renderEvents, { scope:'upcoming' });
  renderIf('#pastEventsDynamic', renderPastEventsInit);
  renderIf('#eventFilters', renderEventFilters);
  renderIf('#pastYearFilters', renderPastYearFilters);
  renderIf('#productsGrid', renderProducts);
  renderIf('#productFilters', renderProductFilters);
  renderIf('#blogPostsGrid', renderBlogPosts);
  renderIf('#blogCategoryFilters', renderBlogCategories);
  renderIf('#startupsGrid', renderStartups);
  renderIf('#teamHeroFilters', renderTeamFilters);
  renderIf('#advisorHeroFilters', renderAdvisorFilters);
  initLightbox();
  attachGlobalSearch();
  renderIf('#galleryMasonry', renderGalleryImages);
  if (document.querySelector('#videoGrid')) {
    await loadYouTubeFromAPI();
    renderYouTubeVideos(document.querySelector('#videoGrid'));
  }
  // Event detail template page
  renderIf('#eventDetail', renderEventDetail);
});

function renderIf(selector, fn, extra){ const el=document.querySelector(selector); if(el) fn(el, extra); }

// ---------- EVENTS ----------
function renderEvents(container, { scope='upcoming', category }={}) {
  const list = events.filter(e=> e.type===scope && (!category || e.category===category));
  container.innerHTML = list.map(e => `
    <div class="col-md-6 col-lg-4 fade-in-up">
      <div class="event-card h-100">
        <div class="position-relative">
          <img src="${e.cover}" alt="${e.title}" class="card-img-top lightbox-trigger" data-lightbox-src="${e.cover}">
          <div class="event-date">${formatDateLabel(e.date)}</div>
        </div>
        <div class="card-body">
          <h5 class="card-title">${e.title}</h5>
          <p class="card-text small text-muted mb-2"><i class="fas fa-map-marker-alt me-1 text-primary"></i>${e.location}</p>
          <p class="card-text">${e.excerpt}</p>
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span class="badge rounded-pill bg-primary-subtle text-primary border mb-0">${e.category}</span>
            <div class="ms-auto d-flex gap-2">
              ${e.detailsUrl ? `<a href="${e.detailsUrl}" class="btn btn-sm btn-outline-primary">View Details</a>` : (e.slug || e.id ? `<a href="event.html?slug=${e.slug || e.id}" class="btn btn-sm btn-outline-primary">View Details</a>` : '')}
              ${isUpcoming(e.date) && getRegisterUrl(e) ? `<a href="${getRegisterUrl(e)}" target="_blank" rel="noopener" class="btn btn-sm btn-primary">Register</a>` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('') || emptyState('No events found');
  // Make dynamically inserted items visible (works even if IntersectionObserver missed them)
  revealNow(container);
}

// ---------- TEAM Filters + rendering ----------
function renderTeamFilters(container){
  // derive available sessions from teamMembers (use the session label as-is)
  const sessions = [...new Set(teamMembers.map(t=>t.session).filter(Boolean))].sort().reverse();
  const defaultSession = sessions.length ? sessions[0] : `
${new Date().getFullYear()}`;
  container.innerHTML = `
    <div class="d-flex gap-2 align-items-center mb-3">
      <div class="fw-bold me-2">Session:</div>
      <select id="teamSessionSelect" class="form-select form-select-sm" style="width:auto">
        ${sessions.length ? sessions.map(s=>`<option value="${s}">${s}</option>`).join('') : `<option value="${defaultSession}">${defaultSession}</option>`}
      </select>
    </div>`;
  // render selected session members into the grid
  const grid = document.querySelector('#teamGrid');
  const select = container.querySelector('#teamSessionSelect');
  select.value = defaultSession;
  // update hero subtitle if present
  const heroSub = document.querySelector('#teamHeroSubtitle');
  if(heroSub) heroSub.textContent = `${defaultSession} Executive Committee`;
  select.addEventListener('change', ()=> {
    const val = select.value;
    if(heroSub) heroSub.textContent = `${val} Executive Committee`;
    applyTeamFilters(grid, val);
  });
  applyTeamFilters(grid, select.value);
}

function applyTeamFilters(container, session){
  const list = teamMembers.filter(t => (t.session && t.session === session));
  if (!list.length) {
    container.innerHTML = `<div class="col-12"><div class="glass-card p-4 text-center"><h3 class="mb-1">Coming soon</h3><p class="text-muted mb-0">Executive committee for ${session} will be announced soon.</p></div></div>`;
  } else {
    container.innerHTML = list.map(m => `
      <div class="col-6 col-md-4 col-lg-3 fade-in-up">
        <div class="feature-card text-center h-100 p-3">
          <img src="${m.avatar}" alt="${m.name}" class="rounded-circle mb-3" style="width:80px;height:80px;object-fit:cover;">
          <h6 class="mb-1">${m.name}</h6>
          <p class="text-primary small mb-1">${m.role}</p>
          <p class="text-muted small mb-2">${m.department}</p>
        </div>
      </div>`).join('');
  }
  revealNow(container);
}

function renderAdvisors(container){
  container.innerHTML = advisors.map(a => `
    <div class="col-6 col-md-4 col-lg-3 fade-in-up">
      <div class="feature-card text-center h-100 p-3">
        <img src="${a.avatar}" alt="${a.name}" class="rounded-circle mb-3" style="width:80px;height:80px;object-fit:cover;">
        <h6 class="mb-1">${a.name}</h6>
        <p class="text-primary small mb-1">${a.department}</p>
        <p class="text-muted small mb-2">${a.bio}</p>
      </div>
    </div>`).join('') || '<div class="col-12 text-muted">No advisors available</div>';
  revealNow(container);
}

function renderAdvisorFilters(container){
  const sessions = [...new Set(advisors.map(a=>a.session).filter(Boolean))].sort().reverse();
  const defaultSession = sessions.length ? sessions[0] : `${new Date().getFullYear()}`;
  container.innerHTML = `
    <div class="d-flex gap-2 align-items-center mb-3">
      <div class="fw-bold me-2">Session:</div>
      <select id="advisorSessionSelect" class="form-select form-select-sm" style="width:auto">
        ${sessions.length ? sessions.map(s=>`<option value="${s}">${s}</option>`).join('') : `<option value="${defaultSession}">${defaultSession}</option>`}
      </select>
    </div>`;
  const select = container.querySelector('#advisorSessionSelect');
  select.value = defaultSession;
  const advSub = document.querySelector('#advisorHeroSubtitle');
  if(advSub) advSub.textContent = `${defaultSession} Advisors`;
  select.addEventListener('change', ()=> {
    const val = select.value;
    if(advSub) advSub.textContent = `${val} Advisors`;
    applyAdvisorFilters(document.querySelector('#advisorsGrid'), val);
  });
  applyAdvisorFilters(document.querySelector('#advisorsGrid'), select.value);
}

function applyAdvisorFilters(container, year){
  const yearStr = String(year);
  const list = advisors.filter(a => (a.session && a.session.includes(yearStr)));
  if (!list.length) {
    container.innerHTML = `<div class="col-12"><div class="glass-card p-4 text-center"><h3 class="mb-1">Coming soon</h3><p class="text-muted mb-0">Faculty advisors for ${year} will be announced soon.</p></div></div>`;
  } else {
    container.innerHTML = list.map(a => `
      <div class="col-6 col-md-4 col-lg-3 fade-in-up">
        <div class="feature-card text-center h-100 p-3">
          <img src="${a.avatar}" alt="${a.name}" class="rounded-circle mb-3" style="width:80px;height:80px;object-fit:cover;">
          <h6 class="mb-1">${a.name}</h6>
          <p class="text-primary small mb-1">${a.department}</p>
          <p class="text-muted small mb-2">${a.bio}</p>
        </div>
      </div>`).join('');
  }
  revealNow(container);
}

function renderEventFilters(container){
  container.innerHTML = `
    <div class="d-flex flex-wrap gap-2">
      <button class="btn btn-outline-primary btn-sm active" data-evcat="all">All</button>
      ${eventCategories.map(c=>`<button class="btn btn-outline-primary btn-sm" data-evcat="${c}">${c}</button>`).join('')}
    </div>`;
  container.addEventListener('click', e => {
    if(e.target.matches('[data-evcat]')){
      [...container.querySelectorAll('button')].forEach(b=>b.classList.remove('active'));
      e.target.classList.add('active');
      const cat = e.target.dataset.evcat;
      renderEvents(document.querySelector('#eventsDynamic'), { scope:'upcoming', category: cat==='all'? undefined:cat });
      renderEvents(document.querySelector('#pastEventsDynamic'), { scope:'past', category: cat==='all'? undefined:cat });
    }
  });
}

function normalizeEventTypes(list){
  const now = Date.now();
  return list.map(e => {
    const when = new Date(e.date).getTime();
    const type = when >= now ? 'upcoming' : 'past';
    return { ...e, type };
  }).sort((a,b)=> new Date(a.date)-new Date(b.date));
}

// Ensure new dynamic elements are visible without waiting for external observers
function revealNow(root){
  try {
    root.querySelectorAll('.fade-in-up').forEach(el => el.classList.add('is-visible'));
  } catch(e) { /* no-op */ }
}

// ---------- PRODUCTS ----------
function renderProducts(container, { category, query }={}) {
  const list = products.filter(p => (!category || p.category===category) && (!query || p.name.toLowerCase().includes(query.toLowerCase())));
  container.innerHTML = list.map(p => `
    <div class="col-6 col-md-4 col-lg-3 fade-in-up">
      <div class="product-card h-100 position-relative">
        ${p.badge?`<div class="product-badge">${p.badge}</div>`:''}
        <img src="${p.img}" alt="${p.name}" class="card-img-top lightbox-trigger" data-lightbox-src="${p.img}">
        <div class="card-body">
          <h6 class="mb-1">${p.name}</h6>
          <p class="text-primary fw-bold mb-2">৳${p.price}</p>
          <button class="btn btn-sm btn-outline-primary w-100" disabled>Order</button>
        </div>
      </div>
    </div>
  `).join('') || emptyState('No products match');
}

function renderProductFilters(container){
  container.innerHTML = `
    <div class="d-flex flex-wrap gap-2 mb-3">
      <button class="btn btn-outline-primary btn-sm active" data-prodcat="all">All</button>
      ${productCategories.map(c=>`<button class="btn btn-outline-primary btn-sm" data-prodcat="${c}">${c}</button>`).join('')}
      <div class="ms-auto input-group input-group-sm" style="max-width:220px;">
        <span class="input-group-text bg-light"><i class="fas fa-search"></i></span>
        <input type="search" class="form-control" id="productSearch" placeholder="Search..." />
      </div>
    </div>`;
  const grid = document.querySelector('#productsGrid');
  container.addEventListener('click', e => {
    if(e.target.matches('[data-prodcat]')){
      [...container.querySelectorAll('[data-prodcat]')].forEach(b=>b.classList.remove('active'));
      e.target.classList.add('active');
      const cat = e.target.dataset.prodcat;
      const query = container.querySelector('#productSearch').value;
      renderProducts(grid, { category: cat==='all'? undefined:cat, query });
    }
  });
  container.querySelector('#productSearch').addEventListener('input', (e)=>{
    const active = container.querySelector('[data-prodcat].active').dataset.prodcat;
    renderProducts(grid, { category: active==='all'? undefined:active, query: e.target.value });
  });
}

// ---------- BLOG ----------
function renderBlogPosts(container, { category }={}) {
  const list = blogPosts.filter(p=> !category || p.category===category);
  container.innerHTML = list.map(p => `
    <div class="col-md-6 col-lg-4 fade-in-up">
      <div class="blog-card h-100">
        <img src="${p.cover}" alt="${p.title}" class="card-img-top lightbox-trigger" data-lightbox-src="${p.cover}">
        <div class="card-body">
          <span class="blog-date small text-muted"><i class="far fa-calendar-alt me-1"></i>${formatDate(p.date)} • ${p.readTime} min</span>
          <h5 class="card-title mt-2">${p.title}</h5>
          <p class="card-text">${p.excerpt}</p>
          <span class="badge bg-primary-subtle text-primary border">${p.category}</span>
        </div>
      </div>
    </div>
  `).join('') || emptyState('No posts published yet');
}

function renderBlogCategories(container){
  container.innerHTML = `
    <div class="d-flex flex-wrap gap-2">
      <button class="btn btn-outline-primary btn-sm active" data-blogcat="all">All</button>
      ${blogCategories.map(c=>`<button class="btn btn-outline-primary btn-sm" data-blogcat="${c}">${c}</button>`).join('')}
    </div>`;
  const grid = document.querySelector('#blogPostsGrid');
  container.addEventListener('click', e => {
    if(e.target.matches('[data-blogcat]')){
      [...container.querySelectorAll('[data-blogcat]')].forEach(b=>b.classList.remove('active'));
      e.target.classList.add('active');
      const cat = e.target.dataset.blogcat;
      renderBlogPosts(grid, { category: cat==='all'? undefined:cat });
    }
  });
}

// ---------- STARTUPS ----------
function renderStartups(container){
  container.innerHTML = startups.map(s => `
    <div class="col-sm-6 col-lg-3 fade-in-up">
      <div class="card border-0 shadow-sm h-100 product-card">
        <img src="${s.cover}" alt="${s.name}" class="card-img-top lightbox-trigger" data-lightbox-src="${s.cover}">
        <div class="card-body">
          <h5 class="card-title mb-1">${s.name}</h5>
          <p class="text-muted small mb-2">${s.tagline}</p>
          <span class="badge bg-primary-subtle text-primary border">${s.stage}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ---------- TEAM ----------
function renderTeam(container){
  container.innerHTML = teamMembers.map(m => `
    <div class="col-6 col-md-4 col-lg-3 fade-in-up">
      <div class="feature-card text-center h-100 p-3">
        <img src="${m.avatar}" alt="${m.name}" class="rounded-circle mb-3" style="width:80px;height:80px;object-fit:cover;">
        <h6 class="mb-1">${m.name}</h6>
        <p class="text-primary small mb-1">${m.role}</p>
        <p class="text-muted small mb-2">${m.department}</p>
        <div class="d-flex justify-content-center gap-2 flex-wrap">
          ${Object.entries(m.socials).map(([k,v])=>`<a href="${v}" class="text-decoration-none small" aria-label="${k}" target="_blank"><i class="fab fa-${k}"></i></a>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// ---------- GALLERY (Images) ----------
function renderGalleryImages(container){
  const html = galleryImages.map(img => `
    <div class="masonry-item">
      <div class="photo-frame ratio-4x3">
        <div class="ratio-inner">
          <img src="${img.src}" alt="${img.alt || 'Gallery photo'}" class="lightbox-trigger" loading="lazy" decoding="async" data-lightbox-src="${img.src}">
        </div>
      </div>
      ${img.alt ? `<div class="caption"><i class="fa fa-image"></i> ${img.alt}</div>` : ''}
    </div>
  `).join('');
  container.innerHTML = html || '<div class="text-muted">No gallery images available</div>';
}

// ---------- GALLERY (YouTube Videos) ----------
function renderYouTubeVideos(container){
  const cards = youtubeVideos.map((v, i)=>{
    const thumb = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
    return `
      <div class="col-md-6" data-aos="fade-up" ${i?`data-aos-delay="${i*100}"`:''}>
        <div class="video-card">
          <div class="yt-lite" data-id="${v.id}">
            <div class="yt-thumbnail" style="background-image:url('${thumb}')"></div>
            <button class="yt-play" aria-label="Play ${v.title}"></button>
          </div>
          <h6 class="mt-2">${v.title}</h6>
        </div>
      </div>`;
  }).join('');
  container.innerHTML = cards || '<div class="text-muted">No videos available</div>';
  initLiteYouTube();
}

function initLiteYouTube(){
  const nodes = document.querySelectorAll('.yt-lite');
  nodes.forEach(node => {
    if (node.dataset.bound === '1') return;
    node.dataset.bound = '1';
    node.addEventListener('click', () => {
      const id = node.getAttribute('data-id');
      const iframe = document.createElement('iframe');
      iframe.setAttribute('width', '560');
      iframe.setAttribute('height', '315');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('allowfullscreen', '');
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
      node.classList.add('activated');
      node.appendChild(iframe);
    });
  });
}

async function loadYouTubeFromAPI(){
  // Try multiple base URLs so frontend can reach the backend in different deploy setups.
  const bases = [...new Set([window.API_BASE_URL || '', window.location.origin || '', ''])];
  const handle = '@PSTUEntrepreneurshipClub';
  const limit = 6;
  for (const base of bases) {
    try {
      const baseClean = base ? base.replace(/\/$/, '') : '';
      const url = `${baseClean}/integrations/youtube?handle=${encodeURIComponent(handle)}&max=${limit}`;
      // Skip if URL would be something like "/integrations..." and baseClean is empty (we'll still allow relative URL)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(url, { headers: { 'Accept': 'application/json' }, signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) {
        console.debug('YouTube fetch attempt failed:', url, res.status);
        continue;
      }
      const data = await res.json();
      if (Array.isArray(data.items) && data.items.length) {
        youtubeVideos = data.items.map(it => ({ id: it.id, title: it.title }));
        console.info('Loaded YouTube videos from', baseClean || 'relative');
        return true;
      }
    } catch (err) {
      console.debug('YouTube fetch error for base', base, err?.message || err);
      // try next candidate
    }
  }
  console.warn('YouTube fetch failed for all endpoints, using local fallback');
  return false;
}

// ---------- LIGHTBOX ----------
function initLightbox(){
  if(document.querySelector('.lightbox-trigger')){
    const overlay = document.createElement('div');
    overlay.id='lightboxOverlay';
    overlay.innerHTML = '<div class="lightbox-content"><img alt="Preview" /><button class="lightbox-close" aria-label="Close">×</button></div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e=> { if(e.target===overlay || e.target.classList.contains('lightbox-close')) overlay.classList.remove('active'); });
    document.body.addEventListener('click', e => {
      const t = e.target.closest('.lightbox-trigger');
      if(t){
        const src = t.dataset.lightboxSrc || t.getAttribute('src');
        overlay.querySelector('img').src = src;
        overlay.classList.add('active');
      }
    });
  }
}

// ---------- GLOBAL SEARCH (optional hook) ----------
function attachGlobalSearch(){
  const globalEl = document.querySelector('#globalSearch');
  if(!globalEl) return;
  // Could implement site-wide filtering
}

// ---------- HELPERS ----------
function formatDate(d){
  return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}
function formatDateLabel(d){
  const dt = new Date(d); return dt.toLocaleDateString('en-US', { month:'short', day:'numeric' });
}
function isUpcoming(d){ return new Date(d).getTime() >= Date.now(); }
function getRegisterUrl(e){
  const overrides = (window.EVENT_REGISTER_URLS || {});
  const key = e.slug || e.id;
  // Always use unified form unless an explicit override is defined
  return overrides[key] || `register.html?event=${encodeURIComponent(key)}`;
}

// ---------- PAST EVENTS: Year Filters + Pagination ----------
function renderPastEventsInit(container){
  const state = { year:'all', page:1, pageSize:6 };
  container.dataset.state = JSON.stringify(state);
  renderPastEvents(container, state);
}
function renderPastYearFilters(container){
  const years = [...new Set(events.filter(e=>e.type==='past').map(e=> new Date(e.date).getFullYear()))].sort((a,b)=>b-a);
  container.innerHTML = `
    <div class="d-flex flex-wrap gap-2">
      <button class="btn btn-outline-primary btn-sm active" data-evyear="all">All Years</button>
      ${years.map(y=>`<button class="btn btn-outline-primary btn-sm" data-evyear="${y}">${y}</button>`).join('')}
    </div>`;
  const pastContainer = document.querySelector('#pastEventsDynamic');
  container.addEventListener('click', e => {
    if(e.target.matches('[data-evyear]')){
      [...container.querySelectorAll('[data-evyear]')].forEach(b=>b.classList.remove('active'));
      e.target.classList.add('active');
      const state = JSON.parse(pastContainer.dataset.state || '{}');
      state.year = e.target.dataset.evyear;
      state.page = 1;
      pastContainer.dataset.state = JSON.stringify(state);
      renderPastEvents(pastContainer, state);
    }
  });
}
function renderPastEvents(container, { year='all', page=1, pageSize=6 }={}){
  let list = events.filter(e=> e.type==='past');
  if(year !== 'all'){ list = list.filter(e=> new Date(e.date).getFullYear()=== Number(year)); }
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  page = Math.min(pages, Math.max(1, page));
  const start = (page-1)*pageSize;
  const items = list.slice(start, start+pageSize);
  const grid = items.map(e => `
    <div class="col-md-6 col-lg-4 fade-in-up">
      <div class="event-card h-100">
        <div class="position-relative">
          <img src="${e.cover}" alt="${e.title}" class="card-img-top lightbox-trigger" data-lightbox-src="${e.cover}">
          <div class="event-date">${formatDateLabel(e.date)}</div>
        </div>
        <div class="card-body">
          <h5 class="card-title">${e.title}</h5>
          <p class="card-text small text-muted mb-2"><i class="fas fa-map-marker-alt me-1 text-primary"></i>${e.location}</p>
          <p class="card-text">${e.excerpt}</p>
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span class="badge rounded-pill bg-primary-subtle text-primary border mb-0">${e.category}</span>
            <div class="ms-auto d-flex gap-2">
              ${e.detailsUrl ? `<a href="${e.detailsUrl}" class="btn btn-sm btn-outline-primary">View Details</a>` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('') || emptyState('No events found');

  const pager = `
    <div class="d-flex justify-content-center align-items-center gap-2 mt-3">
      <button class="btn btn-sm btn-outline-primary" data-pager="prev" ${page<=1?'disabled':''}>Prev</button>
      <span class="small text-muted">Page ${page} of ${pages}</span>
      <button class="btn btn-sm btn-outline-primary" data-pager="next" ${page>=pages?'disabled':''}>Next</button>
    </div>`;

  container.innerHTML = `<div class="row g-4">${grid}</div>${pager}`;
  revealNow(container);
  container.querySelectorAll('[data-pager]').forEach(btn => {
    btn.addEventListener('click', () => {
      const state = JSON.parse(container.dataset.state || '{}');
      const pagesN = Math.max(1, Math.ceil(total / state.pageSize));
      if(btn.dataset.pager==='prev' && state.page>1) state.page--; else if(btn.dataset.pager==='next' && state.page<pagesN) state.page++;
      container.dataset.state = JSON.stringify(state);
      renderPastEvents(container, state);
    });
  });
}

// ---------- EVENT DETAIL PAGE ----------
function renderEventDetail(container){
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  const ev = events.find(e => (e.slug===slug) || (String(e.id)===slug));
  if(!ev){ container.innerHTML = '<div class="text-center text-muted py-5">Event not found</div>'; return; }
  const agenda = ev.agenda || [];
  const gallery = ev.gallery || [];
  const speakers = ev.speakers || [];
  container.innerHTML = `
    <section class="hero-section text-white position-relative" style="background: linear-gradient(rgba(12,0,50,0.82), rgba(12,0,50,0.82)), url('${ev.cover}') center/cover no-repeat;">
      <div class="container py-5"><div class="row py-5"><div class="col-lg-10 mx-auto text-center">
        <div class="hero-badge"><i class="fas fa-rocket"></i> ${ev.category}</div>
        <h1 class="hero-heading mb-3">${ev.title}</h1>
        <p class="lead mb-4">${ev.location} • ${formatDate(ev.date)}</p>
        <div class="d-flex justify-content-center gap-2">
          <a href="events.html" class="btn btn-outline-light btn-lg">Back to Events</a>
          ${isUpcoming(ev.date) && getRegisterUrl(ev) ? `<a href="${getRegisterUrl(ev)}" target="_blank" rel="noopener" class="btn btn-primary btn-lg">Register</a>`:''}
        </div>
      </div></div></div>
    </section>
    <section class="py-5 bg-light"><div class="container"><div class="row g-4 align-items-start">
      <div class="col-lg-7">
        <h2 class="section-title">Overview</h2>
        <p>${ev.excerpt || ''}</p>
      </div>
      <div class="col-lg-5">
        <div class="glass-card p-4">
          <h5 class="mb-3">Event Details</h5>
          <div class="d-flex flex-column gap-2 small">
            <div><i class="far fa-calendar text-primary me-2"></i> ${formatDate(ev.date)}</div>
            <div><i class="fas fa-map-marker-alt text-primary me-2"></i> ${ev.location}</div>
            <div><i class="far fa-bookmark text-primary me-2"></i> ${ev.category}</div>
          </div>
        </div>
      </div>
    </div></div></section>
    ${agenda.length ? `<section class="py-5"><div class="container"><div class="text-center mb-5"><h2 class="section-title">Agenda</h2></div><div class="row justify-content-center"><div class="col-lg-10"><div class="table-responsive glass-card p-3"><table class="table mb-0"><tbody>${agenda.map(a=>`<tr><td class="fw-semibold">${a.time}</td><td>${a.item}</td></tr>`).join('')}</tbody></table></div></div></div></div></section>`:''}
    ${speakers.length ? `<section class="py-5 bg-light"><div class="container"><div class="text-center mb-5"><h2 class="section-title">Speakers</h2></div><div class="row g-4">${speakers.map(s=>`<div class="col-6 col-md-4 col-lg-3"><div class="feature-card text-center p-3 h-100"><img src="${s.avatar}" alt="${s.name}" class="rounded-circle mb-3" style="width:84px;height:84px;object-fit:cover;"><h6 class="mb-1">${s.name}</h6><p class="text-muted small mb-0">${s.role}</p></div></div>`).join('')}</div></div></section>`:''}
    ${gallery.length ? `<section class="py-5"><div class="container"><div class="text-center mb-4"><h2 class="section-title">Photo <span class="text-primary">Highlights</span></h2></div><div class="masonry">${gallery.map(src=>`<div class="masonry-item"><div class="photo-frame ratio-4x3"><div class="ratio-inner"><img src="${src}" alt="Event photo" class="lightbox-trigger" data-lightbox-src="${src}"></div></div></div>`).join('')}</div></div></section>`:''}
  `;
}
function emptyState(msg){ return `<div class="col-12 text-center text-muted py-4">${msg}</div>`; }

async function fetchJSON(url){
  const controller = new AbortController();
  const t = setTimeout(()=>controller.abort(), 6000);
  const res = await fetch(url, { signal: controller.signal });
  clearTimeout(t);
  if(!res.ok) throw new Error('HTTP '+res.status);
  return res.json();
}
