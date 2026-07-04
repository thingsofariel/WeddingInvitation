# Wedding Invitation Website — Juan & Margy

A single-page digital wedding invitation with countdown timer, photo gallery,
RSVP form, and a guest wishes/comments wall backed by a real database.

Stack: **Node.js + Express + SQLite (better-sqlite3)** on the backend,
**vanilla HTML/CSS/JS** on the frontend (no framework build step needed).

---

## 1. Prerequisites — Fedora Workstation 44

Open a terminal and run:

```bash
# Update system packages
sudo dnf upgrade --refresh -y

# Node.js 20 LTS (via Fedora's official module stream)
sudo dnf module install nodejs:20 -y
node -v      # should print v20.x
npm -v

# Build tools required to compile better-sqlite3's native bindings
sudo dnf groupinstall "Development Tools" -y
sudo dnf install python3 make gcc-c++ -y

# (Optional but recommended) Git, in case the project is version-controlled
sudo dnf install git -y
```

> Fedora 44 ships with `dnf5`; the commands above are unchanged from `dnf4`
> on this distro and will work as-is.

---

## 2. Project setup

```bash
cd wedding-invitation
npm install
```

This installs:
- `express` — web server
- `better-sqlite3` — embedded database (creates `server/db/invitation.db`
  automatically on first run — no separate MySQL/Postgres server to install
  or manage)
- `cors` — allows the frontend to call the API cleanly during development

## 3. Add your real assets

Replace the placeholders before going live:

- `public/images/couple-1.jpg`, `couple-2.jpg`, `couple-3.jpg` — the three
  photos under "The Couple" section
- `public/images/gallery-01.jpg` … `gallery-09.jpg` (or however many you
  need — just update the list in `public/js/gallery.js`)
- `public/audio/background-music.mp3` — background music track (make sure
  you have the right to use it commercially/publicly)

## 4. Run it

```bash
npm start
```

Then open: `http://localhost:3000/?to=Reddo+dan+Pasangan`

The `?to=` query parameter is what populates the guest's name on the cover
screen, exactly like the reference site.

For auto-reload during development:

```bash
npm run dev
```

## 5. Project structure

```
wedding-invitation/
├── package.json
├── public/                  # served statically by Express
│   ├── index.html
│   ├── css/style.css
│   ├── js/
│   │   ├── guest.js         # reads ?to= query param
│   │   ├── countdown.js     # live countdown to the wedding date
│   │   ├── gallery.js       # gallery grid + lightbox
│   │   ├── rsvp.js          # RSVP form + wishes list (calls the API)
│   │   └── main.js          # cover transition, music toggle, copy button
│   ├── images/
│   └── audio/
└── server/
    ├── index.js             # Express app entry point
    ├── db/database.js       # SQLite schema/connection
    └── routes/wishes.js     # REST API: GET/POST /api/wishes
```

## 6. Customizing content

All wedding-specific text (names, dates, Bible verse, bank account, love
story) lives directly in `public/index.html` — search for the relevant
section comments (`<!-- ===== THE COUPLE ===== -->`, etc.) and edit in place.

The wedding date/time used by the countdown is set in
`public/js/countdown.js`:

```js
const WEDDING_DATE = new Date("2026-06-26T08:00:00+08:00");
```

## 7. Deploying it for real guests

For a live invitation link you'd typically:

1. Get a short domain or subdomain (e.g. `juan-margy.yourdomain.com`)
2. Deploy the Node app to a small VPS, or a platform like Railway/Render/
   Fly.io (all have free or near-free tiers sufficient for an invitation
   site's traffic)
3. Put it behind HTTPS (Let's Encrypt via Caddy or Nginx, or automatic on
   most PaaS platforms)
4. Generate per-guest links by appending `?to=Guest+Name` to the URL for
   each invitee — same mechanic as the reference site

## 8. Database notes

The SQLite file `server/db/invitation.db` is created automatically the
first time the server runs. Back it up periodically (it's a single file —
just copy it) since it holds every RSVP and wish guests submit.
