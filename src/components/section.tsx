import * as React from "react"
import type { MoodId } from "@/lib/moods"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

export function Rule({ className }: { className?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.6)
  return <div ref={ref} data-in={seen} className={cn("rule", className)} />
}

/** A page section. `mood` is the colour the page eases to while this section is on screen. */
export function Section({ id, mood, className, children }: { id: string; mood: MoodId; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} data-mood={mood} className={cn("relative z-10 py-20 sm:py-28", className)}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Rule className="mb-10 sm:mb-14" />
        {children}
      </div>
    </section>
  )
}

export function SectionHead({ title, children, className }: { title: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-10 max-w-3xl sm:mb-14", className)}>
      <h2 className="m-0 font-engraved text-[clamp(2.1rem,5.6vw,4rem)] font-normal leading-[1.05] tracking-[-0.01em] text-balance">{title}</h2>
      {children && <p className="mt-4 max-w-[58ch] text-muted-foreground text-pretty">{children}</p>}
    </div>
  )
}
