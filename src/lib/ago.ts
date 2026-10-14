import * as React from "react"

/** Re-renders every `ms` so "2 minutes ago" keeps ticking. */
export function useNow(ms: number) {
  const [now, setNow] = React.useState(() => Date.now())
  React.useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), ms)
    return () => window.clearInterval(id)
  }, [ms])
  return now
}

export function ago(from: number, now: number) {
  const s = Math.max(0, Math.round((now - from) / 1000))
  if (s < 45) return "just now"
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
  if (s < 3600) return rtf.format(-Math.round(s / 60), "minute")
  if (s < 86400) return rtf.format(-Math.round(s / 3600), "hour")
  return rtf.format(-Math.round(s / 86400), "day")
}
