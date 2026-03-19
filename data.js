/* ═══════════════════════════════════════════════════════════════════════════
   UmU Studios — data.js
   Single source of truth for all application data.

   In production this file would be replaced by API calls to a backend.
   For this dummy, these objects act as the mock data layer.

   RULES:
   - siteConfig  → all user-editable profile data
   - collections → array of collection objects, each with chapter metadata
   - Chapter bodies are NOT stored here. They are written via the Write page
     and held in memory, or fetched from a DB in production.
   ═══════════════════════════════════════════════════════════════════════════ */

const siteConfig = {
  name:          'Mayank / UmU Studios',
  handle:        'Mr_UmU',
  tag:           'Editor & Author',
  bio:           'Fan fiction editor and writer operating under UmU Studios. I post edited chapters of Warhammer 40K, Frieren, Star Wars, and original speculative fiction. Every story archived here is crafted with lore-accuracy and narrative care. Reader since forever. Writer since I had to be.',
  avatarInitial: 'M',
  avatarColor:   'linear-gradient(135deg,#c9a84c,#6b4f1e)',
  stats: {
    readers: '1.2k'
  }
};

const collections = [
  {
    id:      'wh40k',
    name:    'Warhammer Chronicles',
    icon:    '⚔️',
    desc:    'Fan-edited MTL chapters spanning the Horus Heresy, Soul Drinkers, Alpha Legion, and more. Lore-accurate, preserved in spirit and scale.',
    genre:   'Sci-Fi / Grimdark',
    accent:  '#8b3a3a',
    chapters: [
      { num: 1, title: 'The Primarch Awakens',    sub: '6,200 words', date: '12 Mar 2025', likes: 142, dislikes: 4,  excerpt: "In the silence before the Great Crusade, something stirs beneath the ice of a forgotten world — a mind vast and terrible, untouched by the Emperor's light." },
      { num: 2, title: 'Death Korps at the Wall', sub: '5,800 words', date: '18 Mar 2025', likes: 98,  dislikes: 7,  excerpt: 'The commissar did not believe in retreating. The Krieg regiment had never retreated. The wall, however, did not care about either of these facts.' },
      { num: 3, title: 'The Omega Protocol',      sub: '7,100 words', date: '24 Mar 2025', likes: 176, dislikes: 2,  excerpt: "The Alpha Legion does not exist. It has never existed. And it most certainly did not infiltrate the Inquisition's highest tier." },
    ]
  },
  {
    id:      'frieren',
    name:    'Frieren Fanfictions',
    icon:    '🌿',
    desc:    "Slow and meditative stories set in the world of Frieren: Beyond Journey's End. Exploring time, grief, and the magic that lingers after people are gone.",
    genre:   'Fantasy / Slice of Life',
    accent:  '#4c7a8b',
    chapters: [
      { num: 1, title: 'A Hundred Years, Softly',   sub: '4,400 words', date: '3 Mar 2025', likes: 213, dislikes: 1, excerpt: 'Frieren waits. She has always been good at waiting. The harder thing is remembering why she started.' },
      { num: 2, title: 'The Spell Fern Left Behind', sub: '3,900 words', date: '9 Mar 2025', likes: 189, dislikes: 3, excerpt: "Fern has her teacher's books now. Some of them she can read. Some of them she cannot, and she is unsure she ever will." },
    ]
  },
  {
    id:      'starwars',
    name:    'Star Wars: Old Republic',
    icon:    '🌌',
    desc:    'Self-insert SI stories set in the SWTOR era. Empire, shadows, and the Exchange — with companion characters that steal every scene.',
    genre:   'Space Opera / Action',
    accent:  '#8b5e3a',
    chapters: [
      { num: 1, title: 'The Exchange Gambit — Ch.1', sub: '5,600 words', date: '28 Feb 2025', likes: 231, dislikes: 9,  excerpt: 'Being dropped into the Old Republic with no Force sensitivity, no lightsaber, and no relevant skills is, it turns out, a fantastic way to learn what desperation feels like.' },
      { num: 2, title: 'The Exchange Gambit — Ch.2', sub: '6,100 words', date: '7 Mar 2025',  likes: 198, dislikes: 11, excerpt: "Vel doesn't smile. I've been observing this for three weeks now. She does something adjacent to smiling when something amuses her, but it never quite makes it to her eyes." },
    ]
  },
  {
    id:      'original',
    name:    'Original Works',
    icon:    '✒️',
    desc:    'Original speculative fiction from the Nucyria universe and standalone stories. Dimension-spanning narratives, fractured monarchies, and unconventional kings.',
    genre:   'Original / Speculative',
    accent:  '#6b4c8b',
    chapters: [
      { num: 1, title: 'The King Without a Crown', sub: '3,200 words', date: '15 Mar 2025', likes: 167, dislikes: 2, excerpt: 'He had no crown, no throne, no palace to call his own. He had only the road, and the road, as it turned out, went everywhere.' },
      { num: 2, title: 'Nucyria: The First Fold',  sub: '5,500 words', date: '1 Mar 2025',  likes: 144, dislikes: 5, excerpt: 'When two dimensions begin to overlap, the first things to bleed through are always the oldest — the things that have been pressing against the membrane the longest.' },
    ]
  },
];

/* Reaction state lives in memory — tracks per-session like/dislike toggles */
const reactionState = {};
