// UI enhancements: theme toggle, counter animation, intersection observers
(function(){
  const themeBtn = document.getElementById('themeToggle');
  const stored = localStorage.getItem('pec-theme');
  if(stored === 'dark') document.body.classList.add('dark-mode');
  updateThemeIcon();
  function toggleTheme(){
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('pec-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    updateThemeIcon();
  }
  function updateThemeIcon(){
    if(!themeBtn) return; const icon = themeBtn.querySelector('i'); if(!icon) return;
    if(document.body.classList.contains('dark-mode')) { icon.className = 'fas fa-sun'; themeBtn.setAttribute('aria-label','Switch to light mode'); }
    else { icon.className = 'fas fa-moon'; themeBtn.setAttribute('aria-label','Switch to dark mode'); }
  }
  themeBtn && themeBtn.addEventListener('click', toggleTheme);
  const counters = document.querySelectorAll('.counter-number[data-count]');
  const counterObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if(entry.isIntersecting) { animateCounter(entry.target); entry.target.dataset.animated='true'; counterObserver.unobserve(entry.target); } }); }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));
  function animateCounter(el){ const target = parseInt(el.dataset.count,10); const duration = 1400; const start = performance.now(); function step(ts){ const progress = Math.min((ts-start)/duration,1); const eased = 1 - Math.pow(1-progress,3); const value = Math.floor(target * eased); el.textContent = value + (el.dataset.suffix || ''); if(progress < 1) requestAnimationFrame(step);} requestAnimationFrame(step);}  
  const revealEls = document.querySelectorAll('.fade-in-up');
  const revealObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } }); }, { threshold: 0.25 });
  revealEls.forEach(el=>revealObserver.observe(el));
})();
