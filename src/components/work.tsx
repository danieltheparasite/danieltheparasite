import * as React from "react"
import { ArrowUpRight, Plus } from "lucide-react"
import { Section, SectionHead } from "@/components/section"
import { ChatPlate, DeskPlate, SlingshotPlate, SteelmanPlate, TerminalPlate, VoicePlate } from "@/components/plates"
import { cn } from "@/lib/utils"

const GH = "https://github.com/danieltheparasite/"
const SHOWCASE = "https://daniels-github-showcase.vercel.app/"

const PROJECTS = [
  {
    id: "steelman",
    title: "Argument Steelman Engine",
    tags: "Hack day project, LLM, built with a team",
    body: "Takes any claim and runs a loop of counter-argument, self-critique and strengthening. Every round is scored on logical rigor, relevance and resistance to rebuttal, and the reasoning stays visible.",
    href: GH + "argument-steelman-engine",
    cta: "View the code on GitHub",
    Plate: SteelmanPlate,
  },
  {
    id: "ras",
    title: "IEEE RAS Assistant",
    tags: "RAG, Node.js",
    body: "A retrieval-based assistant that answers questions about the IEEE Robotics and Automation Society from its public information, in a terminal-style interface. Built for the VIT Chennai chapter's AI/ML task.",
    href: GH + "ieee-ras-assistant",
    cta: "View the code on GitHub",
    Plate: TerminalPlate,
  },
  {
    id: "photoelectric",
    title: "Photoelectric Effect Simulation",
    tags: "Physics, simulation, front end",
    body: "A web front end for a photoelectric effect simulation. It opens with a slingshot-style intro that fires an electron at a metal surface.",
    href: GH + "photoelectric-effect",
    cta: "View the code on GitHub",
    Plate: SlingshotPlate,
  },
  {
    id: "voice",
    title: "Voice Web Launcher",
    tags: "Python, speech recognition",
    body: "Opens websites from spoken commands. Say the wake word, then \"open\" and a site name; a spoken command quits it.",
    href: GH + "voice-web-launcher",
    cta: "View the code on GitHub",
    Plate: VoicePlate,
  },
  {
    id: "chat",
    title: "Anonymous Chatrooms",
    tags: "Web, realtime",
    body: "Anonymous chatrooms that start instantly.",
    href: GH + "protecting-private-daniel",
    cta: "View the code on GitHub",
    Plate: ChatPlate,
  },
  {
    id: "showcase",
    title: "GitHub Showcase",
    tags: "three.js, 3D, portfolio",
    body: "A website that shows off my GitHub projects as a low-poly 3D desk. Drag to look around, then click the laptop, the book or the red button to open things.",
    href: SHOWCASE,
    cta: "Open the live site",
    Plate: DeskPlate,
  },
]

export function Work() {
  const [open, setOpen] = React.useState<string | null>(PROJECTS[0].id)
  return (
    <Section id="work" mood="gold">
      <SectionHead title="Six things I've built that you can open.">
        Open a project to see what it does. Each one links to its code on GitHub or to the live site.
      </SectionHead>

      <ul className="m-0 list-none border-t border-border p-0">
        {PROJECTS.map((p) => {
          const on = open === p.id
          return (
            <li key={p.id} className="group/row border-b border-border">
              <h3 className="m-0">
                <button
                  type="button"
                  id={`btn-${p.id}`}
                  aria-expanded={on}
                  aria-controls={`panel-${p.id}`}
                  onClick={() => setOpen(on ? null : p.id)}
                  className="flex w-full cursor-pointer items-center justify-between gap-6 border-0 bg-transparent px-0 py-6 text-left text-foreground sm:py-8"
                >
                  <span className="min-w-0">
                    <span className={cn("block font-engraved text-[clamp(1.55rem,3.8vw,2.7rem)] leading-tight transition-colors duration-300", on ? "text-brand" : "group-hover/row:text-brand")}>
                      {p.title}
                    </span>
                    <span className="mt-1 block text-[14px] font-normal text-muted-foreground">{p.tags}</span>
                  </span>
                  <Plus aria-hidden className={cn("size-7 shrink-0 text-muted-foreground transition-transform duration-500", on && "rotate-[135deg] text-brand")} strokeWidth={1.25} />
                </button>
              </h3>

              <div
                id={`panel-${p.id}`}
                role="region"
                aria-labelledby={`btn-${p.id}`}
                inert={!on}
                className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
                style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="grid items-start gap-6 pb-8 sm:gap-10 md:grid-cols-[minmax(0,1fr)_20rem] sm:pb-10">
                    <div>
                      <p className="m-0 max-w-[52ch] text-[1.05rem] text-foreground/90 text-pretty">{p.body}</p>
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-flex items-center gap-1.5 border-b border-brand pb-0.5 text-[15px] font-medium text-foreground transition-colors hover:text-brand"
                      >
                        {p.cta}
                        <ArrowUpRight aria-hidden className="size-4" />
                      </a>
                    </div>
                    <div className="hatch-fine rounded-sm border border-border bg-card/70 p-4 md:order-last">
                      <p.Plate />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
