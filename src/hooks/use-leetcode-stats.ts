import { getJson, useLiveData } from "@/hooks/use-live-data"

export interface LeetCodeStats {
  total: number
  topics: { name: string; n: number }[]
}

/** Shown until the first live answer arrives, and kept if LeetCode can't be reached. From my résumé, October 2026. */
export const LEETCODE_SNAPSHOT: LeetCodeStats = {
  total: 65,
  topics: [
    { name: "Array", n: 31 },
    { name: "String", n: 22 },
    { name: "Hash table", n: 22 },
    { name: "Math", n: 21 },
    { name: "Sorting", n: 10 },
    { name: "Bit manipulation", n: 8 },
  ],
}

/**
 * Live LeetCode problem count and topic breakdown, refreshed on every visit
 * through this site's own function (api/leetcode.ts). LeetCode doesn't allow
 * browsers on other sites to call it directly, so the function does it for us.
 */
export function useLeetCodeStats(user: string, pollMs?: number) {
  const { data, ...rest } = useLiveData<LeetCodeStats>({
    key: `dr-lc-${user}`,
    pollMs,
    fetcher: async (signal, force) => {
      const json = await getJson<Partial<LeetCodeStats>>(`/api/leetcode${force ? `?t=${Date.now()}` : ""}`, signal)
      if (!json.total || !Array.isArray(json.topics) || !json.topics.length) throw new Error("Incomplete LeetCode data")
      return { total: Number(json.total), topics: json.topics.map((t) => ({ name: String(t.name), n: Number(t.n) })) }
    },
  })
  // `live` is true only when these numbers really came from LeetCode (fresh or saved from an earlier visit).
  return { stats: data ?? LEETCODE_SNAPSHOT, live: data !== null, ...rest }
}
