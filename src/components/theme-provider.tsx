import * as React from "react"
import { MOODS, type Mood, type MoodId } from "@/lib/moods"

interface ThemeCtx {
  /** The mood currently painting the page. */
  mood: Mood
  /** The mood the visitor picked, or null while the page follows the scroll. */
  locked: MoodId | null
  setLocked: (id: MoodId | null) => void
  /** Live RGB of the active mood for canvas code that can't read CSS transitions. */
  rgbRef: React.RefObject<[number, number, number]>
}

const Ctx = React.createContext<ThemeCtx | null>(null)

export function useMood() {
  const v = React.useContext(Ctx)
  if (!v) throw new Error("useMood must be used inside <ThemeProvider>")
  return v
}

const KEY = "dr-mood"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [locked, setLockedState] = React.useState<MoodId | null>(() => {
    try {
      const v = localStorage.getItem(KEY) as MoodId | null
      return v && v in MOODS ? v : null
    } catch {
      return null
    }
  })
  const [auto, setAuto] = React.useState<MoodId>("ember")
  const mood = MOODS[locked ?? auto]
  const rgbRef = React.useRef<[number, number, number]>(mood.rgb)

  const setLocked = React.useCallback((id: MoodId | null) => {
    setLockedState(id)
    try {
      if (id) localStorage.setItem(KEY, id)
      else localStorage.removeItem(KEY)
    } catch {
      /* storage is optional */
    }
  }, [])

  // Paint the mood onto the page. --accent is a registered colour, so CSS blends it.
  React.useEffect(() => {
    const root = document.documentElement
    root.dataset.mood = mood.id
    root.style.setProperty("--accent", mood.accent)
    rgbRef.current = mood.rgb
  }, [mood])

  // Follow the scroll: whichever [data-mood] section crosses the middle of the screen sets the mood.
  React.useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("section[data-mood]"))
    if (!els.length || !("IntersectionObserver" in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            const id = (en.target as HTMLElement).dataset.mood as MoodId
            if (id in MOODS) setAuto(id)
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const value = React.useMemo(() => ({ mood, locked, setLocked, rgbRef }), [mood, locked, setLocked])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
