const API_BASE = window.API_BASE_URL || '';

function authHeaders(){
  const t = localStorage.getItem('admin_token');
  return t ? { Authorization: 'Bearer '+t } : {};
}

async function login(){
  const user = document.getElementById('adminUser').value.trim();
  const pass = document.getElementById('adminPass').value;
  const msg = document.getElementById('loginMsg');
  msg.textContent = '';
  try{
    const res = await fetch(API_BASE + '/api/admin/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username: user, password: pass }) });
    const data = await res.json();
    if(!res.ok) return msg.textContent = data?.message || 'Login failed';
    localStorage.setItem('admin_token', data.token);
    showApp();
  } catch(err){ msg.textContent = 'Login error'; console.error(err); }
}

function showApp(){
  document.getElementById('loginBox').style.display = 'none';
  document.getElementById('adminApp').style.display = 'block';
  fetchAll();
}

function logout(){ localStorage.removeItem('admin_token'); location.reload(); }

async function fetchAll(){
  await fetchTeam();
  await fetchAdvisors();
}

async function fetchTeam(){
  const container = document.getElementById('teamList');
  container.innerHTML = 'Loading...';
  try{
    const res = await fetch(API_BASE + '/api/admin/team', { headers: authHeaders() });
    const data = await res.json();
    if(!res.ok) return container.innerHTML = '<div class="text-danger">'+(data.message||'Error')+'</div>';
    container.innerHTML = '<table class="table table-sm"><thead><tr><th>Name</th><th>Role</th><th>Session</th><th></th></tr></thead><tbody>' + data.items.map(i=>`<tr><td>${i.name}</td><td>${i.role||''}</td><td>${i.session||''}</td><td><button data-id="${i._id}" class="btn btn-sm btn-danger del-team">Delete</button></td></tr>`).join('') + '</tbody></table>';
    container.querySelectorAll('.del-team').forEach(b=> b.addEventListener('click', async (e)=>{
      if(!confirm('Delete member?')) return;
      const id = e.target.dataset.id;
      await fetch(API_BASE + '/api/admin/team/' + id, { method:'DELETE', headers: authHeaders() });
      fetchTeam();
    }));
  } catch(err){ container.innerHTML = '<div class="text-danger">Fetch error</div>'; console.error(err); }
}

async function fetchAdvisors(){
  const container = document.getElementById('advisorList');
  container.innerHTML = 'Loading...';
  try{
    const res = await fetch(API_BASE + '/api/admin/advisors', { headers: authHeaders() });
    const data = await res.json();
    if(!res.ok) return container.innerHTML = '<div class="text-danger">'+(data.message||'Error')+'</div>';
    container.innerHTML = '<table class="table table-sm"><thead><tr><th>Name</th><th>Department</th><th>Session</th><th></th></tr></thead><tbody>' + data.items.map(i=>`<tr><td>${i.name}</td><td>${i.department||''}</td><td>${i.session||''}</td><td><button data-id="${i._id}" class="btn btn-sm btn-danger del-adv">Delete</button></td></tr>`).join('') + '</tbody></table>';
    container.querySelectorAll('.del-adv').forEach(b=> b.addEventListener('click', async (e)=>{
      if(!confirm('Delete advisor?')) return;
      const id = e.target.dataset.id;
      await fetch(API_BASE + '/api/admin/advisors/' + id, { method:'DELETE', headers: authHeaders() });
      fetchAdvisors();
    }));
  } catch(err){ container.innerHTML = '<div class="text-danger">Fetch error</div>'; console.error(err); }
}

document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('logoutBtn').addEventListener('click', logout);
document.getElementById('refreshBtn').addEventListener('click', fetchAll);

// Auto-show if token present
if(localStorage.getItem('admin_token')) showApp();

export {};
