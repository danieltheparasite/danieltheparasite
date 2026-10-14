import { RefreshCw } from "lucide-react"
import { Section, SectionHead } from "@/components/section"
import { useCountUp, useInView } from "@/hooks/use-in-view"
import { useLeetCodeStats } from "@/hooks/use-leetcode-stats"
import { ago, useNow } from "@/lib/ago"

const USER = "danieltheparasite"

const LINKS = [
  { label: "LeetCode", href: `https://leetcode.com/u/${USER}/` },
  { label: "Codewars", href: "https://www.codewars.com/users/danieltheparasite" },
  { label: "Coddy", href: "https://coddy.tech/user/danieltheparasite" },
]

export function Solving() {
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  const { stats, live, status, stale, fetchedAt, refresh } = useLeetCodeStats(USER)
  const now = useNow(30_000)
  const { total, topics } = stats
  const count = useCountUp(total, seen)
  const top = Math.max(1, topics[0]?.n ?? 1)

  return (
    <Section id="solving" mood="rose">
      <div ref={ref} className="grid items-start gap-12 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-16">
        <div>
          <p role="img" className="m-0 font-blackletter text-[clamp(6rem,20vw,11rem)] leading-[0.85] text-brand tabular-nums" aria-label={`${total} problems`}>
            {count}
          </p>
          <SectionHead title="problems solved on LeetCode, in Python." className="mt-4 mb-6 sm:mb-6">
            I practise on a few sites. The bars show which topics those problems touch.
          </SectionHead>
          <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-[15px]">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer" className="border-b border-border pb-0.5 transition-colors hover:border-brand hover:text-brand">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ul className="m-0 list-none space-y-4 p-0" aria-label="Problems solved by topic">
            {topics.map((t, i) => (
              <li key={t.name} className="grid grid-cols-[6.5rem_1fr_2rem] items-center gap-3 text-[15px] sm:grid-cols-[9rem_1fr_2.5rem]">
                <span className="truncate">{t.name}</span>
                <span className="hatch-fine relative block h-4 overflow-hidden rounded-[2px] border border-border" aria-hidden>
                  <span
                    className="hatch absolute inset-y-0 left-0 block origin-left bg-brand/25 text-brand transition-[transform,width] duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none"
                    style={{ width: `${(t.n / top) * 100}%`, transform: seen ? "scaleX(1)" : "scaleX(0)", transitionDelay: `${i * 90}ms` }}
                  />
                </span>
                <span className="text-right tabular-nums text-muted-foreground">{t.n}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[52ch] text-[14px] text-muted-foreground">
            One problem can carry several topic tags, so the bars add up to more than {total}.{" "}
            {live ? "These numbers come straight from LeetCode each time you open the page." : "These are the numbers from my résumé, October 2026."}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-muted-foreground" role="status">
            {status === "loading" && <span>Fetching the latest count…</span>}
            {status === "error" && <span>Couldn't reach LeetCode just now, so this is my last known count.</span>}
            {status === "ready" && fetchedAt && (
              <span>
                {stale ? "Showing the copy from your last visit, saved " : "Updated "}
                {ago(fetchedAt, now)}
              </span>
            )}
            <button
              type="button"
              onClick={refresh}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[13px] text-foreground transition-colors hover:border-brand hover:text-brand"
            >
              <RefreshCw aria-hidden className="size-3.5" />
              Refresh now
            </button>
          </div>
        </div>
      </div>
    </Section>
  )
}
