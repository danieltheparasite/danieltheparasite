import type { ContributionDay } from "@/components/ui/contribution-skyline"
import { getJson, useLiveData } from "@/hooks/use-live-data"

interface ApiResponse {
  contributions?: { date: string; count: number }[]
}

const clean = (json: ApiResponse): ContributionDay[] => {
  const days = (json.contributions ?? [])
    .filter((d) => d && typeof d.date === "string")
    .map((d) => ({ date: d.date, count: Number(d.count) || 0 }))
  if (!days.length) throw new Error("No contribution data returned")
  return days
}

/**
 * Live GitHub contributions for a public profile, refreshed on every visit.
 *
 * Source order:
 *  1. `/api/github`, this site's own function (api/github.ts), which reads github.com directly.
 *  2. A public mirror, in case the site is on a host without functions.
 * If both fail, the last saved copy stays on screen.
 */
export function useGithubContributions(user: string, pollMs?: number) {
  const { data, ...rest } = useLiveData<ContributionDay[]>({
    key: `dr-gh-${user}`,
    pollMs,
    fetcher: async (signal, force) => {
      const bust = force ? `?t=${Date.now()}` : ""
      try {
        return clean(await getJson<ApiResponse>(`/api/github${bust}`, signal))
      } catch (err) {
        if ((err as Error).name === "AbortError") throw err
        const mirror = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(user)}?y=last`
        return clean(await getJson<ApiResponse>(mirror, signal))
      }
    },
  })
  return { data: data ?? [], ...rest }
}
