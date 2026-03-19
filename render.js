/* ═══════════════════════════════════════════════════════════════════════════
   UmU Studios — render.js
   All functions that read from data.js and write to the DOM.
   No logic, no state changes — pure rendering.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── NAV LOGO ─── */
function renderNavLogo() {
  const el    = document.getElementById('nav-logo-text');
  const parts = siteConfig.name.split('/');
  const main  = parts[0] ? parts[0].trim() : siteConfig.name;
  const sub   = parts[1] ? parts[1].trim() : '';
  el.innerHTML = sub
    ? `${main} <em style="font-style:italic;color:var(--accent2)">/ ${sub}</em>
       <span style="font-style:italic;color:var(--muted);font-size:0.85rem;font-weight:400;margin-left:6px;">
         @${siteConfig.handle}
       </span>`
    : `${main}
       <span style="font-style:italic;color:var(--muted);font-size:0.85rem;font-weight:400;margin-left:6px;">
         @${siteConfig.handle}
       </span>`;
}

/* ─── PROFILE HERO ─── */
function renderHero() {
  const totalChapters = collections.reduce((sum, c) => sum + c.chapters.length, 0);
  const displayName   = siteConfig.name.includes('/')
    ? siteConfig.name.replace('/', '/ <em>') + '</em>'
    : siteConfig.name;

  document.getElementById('hero-section').innerHTML = `
    <div class="hero-glow"></div>
    <div class="hero-inner">
      <div style="flex-shrink:0;">
        <div class="avatar" style="background:${siteConfig.avatarColor};">
          ${siteConfig.avatarInitial}
        </div>
      </div>
      <div class="hero-text" style="flex:1;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
          <div>
            <h1>${displayName}</h1>
            <p class="hero-handle">@${siteConfig.handle} &nbsp;·&nbsp; ${siteConfig.tag}</p>
          </div>
          <button class="edit-chip edit-chip-lg" onclick="openProfileModal()" style="margin-top:4px;">
            <i class="bi bi-pencil"></i> Edit Profile
          </button>
        </div>
        <p class="hero-bio">${siteConfig.bio}</p>
        <div class="hero-stats">
          <div class="stat">
            <div class="stat-val">${collections.length}</div>
            <div class="stat-label">Collections</div>
          </div>
          <div class="stat">
            <div class="stat-val">${totalChapters}</div>
            <div class="stat-label">Chapters</div>
          </div>
          <div class="stat">
            <div class="stat-val">${siteConfig.stats.readers}</div>
            <div class="stat-label">Readers</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ─── HOME: HORIZONTAL SCROLL COLLECTION CARDS ─── */
function renderHomeCollections() {
  document.getElementById('home-collections-scroll').innerHTML = collections.map(c => `
    <div class="col-card" style="--col-accent:${c.accent}" onclick="openDetail('${c.id}')">
      <div class="col-icon">${c.icon}</div>
      <div class="col-name">${c.name}</div>
      <div class="col-count">${c.chapters.length} chapter${c.chapters.length !== 1 ? 's' : ''}</div>
      <div class="col-genre">${c.genre.split(' / ')[0]}</div>
    </div>
  `).join('');
}

/* ─── HOME: LATEST CHAPTERS GRID ─── */
function renderHomeChapters() {
  // Flatten all chapters, tag with collection info, sort newest first
  const latest = [];
  collections.forEach(c =>
    c.chapters.forEach(ch =>
      latest.push({ ...ch, colId: c.id, colName: c.name, colAccent: c.accent })
    )
  );
  latest.sort((a, b) => new Date(b.date) - new Date(a.date));

  document.getElementById('home-chapters-grid').innerHTML = latest.slice(0, 6).map(ch => `
    <div class="chapter-card" onclick="openReader('${ch.colId}', ${ch.num - 1})">
      <div class="chapter-collection" style="color:${ch.colAccent}">${ch.colName}</div>
      <div class="chapter-title">${ch.title}</div>
      <div class="chapter-excerpt">${ch.excerpt}</div>
      <div class="chapter-meta">
        <div class="chapter-meta-left">
          <span><i class="bi bi-clock"></i> ${ch.sub}</span>
          <span>${ch.date}</span>
        </div>
        <div class="chapter-reactions">
          <span class="reaction-pill like"><i class="bi bi-hand-thumbs-up-fill"></i> ${ch.likes}</span>
          <span class="reaction-pill dislike"><i class="bi bi-hand-thumbs-down-fill"></i> ${ch.dislikes}</span>
        </div>
      </div>
    </div>
  `).join('');
}

/* ─── COLLECTIONS PAGE: FULL GRID ─── */
function renderCollectionsGrid() {
  document.getElementById('collections-full-grid').innerHTML = collections.map(c => `
    <div class="col-full-card" style="--col-accent:${c.accent}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div class="col-full-icon">${c.icon}</div>
        <button class="edit-chip" onclick="openEditColModal('${c.id}')">
          <i class="bi bi-pencil"></i> Edit
        </button>
      </div>
      <div class="col-full-name">${c.name}</div>
      <div class="col-full-desc">${c.desc}</div>
      <div class="col-full-footer" onclick="openDetail('${c.id}')" style="cursor:pointer;">
        <span class="tag">${c.genre}</span>
        <span>${c.chapters.length} chapter${c.chapters.length !== 1 ? 's' : ''} →</span>
      </div>
    </div>
  `).join('');
}

/* ─── COLLECTION DETAIL: CHAPTER LIST ─── */
function renderDetailPage(colId) {
  const col    = collections.find(c => c.id === colId);
  const header = document.getElementById('detail-header');
  const list   = document.getElementById('detail-chapter-list');

  header.style.setProperty('--col-accent', col.accent);
  header.innerHTML = `
    <div class="detail-icon">${col.icon}</div>
    <div>
      <div class="detail-title">${col.name}</div>
      <div class="detail-desc">${col.desc}</div>
      <div class="detail-meta">
        <span class="tag">${col.genre}</span>
        &nbsp;&nbsp;${col.chapters.length} chapter${col.chapters.length !== 1 ? 's' : ''}
      </div>
    </div>
  `;

  list.innerHTML = col.chapters.map((ch, i) => `
    <div class="chapter-list-item">
      <div class="chapter-list-left" onclick="openReader('${colId}', ${i})" style="flex:1;cursor:pointer;">
        <div class="chapter-num">${String(ch.num).padStart(2, '0')}</div>
        <div>
          <div class="chapter-list-title">${ch.title}</div>
          <div class="chapter-list-sub">${ch.sub} · ${ch.date}</div>
        </div>
      </div>
      <div class="chapter-list-right">
        <span style="color:var(--like)"><i class="bi bi-hand-thumbs-up-fill"></i> ${ch.likes}</span>
        <span style="color:var(--dislike)"><i class="bi bi-hand-thumbs-down-fill"></i> ${ch.dislikes}</span>
        <button class="edit-chip" onclick="editChapter('${colId}', ${i})">
          <i class="bi bi-pencil"></i> Edit
        </button>
      </div>
    </div>
  `).join('');
}

/* ─── READER ─── */
function renderReader(colId, chIndex) {
  const col = collections.find(c => c.id === colId);
  const ch  = col.chapters[chIndex];
  const key = `${colId}-${chIndex}`;

  if (!reactionState[key]) {
    reactionState[key] = { liked: false, disliked: false, likes: ch.likes, dislikes: ch.dislikes };
  }
  const rs = reactionState[key];

  const bodyHtml = ch.body
    ? ch.body.split('\n\n').map(p => `<p>${p}</p>`).join('')
    : `<div class="no-body-placeholder">
         <div class="no-body-icon">📄</div>
         <div class="no-body-title">Content not yet uploaded</div>
         <div class="no-body-text">
           This chapter exists as a published entry but its full text hasn't been
           written here yet. Use <strong>Edit Chapter</strong> to add the content.
         </div>
         <button class="btn-create" style="margin-top:1.2rem;" onclick="editChapter('${colId}', ${chIndex})">
           <i class="bi bi-pencil"></i> Add Content
         </button>
       </div>`;

  const reactionsHtml = ch.body ? `
    <div class="reactions-bar">
      <button class="react-btn like-btn ${rs.liked ? 'active' : ''}"
        id="like-btn-${key}" onclick="toggleReact('${key}', 'like')">
        <span class="icon">👍</span>
        <span class="count" id="like-count-${key}">${rs.likes}</span>
      </button>
      <div class="react-divider"></div>
      <button class="react-btn dislike-btn ${rs.disliked ? 'active' : ''}"
        id="dislike-btn-${key}" onclick="toggleReact('${key}', 'dislike')">
        <span class="icon">👎</span>
        <span class="count" id="dislike-count-${key}">${rs.dislikes}</span>
      </button>
    </div>` : '';

  document.getElementById('reader-content').innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.8rem;margin-bottom:1.2rem;">
      <button class="back-btn" style="margin:0;" onclick="openDetail('${colId}')">
        <i class="bi bi-arrow-left"></i> Back to ${col.name}
      </button>
      <button class="edit-chip edit-chip-lg" onclick="editChapter('${colId}', ${chIndex})">
        <i class="bi bi-pencil"></i> Edit Chapter
      </button>
    </div>
    <div class="reader-chapter-label">${col.name} · Chapter ${ch.num}</div>
    <h1 class="reader-title">${ch.title}</h1>
    <div class="reader-meta">${ch.date} &nbsp;·&nbsp; ${ch.sub}</div>
    <div class="reader-body">${bodyHtml}</div>
    ${reactionsHtml}
  `;
}

/* ─── WRITE PAGE: COLLECTION PILLS ─── */
function renderWriterCollectionPills() {
  const wrap = document.getElementById('collection-selector');
  if (!wrap) return;
  wrap.innerHTML = collections.map(c => `
    <div class="col-pill ${selectedWriterCollection === c.id ? 'selected' : ''}"
      onclick="selectWriterCollection('${c.id}')" id="pill-${c.id}">
      <span>${c.icon}</span> ${c.name}
    </div>
  `).join('');
}
