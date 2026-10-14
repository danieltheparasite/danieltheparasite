/**
 * GET /api/leetcode
 *
 * Asks LeetCode (server side, so the browser's CORS rules don't get in the way)
 * how many problems the user has solved and which topics they touch.
 *
 *   { total: 65, easy: 30, medium: 30, hard: 5,
 *     topics: [{ name: "Array", n: 31 }, ...], fetchedAt: 1760000000000 }
 *
 * Runs as a Vercel Function (and under `npm run dev`, see vite.config.ts).
 * The CDN keeps each answer for 5 minutes.
 */

const USER = process.env.LEETCODE_USER || "danieltheparasite"
const TOP_TOPICS = 6

const QUERY = `
query portfolioStats($username: String!) {
  matchedUser(username: $username) {
    submitStatsGlobal { acSubmissionNum { difficulty count } }
    tagProblemCounts {
      advanced { tagName problemsSolved }
      intermediate { tagName problemsSolved }
      fundamental { tagName problemsSolved }
    }
  }
}`

type Tag = { tagName: string; problemsSolved: number }
type Stats = {
  total: number
  easy: number
  medium: number
  hard: number
  topics: { name: string; n: number }[]
}

/** "Hash Table" -> "Hash table", to match the rest of the site. */
const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

/** Pure: turns LeetCode's GraphQL answer into the shape the site uses. */
export function parseLeetCode(json: any, top = TOP_TOPICS): Stats | null {
  const u = json?.data?.matchedUser
  if (!u) return null
  const byDifficulty = new Map<string, number>()
  for (const r of u.submitStatsGlobal?.acSubmissionNum ?? []) byDifficulty.set(r.difficulty, Number(r.count) || 0)

  const tags: Tag[] = [
    ...(u.tagProblemCounts?.fundamental ?? []),
    ...(u.tagProblemCounts?.intermediate ?? []),
    ...(u.tagProblemCounts?.advanced ?? []),
  ]
  const topics = tags
    .filter((t) => t && t.tagName && t.problemsSolved > 0)
    .map((t) => ({ name: sentence(t.tagName), n: Number(t.problemsSolved) }))
    .sort((a, b) => b.n - a.n || a.name.localeCompare(b.name))
    .slice(0, top)

  return {
    total: byDifficulty.get("All") ?? 0,
    easy: byDifficulty.get("Easy") ?? 0,
    medium: byDifficulty.get("Medium") ?? 0,
    hard: byDifficulty.get("Hard") ?? 0,
    topics,
  }
}

const out = (body: unknown, status = 200, cache = "public, s-maxage=300, stale-while-revalidate=600") =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": cache },
  })

export async function GET(): Promise<Response> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        referer: `https://leetcode.com/u/${USER}/`,
        origin: "https://leetcode.com",
        "user-agent": "Mozilla/5.0 (portfolio stats reader)",
      },
      body: JSON.stringify({ query: QUERY, variables: { username: USER } }),
    })
    if (!res.ok) return out({ error: `LeetCode returned ${res.status}` }, 502, "no-store")
    const stats = parseLeetCode(await res.json())
    if (!stats || !stats.total) return out({ error: "LeetCode returned no solved problems" }, 502, "no-store")
    return out({ ...stats, fetchedAt: Date.now() })
  } catch (err) {
    return out({ error: (err as Error).message || "Could not reach LeetCode" }, 502, "no-store")
  }
}
