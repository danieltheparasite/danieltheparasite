import { ArrowUpRight } from "lucide-react"
import { Section } from "@/components/section"

const LINKS = [
  { name: "GitHub", handle: "danieltheparasite", href: "https://github.com/danieltheparasite" },
  { name: "LeetCode", handle: "danieltheparasite", href: "https://leetcode.com/u/danieltheparasite/" },
  { name: "LinkedIn", handle: "Daniel Robinson", href: "https://www.linkedin.com/in/daniel-robinson-3a56ba40a/" },
  { name: "Instagram", handle: "@danielhathspoken", href: "https://www.instagram.com/danielhathspoken/" },
  { name: "Codewars", handle: "danieltheparasite", href: "https://www.codewars.com/users/danieltheparasite" },
  { name: "Coddy", handle: "danieltheparasite", href: "https://coddy.tech/user/danieltheparasite" },
  { name: "Daniel, official", handle: "danieltheparasite.carrd.co", href: "https://danieltheparasite.carrd.co/" },
  { name: "Daniel in denial", handle: "danielindenial.carrd.co", href: "https://danielindenial.carrd.co/" },
]

export function Contact() {
  return (
    <Section id="contact" mood="ember" className="pb-36 sm:pb-40">
      <blockquote className="m-0 max-w-[22ch] font-engraved text-[clamp(2.2rem,6.4vw,5rem)] italic leading-[1.05] text-balance">
        Today I step on grass. Later I shall step on mountains and rivers.
      </blockquote>

      <h2 className="mt-16 mb-6 font-engraved text-[1.6rem] font-normal">Find me elsewhere</h2>
      <ul className="m-0 grid list-none border-t border-border p-0 sm:grid-cols-2 sm:gap-x-12">
        {LINKS.map((l) => (
          <li key={l.name} className="border-b border-border">
            <a href={l.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-4 py-4 transition-[padding,color] duration-300 hover:pl-3 hover:text-brand focus-visible:pl-3">
              <span>
                <span className="block text-[1.05rem] font-medium">{l.name}</span>
                <span className="block text-[14px] text-muted-foreground">{l.handle}</span>
              </span>
              <ArrowUpRight aria-hidden className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-14 text-[14px] text-muted-foreground">Daniel Robinson, 2026. The faces are drawings of me, made on my phone.</p>
    </Section>
  )
}
