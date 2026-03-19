/* ═══════════════════════════════════════════════════════════════════════════
   UmU Studios — app.js
   Core application logic:
     - Page navigation
     - Collection detail & reader
     - Write page (new chapter + edit mode)
     - Reaction toggle (like / dislike)
     - App initialisation
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── PAGE NAVIGATION ─── */
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  document.getElementById('page-' + pageId).classList.add('active');
  const navEl = document.getElementById('nav-' + pageId);
  if (navEl) navEl.classList.add('active');

  if (pageId === 'write') {
    if (!editMode) resetWriterUI();   // fresh visit — reset heading/button
    renderWriterCollectionPills();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─── COLLECTION DETAIL ─── */
function openDetail(colId) {
  renderDetailPage(colId);

  // Back button goes to wherever the user navigated from
  document.querySelector('#page-detail .back-btn').onclick = () => {
    const fromCollections = document.getElementById('nav-collections').classList.contains('active');
    showPage(fromCollections ? 'collections' : 'home');
  };

  showPage('detail');
}

/* ─── READER ─── */
function openReader(colId, chIndex) {
  renderReader(colId, chIndex);
  showPage('reader');
}

/* ─── REACTION TOGGLE ─── */
function toggleReact(key, type) {
  const rs          = reactionState[key];
  const likeBtn     = document.getElementById(`like-btn-${key}`);
  const dislikeBtn  = document.getElementById(`dislike-btn-${key}`);
  const likeCount   = document.getElementById(`like-count-${key}`);
  const dislikeCount= document.getElementById(`dislike-count-${key}`);

  if (type === 'like') {
    if (rs.liked) { rs.liked = false; rs.likes--; }
    else {
      if (rs.disliked) { rs.disliked = false; rs.dislikes--; }
      rs.liked = true; rs.likes++;
    }
  } else {
    if (rs.disliked) { rs.disliked = false; rs.dislikes--; }
    else {
      if (rs.liked) { rs.liked = false; rs.likes--; }
      rs.disliked = true; rs.dislikes++;
    }
  }

  likeBtn.classList.toggle('active', rs.liked);
  dislikeBtn.classList.toggle('active', rs.disliked);
  likeCount.textContent    = rs.likes;
  dislikeCount.textContent = rs.dislikes;
}


/* ═══════════════════════════════════════════════════════
   WRITE PAGE
   ═══════════════════════════════════════════════════════ */
let selectedWriterCollection = null;
let editMode = null; // null = new chapter | { colId, chIndex } = editing

function selectWriterCollection(id) {
  selectedWriterCollection = id;
  document.querySelectorAll('.col-pill').forEach(p => p.classList.remove('selected'));
  const pill = document.getElementById('pill-' + id);
  if (pill) pill.classList.add('selected');
}

function updateWordCount() {
  const wc = countWords(document.getElementById('write-body').value);
  document.getElementById('write-word-count').textContent =
    `${wc.toLocaleString()} word${wc !== 1 ? 's' : ''}`;
}

function resetWriterUI() {
  document.querySelector('.write-title').textContent  = 'New Chapter';
  document.querySelector('.write-sub').textContent    = 'Write, assign to a collection, and publish.';
  document.querySelector('.write-actions .btn-create').innerHTML =
    '<i class="bi bi-send"></i> Publish';
}

function clearWriter() {
  document.getElementById('write-title').value = '';
  document.getElementById('write-body').value  = '';
  document.getElementById('write-word-count').textContent = '0 words';
  selectedWriterCollection = null;
  editMode = null;
  resetWriterUI();
  document.querySelectorAll('.col-pill').forEach(p => p.classList.remove('selected'));
  hideToast();
}

/* Open Write page pre-filled for editing an existing chapter */
function editChapter(colId, chIndex) {
  const col = collections.find(c => c.id === colId);
  const ch  = col.chapters[chIndex];

  editMode = { colId, chIndex };
  selectedWriterCollection = colId;

  document.getElementById('write-title').value = ch.title;
  document.getElementById('write-body').value  = ch.body || '';
  updateWordCount();

  document.querySelector('.write-title').textContent = 'Edit Chapter';
  document.querySelector('.write-sub').textContent   = `Editing "${ch.title}" in ${col.name}`;
  document.querySelector('.write-actions .btn-create').innerHTML =
    '<i class="bi bi-check-lg"></i> Update';

  showPage('write');
  // Pills render after showPage; highlight the correct one after a tick
  setTimeout(() => selectWriterCollection(colId), 10);
}

/* Publish (new) or Update (edit) */
function publishChapter() {
  const title = document.getElementById('write-title').value.trim();
  const body  = document.getElementById('write-body').value.trim();

  if (!title || !body || !selectedWriterCollection) {
    showToast('error', '<i class="bi bi-exclamation-circle"></i> Please fill in the title, body, and select a collection.');
    return;
  }

  const col     = collections.find(c => c.id === selectedWriterCollection);
  const wc      = countWords(body);
  const excerpt = body.split(/\s+/).slice(0, 22).join(' ') + '…';
  const today   = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  if (editMode) {
    /* ── UPDATE existing chapter ── */
    const ch   = col.chapters[editMode.chIndex];
    ch.title   = title;
    ch.body    = body;
    ch.sub     = `${wc.toLocaleString()} words`;
    ch.excerpt = excerpt;
    // publish date stays unchanged

    renderHomeCollections();
    renderHomeChapters();
    renderCollectionsGrid();

    showToast('success', `<i class="bi bi-check-circle"></i> <strong>${title}</strong> updated.`);
    const prevEdit = { ...editMode };
    clearWriter();
    setTimeout(() => openDetail(prevEdit.colId), 1600);

  } else {
    /* ── PUBLISH new chapter ── */
    col.chapters.push({
      num:      col.chapters.length + 1,
      title,
      sub:      `${wc.toLocaleString()} words`,
      date:     today,
      likes:    0,
      dislikes: 0,
      excerpt,
      body
    });

    renderHomeCollections();
    renderHomeChapters();
    renderCollectionsGrid();

    showToast('success', `<i class="bi bi-check-circle"></i> Chapter published to <strong>${col.name}</strong>!`);
    document.getElementById('write-title').value = '';
    document.getElementById('write-body').value  = '';
    document.getElementById('write-word-count').textContent = '0 words';
    selectedWriterCollection = null;
    document.querySelectorAll('.col-pill').forEach(p => p.classList.remove('selected'));
  }
}

/* ─── TOAST NOTIFICATIONS ─── */
function showToast(type, html) {
  const t = document.getElementById('publish-toast');
  t.className   = `publish-toast ${type}`;
  t.innerHTML   = html;
  t.style.display = 'flex';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(hideToast, 5000);
}

function hideToast() {
  const t = document.getElementById('publish-toast');
  if (t) t.style.display = 'none';
}


/* ═══════════════════════════════════════════════════════
   INITIALISATION
   Runs once on page load. Order matters.
   ═══════════════════════════════════════════════════════ */
(function init() {
  renderNavLogo();
  renderHero();
  renderHomeCollections();
  renderHomeChapters();
  renderCollectionsGrid();
  renderWriterCollectionPills();
})();
