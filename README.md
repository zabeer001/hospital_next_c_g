# Doctor Tracker Public Website

Doctor Tracker combines a public healthcare product site with an authenticated operations dashboard connected to the Hospital Express API.

## Setup guide

### Requirements

- Node.js 22.13 or newer
- npm

### Local installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

3. Set `NEXT_PUBLIC_API_URL` to the Hospital Express API, keep `NEXT_PUBLIC_APP_LOGIN_URL=/signin` when the portal is hosted here, and set `NEXT_PUBLIC_SITE_URL` to the public site origin.

4. Start the local site:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Marketing landing page |
| `/blog` | Searchable, category-filtered journal |
| `/blog/[slug]` | Statically generated local MDX article |
| `/contact` | Contact details and UI-only demonstration form |
| `/signin` | Backend-connected portal sign-in |
| `/dashboard` | Client-rendered analytics overview |
| `/dashboard/doctors` | Searchable doctor directory and linked-patient management |
| `/dashboard/patients` | Searchable and filterable patient management |
| `/dashboard/bookings` | Appointment booking management |

## Source structure

All application source code lives under `src/`:

```text
src/
├── app/          # Routes, layouts, metadata, sitemap, and global styles
├── components/   # Shared navigation, cards, forms, and content renderers
├── content/      # Typed blog index and local MDX articles
├── dashboard/    # Dashboard types, mock records, state, forms, shell, and UI
└── types/        # Project-specific TypeScript declarations
```

## System architecture

The App Router serves public pages as server-rendered or statically generated HTML. Landing and article content remains server-side by default for fast delivery and strong metadata. Small client components own only the state they need: mobile navigation, article filtering, and contact-form validation. Blog entries live in `content/blog` as MDX files, are parsed into a typed `BlogPostMetadata` collection, and generate article routes and metadata during the build. Sign-in links use the portal location configured through the environment.

The dashboard is a protected client-rendered surface backed by the Hospital Express API. Sign-in stores the issued tokens in session storage by default (or local storage when “Keep me signed in” is selected), bearer credentials are attached to protected requests, and expired access tokens are refreshed and rotated automatically. The authenticated profile supplies the displayed identity and permissions; sign-out revokes the backend session, while password changes revoke all of the user’s sessions.

Dashboard controls and surfaces use DaisyUI 5. All built-in DaisyUI themes are enabled, the dashboard header exposes a theme selector, and the selected theme is remembered locally in the browser under `doctor-tracker-theme`. The public marketing pages retain their original Doctor Tracker visual identity.

```text
Browser → Next.js public routes → Server-rendered marketing content
                              ↘ Local MDX → Typed metadata → Static blog pages
                              ↘ Client islands → Search / filters / demo form
                              ↘ Sign in → JWT session → Hospital Express API
```

## Technical decisions

### Server-first pages with focused client islands

Public content benefits from complete initial HTML, predictable metadata, and minimal browser JavaScript. The site therefore uses server components by default and marks only genuinely interactive controls as client components. This keeps the marketing experience quick while preserving polished search, navigation, and form behavior.

### Local MDX instead of a CMS

The portfolio site does not need a content service or API. Local MDX keeps editorial content versioned with the interface, makes each article available during static generation, and avoids runtime network failures. A single typed index supplies consistent metadata to cards, routes, related-post selection, the sitemap, and social previews.

## Content editing

Add an `.mdx` file in `content/blog` with these frontmatter fields: `title`, `excerpt`, `author`, `publishedAt`, `category`, `coverImage`, `featured`, and `readingTime`. Import it in `content/posts.ts` and add its slug/source pair to `sources`.

Supported article formatting includes second-level headings, paragraphs, unordered lists, and blockquotes.

## Quality checks

```bash
npm run typecheck
npm run lint
npm test
```

`npm test` creates the production build and verifies the rendered landing, blog, article, contact, and not-found behavior.

## Visual evidence

Capture final portfolio screenshots after setting the production URL:

- Desktop: landing page at 1440×900 and an article at 1440×900
- Mobile: landing page at 390×844 and blog listing at 390×844

The site-wide social preview is available at `public/og.png`.

## Deployment

Set both variables from `.env.example` in the hosting environment, run `npm run build`, and deploy the generated application. The included Sites configuration targets Cloudflare-compatible output through vinext.

## Docker

Build and run the production container with Docker Compose:

```bash
docker compose up --build
```

The site will be available at [http://localhost:3000](http://localhost:3000). To use a different host port or external login URL:

```bash
PORT=8080 NEXT_PUBLIC_APP_LOGIN_URL=/signin docker compose up --build
```

Stop the container with:

```bash
docker compose down
```

## CI/CD

Pushes to `main` connect to the VPS, pull the latest source, build the Docker
image, and recreate the frontend service. Docker Compose reads the production
`.env` on the VPS and passes the `NEXT_PUBLIC_*` values into the image build.
Those values are therefore compiled into the frontend without storing them in
GitHub Actions secrets.

Configure these GitHub Actions repository secrets:

- `VPS_ROOT_ACCESS` (for example, `ssh root@server.example.com`)
- `VPS_PASSWORD`
- `VPS_PROJECT_DIR`
- `VPS_APP_CONTAINER`

The VPS project directory must contain a production `.env` with `PORT`,
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_LOGIN_URL`, and
`NEXT_PUBLIC_API_URL`. The workflow rejects a missing API URL or one containing
`localhost`. It can also be started manually from the repository's **Actions**
tab.

Use the deployment helper from the project root:

```bash
./bash/git_bash.sh local "your commit message"
./bash/git_bash.sh production
```
# hospital_next_c_g
