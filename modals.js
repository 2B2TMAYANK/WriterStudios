/* ═══════════════════════════════════════════════════════════════════════════
   UmU Studios — modals.js
   Logic for all three modals:
     1. New Collection
     2. Edit Profile
     3. Edit Collection
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── SHARED UTILITY ─── */
function countWords(str) {
  return str.trim() === '' ? 0 : str.trim().split(/\s+/).length;
}

function openModal(backdropId, modalId) {
  document.getElementById(backdropId).classList.add('open');
  document.getElementById(modalId).classList.add('open');
}

function closeModal(backdropId, modalId) {
  document.getElementById(backdropId).classList.remove('open');
  document.getElementById(modalId).classList.remove('open');
}


/* ═══════════════════════════════════════════════════════
   1. NEW COLLECTION MODAL
   ═══════════════════════════════════════════════════════ */
let selectedAccent = '#c9a84c';

function openNewCollectionModal() {
  document.getElementById('new-col-name').value  = '';
  document.getElementById('new-col-genre').value = '';
  document.getElementById('new-col-desc').value  = '';
  document.getElementById('col-desc-counter').textContent = '0 / 200 words';
  document.getElementById('col-desc-counter').className   = 'field-counter';
  document.getElementById('col-desc-hint').textContent    = '';
  selectedAccent = '#c9a84c';
  document.querySelectorAll('#new-col-modal .color-swatch').forEach(s => {
    s.classList.toggle('active-swatch', s.dataset.color === selectedAccent);
  });
  openModal('modal-backdrop', 'new-col-modal');
}

function closeNewCollectionModal() {
  closeModal('modal-backdrop', 'new-col-modal');
}

function pickAccent(el, color) {
  selectedAccent = color;
  document.querySelectorAll('#new-col-modal .color-swatch').forEach(s => s.classList.remove('active-swatch'));
  el.classList.add('active-swatch');
}

function checkDescWords() {
  const wc      = countWords(document.getElementById('new-col-desc').value);
  const counter = document.getElementById('col-desc-counter');
  const hint    = document.getElementById('col-desc-hint');
  counter.textContent = `${wc} / 200 words`;
  if (wc > 200) {
    counter.className = 'field-counter over';
    hint.textContent  = `${wc - 200} word${wc - 200 > 1 ? 's' : ''} over the limit. Please trim.`;
  } else if (wc > 170) {
    counter.className = 'field-counter warn';
    hint.textContent  = '';
  } else {
    counter.className = 'field-counter';
    hint.textContent  = '';
  }
}

function createNewCollection() {
  const name  = document.getElementById('new-col-name').value.trim();
  const genre = document.getElementById('new-col-genre').value.trim() || 'General';
  const desc  = document.getElementById('new-col-desc').value.trim();

  if (!name)  { document.getElementById('new-col-name').focus(); return; }
  if (!desc)  { document.getElementById('new-col-desc').focus(); return; }
  if (countWords(desc) > 200) return;

  const icons = ['📖','🌙','🔥','🌿','⚡','🗺️','🌌','✍️'];
  collections.push({
    id:       'col_' + Date.now(),
    name,
    icon:     icons[Math.floor(Math.random() * icons.length)],
    desc,
    genre,
    accent:   selectedAccent,
    chapters: []
  });

  renderHomeCollections();
  renderHomeChapters();
  renderCollectionsGrid();
  renderWriterCollectionPills();
  closeNewCollectionModal();
}


/* ═══════════════════════════════════════════════════════
   2. EDIT PROFILE MODAL
   ═══════════════════════════════════════════════════════ */
let selectedAvatarColor = siteConfig.avatarColor;

function openProfileModal() {
  document.getElementById('prof-name').value    = siteConfig.name;
  document.getElementById('prof-handle').value  = siteConfig.handle;
  document.getElementById('prof-tag').value     = siteConfig.tag;
  document.getElementById('prof-bio').value     = siteConfig.bio;
  document.getElementById('prof-initial').value = siteConfig.avatarInitial;
  selectedAvatarColor = siteConfig.avatarColor;
  updateAvatarPreview();
  document.querySelectorAll('#avatar-color-row .color-swatch').forEach(s => {
    s.classList.toggle('active-swatch', s.dataset.color === selectedAvatarColor);
  });
  openModal('profile-backdrop', 'profile-modal');
}

