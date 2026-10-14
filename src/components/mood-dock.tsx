import { useMood } from "@/components/theme-provider"
import { MOOD_LIST } from "@/lib/moods"
import { cn } from "@/lib/utils"

/** The theme control: pick a mood to lock the page to it, or let it follow the scroll. */
export function MoodDock() {
  const { mood, locked, setLocked } = useMood()
  return (
    <div
      role="group"
      aria-label="Page mood"
      className="fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 mx-auto flex w-fit max-w-[calc(100vw-1.5rem)] items-center gap-1 rounded-full border border-border bg-background/80 p-1 shadow-[0_8px_30px_rgb(0_0_0/0.5)] backdrop-blur-md"
    >
      <button
        type="button"
        onClick={() => setLocked(null)}
        aria-pressed={locked === null}
        title="Let the mood follow the page"
        className={cn(
          "h-9 rounded-full px-3 text-[13px] font-medium transition-colors",
          locked === null ? "bg-brand text-background" : "text-muted-foreground hover:text-foreground",
        )}
      >
        Auto
      </button>
      {MOOD_LIST.map((m) => {
        const on = mood.id === m.id
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => setLocked(locked === m.id ? null : m.id)}
            aria-pressed={locked === m.id}
            aria-label={`${m.name} mood`}
            title={m.name}
            className="group relative size-9 shrink-0 rounded-full p-0.5 transition-transform hover:scale-110 focus-visible:scale-110"
            style={{ boxShadow: on ? `0 0 0 2px ${m.accent}` : "0 0 0 1px var(--border)" }}
          >
            <img
              src={m.face}
              alt=""
              draggable={false}
              className={cn("size-full rounded-full object-cover object-[50%_28%] transition-[filter,opacity]", on ? "opacity-100" : "opacity-60 group-hover:opacity-100")}
            />
          </button>
        )
      })}
      <span aria-live="polite" className="hidden pr-3 pl-2 font-engraved text-[15px] italic text-foreground sm:block min-w-[3.6rem]">
        {mood.name}
      </span>
    </div>
  )
}
