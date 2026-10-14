/**
 * GET /api/github
 *
 * Reads the public contribution calendar for the GitHub user below, straight
 * from github.com, and returns it as JSON. No token needed.
 *
 *   { contributions: [{ date: "2026-10-14", count: 3 }, ...], total: 412, fetchedAt: 1760000000000 }
 *
 * Runs as a Vercel Function (and under `npm run dev`, see vite.config.ts).
 * The CDN keeps each answer for 5 minutes, so a visit never hammers GitHub.
 */

const USER = process.env.GITHUB_USER || "danieltheparasite"

type Day = { date: string; count: number }

// Used only if a tooltip is missing from the page: a rough count per heat level.
const LEVEL_GUESS = [0, 1, 3, 6, 10]

/** Pure: turns the HTML of github.com/users/<user>/contributions into days. */
export function parseContributions(html: string): Day[] {
  // "3 contributions on October 14th." / "1 contribution on ..." / "No contributions on ..."
  const counts = new Map<string, number>()
  for (const m of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>\s*([^<]*?)\s*<\/tool-tip>/g)) {
    const n = /^(\d[\d,]*)\s+contribution/i.exec(m[2])
    counts.set(m[1], n ? Number(n[1].replace(/,/g, "")) : 0)
  }

  const days: Day[] = []
  for (const m of html.matchAll(/<td\b[^>]*\bContributionCalendar-day\b[^>]*>/g)) {
    const tag = m[0]
    const date = /\bdata-date="(\d{4}-\d{2}-\d{2})"/.exec(tag)?.[1]
    if (!date) continue
    const id = /\bid="([^"]+)"/.exec(tag)?.[1]
    const level = Number(/\bdata-level="(\d)"/.exec(tag)?.[1] ?? 0)
    const count = id && counts.has(id) ? counts.get(id)! : LEVEL_GUESS[level] ?? 0
    days.push({ date, count })
  }
  return days.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
}

const json = (body: unknown, status = 200, cache = "public, s-maxage=300, stale-while-revalidate=600") =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": cache },
  })

export async function GET(): Promise<Response> {
  try {
    const res = await fetch(`https://github.com/users/${encodeURIComponent(USER)}/contributions`, {
      headers: { "user-agent": "Mozilla/5.0 (portfolio contribution reader)", accept: "text/html" },
    })
    if (!res.ok) return json({ error: `GitHub returned ${res.status}` }, 502, "no-store")
    const days = parseContributions(await res.text())
    if (!days.length) return json({ error: "No contribution calendar found on the page" }, 502, "no-store")
    return json({
      contributions: days,
      total: days.reduce((s, d) => s + d.count, 0),
      fetchedAt: Date.now(),
    })
  } catch (err) {
    return json({ error: (err as Error).message || "Could not reach GitHub" }, 502, "no-store")
  }
}
