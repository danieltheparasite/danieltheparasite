import * as React from "react"
import { RefreshCw } from "lucide-react"
import ContributionSkyline from "@/components/ui/contribution-skyline"
import { Section, SectionHead } from "@/components/section"
import { useMood } from "@/components/theme-provider"
import { useGithubContributions } from "@/hooks/use-github-contributions"
import { ago, useNow } from "@/lib/ago"

const USER = "danieltheparasite"

export function Activity() {
  const { mood } = useMood()
  const { data, status, stale, fetchedAt, refresh } = useGithubContributions(USER)
  const now = useNow(30_000)
  // Palette objects are compared by identity inside the chart, so keep this one stable per mood.
  const palette = React.useMemo(() => mood.palette, [mood])

  const title =
    status === "loading" ? (
      <span className="text-muted-foreground">Reading github.com/{USER}…</span>
    ) : status === "error" ? (
      <span>No GitHub data to show yet</span>
    ) : undefined

  return (
    <Section id="activity" mood="tide">
      <SectionHead title="My year on GitHub, drawn as a skyline.">
        This is my real contribution calendar from github.com/{USER}. It reloads while the page is open, so a new commit appears without a refresh.
      </SectionHead>

      <ContributionSkyline
        data={data}
        palette={palette}
        title={title}
        unit="contribution"
        defaultView="3d"
      />

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-muted-foreground" role="status">
        {status === "loading" && <span>Fetching the latest numbers…</span>}
        {status === "error" && <span>Couldn't reach GitHub just now. Check your connection and try again.</span>}
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
        <a className="underline decoration-border underline-offset-4 hover:text-brand" href={`https://github.com/${USER}`} target="_blank" rel="noreferrer">
          Open the profile
        </a>
      </div>
    </Section>
  )
}
