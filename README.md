# UmU Studios — Story Publishing Site

A personal story-posting web application built as a UI/UX dummy project for a 6-day web development training. Designed and built from scratch using vanilla HTML, CSS, and JavaScript — no UI frameworks.

---

## Project Structure

```
umu-studios/
│
├── index.html          ← Page structure and modals only. Zero inline CSS or JS.
│
├── css/
│   └── style.css       ← All styling. Organised: tokens → base → components → pages
│
├── js/
│   ├── data.js         ← Mock data layer: siteConfig + collections array
│   ├── render.js       ← DOM render functions (read data, write to page)
│   ├── modals.js       ← Modal open/close/save logic (profile, collection)
│   └── app.js          ← Navigation, writer, reactions, app initialisation
│
└── README.md
```

**Script load order in index.html:** `data.js → render.js → modals.js → app.js`
Each file depends on the previous one, so order is intentional.

---

## Features

- **Home page** — Profile hero with avatar, bio, stats. Horizontal scroll collection bar. Latest uploaded chapters grid.
- **Collections page** — Full grid of all collections. Create new collection via modal (name, description with 200-word limit, genre, accent colour).
- **Collection detail** — Chapter list with likes/dislikes and Edit button per chapter.
- **Reader** — Clean reading view with drop-cap styling, like/dislike toggle, Edit Chapter button.
- **Write page** — Chapter title, collection picker (pill buttons), body editor with live word count. Publishes into the selected collection.
- **Edit mode** — Any chapter can be edited; Write page pre-fills and switches to Update mode.
- **Edit Profile modal** — Change name, handle, tagline, bio, avatar initial and colour. Updates navbar and hero live.
- **Edit Collection modal** — Change collection name, genre, description, accent colour.

---

## Architecture Notes

| Concern | File |
|---|---|
| Data / mock API layer | `js/data.js` |
| DOM rendering | `js/render.js` |
| Modal UI logic | `js/modals.js` |
| App logic & navigation | `js/app.js` |
| Visual design | `css/style.css` |
| Page structure | `index.html` |

In a production implementation, `data.js` would be replaced by API calls to a backend. `siteConfig` would be a `/api/profile` GET response. `collections` would be a `/api/collections` GET response. Chapter bodies would be fetched individually on reader open. The rest of the codebase would require minimal changes.

---

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript (ES6+)
- [Bootstrap Icons](https://icons.getbootstrap.com/) — icons only, no Bootstrap CSS/JS
- [Google Fonts](https://fonts.google.com/) — Playfair Display + Outfit
- No frameworks, no build tools, no dependencies

---

*Built by Mayank / UmU Studios*
