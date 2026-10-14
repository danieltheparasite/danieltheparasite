import * as React from "react"

export type LiveStatus = "loading" | "ready" | "error"

export interface Live<T> {
  data: T | null
  status: LiveStatus
  /** True when what's on screen is the saved copy from an earlier visit, not a fresh fetch. */
  stale: boolean
  fetchedAt: number | null
  refresh: () => void
}

interface Options<T> {
  /** localStorage key for the last good copy. */
  key: string
  /** Fetch fresh data. `force` is true for the "Refresh now" button. Throw if every source fails. */
  fetcher: (signal: AbortSignal, force: boolean) => Promise<T>
  /** Re-fetch this often while the page is open. */
  pollMs?: number
}

function readCache<T>(key: string): { data: T; at: number } | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * Shows the last saved copy instantly, then fetches fresh data on load, whenever
 * the tab becomes visible again, and every `pollMs`. If a fetch fails the last
 * good data stays; `status` is "error" only when there is nothing to show.
 */
export function useLiveData<T>({ key, fetcher, pollMs = 5 * 60 * 1000 }: Options<T>): Live<T> {
  const cached = React.useMemo(() => readCache<T>(key), [key])
  const [data, setData] = React.useState<T | null>(cached?.data ?? null)
  const [status, setStatus] = React.useState<LiveStatus>(cached ? "ready" : "loading")
  const [stale, setStale] = React.useState(Boolean(cached))
  const [fetchedAt, setFetchedAt] = React.useState<number | null>(cached?.at ?? null)
  const inflight = React.useRef<AbortController | null>(null)
  const fetcherRef = React.useRef(fetcher)
  fetcherRef.current = fetcher

  const load = React.useCallback(
    async (force = false) => {
      inflight.current?.abort()
      const ac = new AbortController()
      inflight.current = ac
      try {
        const next = await fetcherRef.current(ac.signal, force)
        const at = Date.now()
        setData(next)
        setStatus("ready")
        setStale(false)
        setFetchedAt(at)
        try {
          localStorage.setItem(key, JSON.stringify({ data: next, at }))
        } catch {
          /* cache is optional */
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return
        setStale(true)
        setStatus((s) => (s === "ready" ? "ready" : "error"))
      }
    },
    [key],
  )

  React.useEffect(() => {
    load()
    const id = window.setInterval(() => load(), pollMs)
    const onVisible = () => {
      if (document.visibilityState === "visible") load()
    }
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener("visibilitychange", onVisible)
      inflight.current?.abort()
    }
  }, [load, pollMs])

  const refresh = React.useCallback(() => void load(true), [load])
  return { data, status, stale, fetchedAt, refresh }
}

/** GET JSON, rejecting on non-2xx or a non-JSON body (e.g. a host's HTML 404 page). */
export async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal, headers: { Accept: "application/json" } })
  if (!res.ok) throw new Error(`${url} returned ${res.status}`)
  return (await res.json()) as T
}
