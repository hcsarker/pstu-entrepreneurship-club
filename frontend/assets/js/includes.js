// Simple client-side includes for header and footer
(function(){
  async function loadInto(el, url){
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP '+res.status);
      el.innerHTML = await res.text();
    } catch (e) {
      console.warn('Include failed for', url, e);
    }
  }
  document.addEventListener('DOMContentLoaded', async function(){
    const tasks = [];
    const header = document.getElementById('site-header');
    if (header) tasks.push(loadInto(header, 'partials/header.html'));
    const footer = document.getElementById('site-footer');
    if (footer) tasks.push(loadInto(footer, 'partials/footer.html'));
    await Promise.all(tasks);
    document.dispatchEvent(new CustomEvent('includes:loaded'));
  });
})();
