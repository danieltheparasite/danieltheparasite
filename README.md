# Daniel Robinson, personal site

React + TypeScript + Tailwind CSS v4 + Vite, laid out the shadcn way (`@/` alias, `src/components/ui`, `src/lib/utils.ts`, `components.json`).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

Needs Node 18+. Deploy to Vercel (import the repo, nothing else to configure) to get the live GitHub and LeetCode numbers. A static host also works, but LeetCode will stay on its saved count (see below).

## The central theme: moods

Five of your drawn expressions each own a colour (`src/lib/moods.ts`): Wrath (ember red), Grief (blue), Blush (rose), Crown (gold), Ash (bone).

- The active mood sets one CSS variable, `--accent`. The page tint, buttons, rules, hatch fills, embers and the GitHub skyline palette all derive from it.
- In **Auto**, the mood changes as each section crosses the middle of the screen (set with `<Section mood="...">`).
- Tapping a face in the dock locks a mood and remembers it for next visit. Tap it again, or press Auto, to release it.
- To add a mood, add an entry to `MOODS` and a face in `public/faces/`.

## Live GitHub and LeetCode numbers

Both update themselves every time someone opens the site. Two small functions in `api/` do the fetching on the server, so the browser never runs into CORS:

| File | What it returns | Used by |
| --- | --- | --- |
| `api/github.ts` | your contribution calendar, read from github.com (no token) | `hooks/use-github-contributions.ts` → `activity.tsx` |
| `api/leetcode.ts` | problems solved + top 6 topics, from LeetCode's GraphQL | `hooks/use-leetcode-stats.ts` → `solving.tsx` |

How it behaves:

- Shows the last saved copy instantly, then fetches fresh numbers.
- Re-fetches when you return to the tab and every 5 minutes while the page is open. Each section has a "Refresh now" button.
- Answers are cached on the CDN for 5 minutes, so a visit never hammers GitHub or LeetCode.
- If a fetch fails, the last good numbers stay on screen. For GitHub there is also a public-mirror fallback; for LeetCode the final fallback is the résumé snapshot in `use-leetcode-stats.ts`.

**Hosting:** the `api/` folder runs as-is on Vercel, no config. `npm run dev` serves the same files locally. On a host without functions (GitHub Pages, plain static hosting) GitHub still updates through the mirror, but LeetCode stays on the snapshot. LeetCode blocks direct calls from other websites, so it needs the function.

**Changing the accounts:** edit `USER` in `activity.tsx` and `solving.tsx`, and set `GITHUB_USER` / `LEETCODE_USER` in the Vercel project's environment variables (or edit the defaults at the top of the two `api/` files).

## Where things live

| What | Where |
| --- | --- |
| Tilted grid hero (your component) | `src/components/ui/tilted-grid-hero.tsx`, used in `hero.tsx` |
| Contribution skyline (your component) | `src/components/ui/contribution-skyline.tsx`, used in `activity.tsx` |
| Your 20 drawings (420×560 webp) | `public/faces/` |
| Hackathon certificate | `public/certificate.webp` |
| Showcase link, links, copy | `rift.tsx`, `contact.tsx`, `about.tsx`, `moments.tsx`, `solving.tsx` |
| Embers and cursor glow | `src/components/atmosphere.tsx` |
| Global tokens, fonts, keyframes | `src/index.css` |

## Notes

- Motion respects `prefers-reduced-motion`: embers, entrances and the rift's scrolling code stop, and the hero row freezes as a still.
- `LEETCODE_SNAPSHOT` in `src/hooks/use-leetcode-stats.ts` (résumé, October 2026) is only what shows if LeetCode can't be reached.
- Your phone number and email from the Carrd page are deliberately not on the site. Add a mailto link to the list in `contact.tsx` if you want one.
- Fonts (UnifrakturCook, IM Fell English, Hanken Grotesk) are installed from npm via Fontsource, so there are no external font requests.
