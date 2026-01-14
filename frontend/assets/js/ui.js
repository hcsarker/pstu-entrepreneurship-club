// UI enhancements: theme toggle, counter animation, intersection observers
(function(){
  // Dark theme disabled: ensure it's cleared
  document.body.classList.remove('dark-mode');
  try { localStorage.removeItem('pec-theme'); } catch(e) {}
  const counters = document.querySelectorAll('.counter-number[data-count]');
  const counterObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if(entry.isIntersecting) { animateCounter(entry.target); entry.target.dataset.animated='true'; counterObserver.unobserve(entry.target); } }); }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));
  function animateCounter(el){ const target = parseInt(el.dataset.count,10); const duration = 1400; const start = performance.now(); function step(ts){ const progress = Math.min((ts-start)/duration,1); const eased = 1 - Math.pow(1-progress,3); const value = Math.floor(target * eased); el.textContent = value + (el.dataset.suffix || ''); if(progress < 1) requestAnimationFrame(step);} requestAnimationFrame(step);}  
  const revealEls = document.querySelectorAll('.fade-in-up');
  const revealObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } }); }, { threshold: 0.25 });
  revealEls.forEach(el=>revealObserver.observe(el));

  // AOS fallback: if AOS failed to load, reveal content immediately
  try {
    var aosMissing = (typeof window.AOS === 'undefined') || (typeof window.AOS.init !== 'function');
    if (aosMissing) {
      document.body.classList.add('aos-disabled');
      document.querySelectorAll('[data-aos]').forEach(function(el){
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.removeAttribute('data-aos');
        el.removeAttribute('data-aos-delay');
        el.removeAttribute('data-aos-duration');
      });
    }
  } catch(e) { /* no-op */ }

  // Mobile-only sponsor marquee: subtle auto-scroll with pause on interaction
  try {
    const mq = window.matchMedia('(max-width: 576px)');
    const grid = document.querySelector('.sponsor-grid');
    if (grid && mq.matches) {
      grid.classList.add('is-marquee');
      // Duplicate children for seamless loop
      const items = Array.from(grid.children);
      items.forEach(node => grid.appendChild(node.cloneNode(true)));

      let rafId = null, last = null; const speed = 24; // px per second
      let paused = false; let pauseTimer = null;
      function tick(ts){
        if(last==null) last = ts;
        const dt = (ts - last) / 1000; // seconds
        last = ts;
        if(!paused){
          grid.scrollLeft += speed * dt;
          const half = grid.scrollWidth / 2;
          if (grid.scrollLeft >= half) {
            grid.scrollLeft -= half;
          }
        }
        rafId = requestAnimationFrame(tick);
      }
      function pause(ms=2500){
        paused = true;
        clearTimeout(pauseTimer);
        pauseTimer = setTimeout(()=>{ paused = false; }, ms);
      }
      ['touchstart','pointerdown','mouseenter','wheel','keydown'].forEach(evt=>{
        grid.addEventListener(evt, ()=> pause(3000), { passive: true });
      });
      // If user manually scrolls, pause briefly
      grid.addEventListener('scroll', ()=> pause(1500), { passive: true });

      rafId = requestAnimationFrame(tick);

      // Clean up on resize above breakpoint
      const onChange = (e)=>{
        if(!e.matches && rafId){ cancelAnimationFrame(rafId); rafId = null; }
      };
      mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
    }
  } catch(e) { /* ignore marquee errors */ }
})();
