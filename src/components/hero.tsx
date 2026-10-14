import * as React from "react"
import { TiltedGridHero } from "@/components/ui/tilted-grid-hero"
import { FACES, faceSrc } from "@/lib/moods"

const IMAGES = FACES.map((f) => ({ src: faceSrc(f.slug), alt: f.label }))

function useNarrow() {
  const [narrow, setNarrow] = React.useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches)
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)")
    const on = () => setNarrow(mq.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])
  return narrow
}

function Name({ text }: { text: string }) {
  let i = 0
  return (
    <h1
      aria-label={text}
      className="m-0 font-blackletter text-[clamp(3.1rem,12.5vw,8.5rem)] font-bold leading-[0.98] tracking-[-0.01em] text-foreground [text-shadow:0_0_60px_color-mix(in_oklab,var(--accent)_45%,transparent)]"
    >
      {text.split(" ").map((word, w) => (
        <React.Fragment key={w}>
          {w > 0 && " "}
          <span aria-hidden className="inline-block whitespace-nowrap">
            {word.split("").map((ch) => (
              <span key={i} className="name-letter" style={{ "--i": i++ } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
        </React.Fragment>
      ))}
    </h1>
  )
}

export function Hero() {
  const narrow = useNarrow()
  return (
    <section id="top" data-mood="ember" className="relative z-10">
      <TiltedGridHero
        images={IMAGES}
        aspectRatio={3 / 4}
        tileHeight={narrow ? 36 : 42}
        axis={narrow ? 52 : 60}
        gap={7}
        curve={74}
        fade={14}
        speed={5}
        className="h-[max(100svh,640px)] w-full"
      >
        <div className="relative z-10 flex h-full flex-col justify-between px-5 pt-[4.5rem] pb-24 sm:px-8 sm:pb-28">
          <div className="mx-auto w-full max-w-6xl">
            <Name text="Daniel Robinson" />
            <p className="hero-fade mt-2 font-engraved text-[clamp(1.05rem,2.4vw,1.5rem)] italic text-muted-foreground">
              Computer science student at VIT Chennai
            </p>
          </div>

          <div className="hero-fade mx-auto grid w-full max-w-6xl items-end gap-5 md:grid-cols-[minmax(0,34rem)_auto] md:justify-between">
            <p className="m-0 text-[1rem] leading-snug text-foreground/90 sm:text-[1.1rem] sm:leading-relaxed">
              I build web tools, simulations and small AI assistants, and I take each one as far as a working demo that anyone can open.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#work"
                className="inline-flex h-11 items-center rounded-full bg-brand px-5 text-[15px] font-semibold text-background transition-transform hover:-translate-y-0.5"
              >
                See what I've built
              </a>
              <a
                href="#activity"
                className="inline-flex h-11 items-center rounded-full border border-border bg-background/60 px-5 text-[15px] font-medium backdrop-blur transition-colors hover:border-brand hover:text-brand"
              >
                Watch my GitHub live
              </a>
            </div>
          </div>
        </div>
      </TiltedGridHero>
    </section>
  )
}
