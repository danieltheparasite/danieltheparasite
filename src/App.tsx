import { ThemeProvider } from "@/components/theme-provider"
import { Atmosphere } from "@/components/atmosphere"
import { SiteHeader } from "@/components/site-header"
import { MoodDock } from "@/components/mood-dock"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Work } from "@/components/work"
import { Activity } from "@/components/activity"
import { Solving } from "@/components/solving"
import { Moments } from "@/components/moments"
import { OffTheClock } from "@/components/off-the-clock"
import { Contact } from "@/components/contact"

export default function App() {
  return (
    <ThemeProvider>
      <Atmosphere />
      <div aria-hidden className="grain" />
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Work />
        <Activity />
        <Solving />
        <Moments />
        <OffTheClock />
        <Contact />
      </main>
      <MoodDock />
    </ThemeProvider>
  )
}
