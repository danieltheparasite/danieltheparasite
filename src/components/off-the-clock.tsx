import { BookOpen, Eye, Headphones, Pencil } from "lucide-react"
import { Section, SectionHead } from "@/components/section"

const HOBBIES = [
  { Icon: BookOpen, name: "Reading", text: "Comics and literature." },
  { Icon: Pencil, name: "Drawing", text: "Sketching in an app on my phone. The faces on this site are mine." },
  { Icon: Headphones, name: "Listening", text: "Music, and some piano of my own." },
  { Icon: Eye, name: "Looking", text: "Well-made websites, posters and paintings." },
]

export function OffTheClock() {
  return (
    <Section id="offtheclock" mood="ash">
      <SectionHead title="When I'm not building.">Mostly things with pages, pencils and keys.</SectionHead>
      <ul className="m-0 grid list-none grid-cols-1 border-t border-l border-border p-0 sm:grid-cols-2 lg:grid-cols-4">
        {HOBBIES.map(({ Icon, name, text }) => (
          <li key={name} className="group relative border-r border-b border-border p-6 transition-colors duration-300 hover:bg-card sm:p-7">
            <span aria-hidden className="hatch pointer-events-none absolute inset-0 text-brand/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <Icon aria-hidden className="relative size-8 text-muted-foreground transition-[color,transform] duration-500 group-hover:-rotate-6 group-hover:scale-110 group-hover:text-brand" strokeWidth={1.25} />
            <h3 className="relative m-0 mt-8 font-engraved text-[1.6rem] font-normal">{name}</h3>
            <p className="relative m-0 mt-2 text-[15px] text-muted-foreground">{text}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
