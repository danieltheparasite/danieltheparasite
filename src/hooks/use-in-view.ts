import * as React from "react"

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** True once the element has scrolled into view (and stays true). */
export function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = React.useRef<T>(null)
  const [seen, setSeen] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!("IntersectionObserver" in window)) return setSeen(true)
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen] as const
}

/** Counts up to `to` once `start` is true. If `to` changes later (e.g. live data arrives), it glides from the number on screen. */
export function useCountUp(to: number, start: boolean, ms = 1400) {
  const [v, setV] = React.useState(0)
  const shown = React.useRef(0)
  React.useEffect(() => {
    if (!start) return
    if (prefersReducedMotion()) {
      shown.current = to
      return setV(to)
    }
    let raf = 0
    const from = shown.current
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms)
      shown.current = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)))
      setV(shown.current)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, start, ms])
  return v
}
