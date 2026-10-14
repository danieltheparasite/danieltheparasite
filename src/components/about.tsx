import * as React from "react"
import { Section, SectionHead } from "@/components/section"
import { FACES, faceSrc } from "@/lib/moods"

const FACTS: { k: string; v: string }[] = [
  { k: "Studying", v: "B.Tech, Computer Science and Engineering at VIT Chennai" },
  { k: "Languages", v: "Python, JavaScript, HTML, CSS" },
  { k: "Building", v: "Web apps, simulations, retrieval-augmented assistants" },
  { k: "Tools", v: "Node.js, Git, GitHub" },
  { k: "Outside code", v: "Editorial team at school. Piano, Grade 5 with Trinity College London." },
]

function Portrait() {
  const [i, setI] = React.useState(0)
  const ref = React.useRef<HTMLButtonElement>(null)
  const face = FACES[i]

  const move = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = ref.current
    if (!el || e.pointerType !== "mouse") return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${(x * 10).toFixed(2)}deg) rotateX(${(-y * 10).toFixed(2)}deg)`
  }
  const reset = () => {
    if (ref.current) ref.current.style.transform = ""
  }
  const next = () => {
    let n = i
    while (n === i) n = Math.floor(Math.random() * FACES.length)
    setI(n)
  }

  return (
    <figure className="m-0 mx-auto w-full max-w-[19rem] md:mx-0">
      <div className="relative">
        <div aria-hidden className="hatch absolute inset-0 translate-x-3 translate-y-3 rounded-sm text-brand/40" />
        <button
          ref={ref}
          type="button"
          onClick={next}
          onPointerMove={move}
          onPointerLeave={reset}
          aria-label="Change my expression"
          className="relative block aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-sm border border-foreground/30 bg-muted p-0 transition-transform duration-200 ease-out will-change-transform"
        >
          <img src={faceSrc(face.slug)} alt={`A drawing of me, expression: ${face.label}`} width={420} height={560} className="size-full object-cover" draggable={false} />
        </button>
      </div>
      <figcaption className="mt-6 flex items-baseline justify-between gap-4 text-[14px] text-muted-foreground">
        <span aria-live="polite" className="font-engraved text-[1.35rem] italic text-foreground">
          {face.label}
        </span>
        <span>Tap to change my expression</span>
      </figcaption>
    </figure>
  )
}

export function About() {
  return (
    <Section id="about" mood="ash">
      <div className="grid gap-12 md:grid-cols-[19rem_1fr] md:gap-16 lg:grid-cols-[21rem_1fr]">
        <Portrait />
        <div>
          <SectionHead title="I don't call something finished until you can open it.">
            I'm a computer science student at VIT Chennai. I make web tools, simulations and small AI assistants, and I'm a regular at hackathons and CTFs.
          </SectionHead>
          <dl className="m-0 border-t border-border">
            {FACTS.map((f) => (
              <div key={f.k} className="grid gap-1 border-b border-border py-4 sm:grid-cols-[8.5rem_1fr] sm:gap-6">
                <dt className="text-[14px] text-muted-foreground">{f.k}</dt>
                <dd className="m-0">{f.v}</dd>
              </div>
            ))}
          </dl>
          <blockquote className="m-0 mt-10 max-w-[44ch] border-l-2 border-brand pl-5 font-engraved text-[1.3rem] italic leading-snug text-foreground/90">
            The universe is neither cruel nor kind, it's flawlessly precise. But the man who calls the universe "mediocre" creates a better one.
          </blockquote>
        </div>
      </div>
    </Section>
  )
}
