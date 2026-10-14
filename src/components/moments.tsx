import * as React from "react"
import { Section, SectionHead } from "@/components/section"

const ITEMS = [
  {
    title: "MLH hackathons",
    meta: "Several events, most recently on 5 October 2026",
    body: "I've taken part in several Major League Hacking hackathons. The latest was Hacktoberfest Hack Day Chennai × Android Club VITC, where I built the Argument Steelman Engine with a team.",
  },
  { title: "Capture the flag", meta: "Security", body: "I've played in a few CTF competitions." },
  { title: "Make-Your-Own-Jarvis", meta: "Workshop", body: "I attended the Make-Your-Own-Jarvis workshop." },
]

function Certificate() {
  const ref = React.useRef<HTMLDivElement>(null)
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || e.pointerType !== "mouse") return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(1000px) rotateY(${(x * 12).toFixed(2)}deg) rotateX(${(-y * 12).toFixed(2)}deg) scale(1.02)`
  }
  return (
    <figure className="m-0">
      <div
        ref={ref}
        onPointerMove={move}
        onPointerLeave={() => ref.current && (ref.current.style.transform = "")}
        className="overflow-hidden rounded-sm border border-foreground/30 shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--accent)_55%,transparent)] transition-transform duration-200 ease-out will-change-transform"
      >
        <img src="/certificate.webp" alt="Certificate of attendance: Daniel Robinson attended Hacktoberfest Hack Day Chennai × Android Club VITC in person on October 5, 2026." width={553} height={396} className="block h-auto w-full" loading="lazy" />
      </div>
      <figcaption className="mt-3 text-[14px] text-muted-foreground">Certificate of attendance, Hacktoberfest 2026</figcaption>
    </figure>
  )
}

export function Moments() {
  return (
    <Section id="moments" mood="ember">
      <SectionHead title="Hackathons, CTFs and workshops.">The places I go to build fast, break things and learn from people who do it better.</SectionHead>
      <div className="grid items-start gap-12 md:grid-cols-[1fr_minmax(0,26rem)] md:gap-16 lg:grid-cols-[1fr_minmax(0,30rem)]">
        <ul className="m-0 list-none border-t border-border p-0 md:order-1">
          {ITEMS.map((it) => (
            <li key={it.title} className="border-b border-border py-6">
              <h3 className="m-0 font-engraved text-[1.7rem] font-normal leading-tight">{it.title}</h3>
              <p className="m-0 mt-1 text-[14px] text-brand">{it.meta}</p>
              <p className="m-0 mt-3 max-w-[54ch] text-foreground/90">{it.body}</p>
            </li>
          ))}
        </ul>
        <div className="md:order-2 md:sticky md:top-24">
          <Certificate />
        </div>
      </div>
    </Section>
  )
}