function closeProfileModal() {
  closeModal('profile-backdrop', 'profile-modal');
}

function updateAvatarPreview() {
  const initial = document.getElementById('prof-initial').value || '?';
  const preview = document.getElementById('avatar-preview');
  preview.textContent  = initial.toUpperCase();
  preview.style.background = selectedAvatarColor;
}

function pickAvatarColor(el, color) {
  selectedAvatarColor = color;
  document.querySelectorAll('#avatar-color-row .color-swatch').forEach(s => s.classList.remove('active-swatch'));
  el.classList.add('active-swatch');
  updateAvatarPreview();
}

function saveProfile() {
  const name   = document.getElementById('prof-name').value.trim();
  const handle = document.getElementById('prof-handle').value.trim();
  if (!name || !handle) return;

  siteConfig.name          = name;
  siteConfig.handle        = handle;
  siteConfig.tag           = document.getElementById('prof-tag').value.trim()     || siteConfig.tag;
  siteConfig.bio           = document.getElementById('prof-bio').value.trim();
  siteConfig.avatarInitial = (document.getElementById('prof-initial').value.trim() || 'M').toUpperCase();
  siteConfig.avatarColor   = selectedAvatarColor;

  renderNavLogo();
  renderHero();
  closeProfileModal();
}


/* ═══════════════════════════════════════════════════════
   3. EDIT COLLECTION MODAL
   ═══════════════════════════════════════════════════════ */
let editColId     = null;
let editColAccent = '#c9a84c';

function openEditColModal(colId) {
  const col = collections.find(c => c.id === colId);
  editColId     = colId;
  editColAccent = col.accent;

  document.getElementById('edit-col-name').value  = col.name;
  document.getElementById('edit-col-genre').value = col.genre;
  document.getElementById('edit-col-desc').value  = col.desc;
  checkEditColDescWords();

  document.querySelectorAll('#edit-col-color-row .color-swatch').forEach(s => {
    s.classList.toggle('active-swatch', s.dataset.color === editColAccent);
  });
  openModal('edit-col-backdrop', 'edit-col-modal');
}

function closeEditColModal() {
  closeModal('edit-col-backdrop', 'edit-col-modal');
}

function pickEditColAccent(el, color) {
  editColAccent = color;
  document.querySelectorAll('#edit-col-color-row .color-swatch').forEach(s => s.classList.remove('active-swatch'));
  el.classList.add('active-swatch');
}

function checkEditColDescWords() {
  const wc      = countWords(document.getElementById('edit-col-desc').value);
  const counter = document.getElementById('edit-col-desc-counter');
  const hint    = document.getElementById('edit-col-desc-hint');
  counter.textContent = `${wc} / 200 words`;
  if (wc > 200) {
    counter.className = 'field-counter over';
    hint.textContent  = `${wc - 200} word${wc - 200 > 1 ? 's' : ''} over the limit.`;
  } else if (wc > 170) {
    counter.className = 'field-counter warn';
    hint.textContent  = '';
  } else {
    counter.className = 'field-counter';
    hint.textContent  = '';
  }
}

function saveCollectionEdit() {
  const name  = document.getElementById('edit-col-name').value.trim();
  const genre = document.getElementById('edit-col-genre').value.trim();
  const desc  = document.getElementById('edit-col-desc').value.trim();
  if (!name || !desc || countWords(desc) > 200) return;

  const col  = collections.find(c => c.id === editColId);
  col.name   = name;
  col.genre  = genre || col.genre;
  col.desc   = desc;
  col.accent = editColAccent;

  renderHomeCollections();
  renderCollectionsGrid();
  renderHero();
  closeEditColModal();
}
