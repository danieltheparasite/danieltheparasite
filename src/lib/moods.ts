import type { PaletteInput } from "@/components/ui/contribution-skyline"

/**
 * The central theme. A "mood" is one of Daniel's drawn expressions plus the
 * colour that expression owns. Everything dynamic on the site (accent, page
 * tint, embers, the GitHub skyline, the dock) reads from the active mood.
 */
export type MoodId = "ember" | "tide" | "rose" | "gold" | "ash"

export interface Mood {
  id: MoodId
  name: string
  face: string
  accent: string
  rgb: [number, number, number]
  /** Four colours for the skyline, lightest to heaviest, tuned for a dark page. */
  palette: PaletteInput
}

export const MOODS: Record<MoodId, Mood> = {
  ember: { id: "ember", name: "Wrath", face: "/faces/wrath.webp", accent: "#ec4a2f", rgb: [236, 74, 47], palette: "ember" },
  tide: { id: "tide", name: "Grief", face: "/faces/huge-cry.webp", accent: "#4da3ff", rgb: [77, 163, 255], palette: "ocean" },
  rose: { id: "rose", name: "Blush", face: "/faces/major-blush.webp", accent: "#ff6f9c", rgb: [255, 111, 156], palette: ["#3d1424", "#7a2342", "#d6457a", "#ff9ec0"] },
  gold: { id: "gold", name: "Crown", face: "/faces/sigma.webp", accent: "#f2b632", rgb: [242, 182, 50], palette: "halloween" },
  ash: { id: "ash", name: "Ash", face: "/faces/bw.webp", accent: "#d9d4ca", rgb: [217, 212, 202], palette: "mono" },
}

export const MOOD_LIST = Object.values(MOODS)

/** All twenty drawings, in the order the hero shows them. */
export const FACES: { slug: string; label: string }[] = [
  { slug: "normal", label: "Normal" },
  { slug: "wrath", label: "Wrath" },
  { slug: "smile", label: "Smile" },
  { slug: "huge-cry", label: "Huge cry" },
  { slug: "excited", label: "Excited" },
  { slug: "bw", label: "Black and white" },
  { slug: "blush", label: "Blush" },
  { slug: "sigma", label: "Sigma" },
  { slug: "confused", label: "Confused" },
  { slug: "heart", label: "Heart" },
  { slug: "traumatised", label: "Traumatised" },
  { slug: "kind", label: "Kind" },
  { slug: "angry", label: "Angry" },
  { slug: "major-blush", label: "Major blush" },
  { slug: "what", label: "What" },
  { slug: "mild-cry", label: "Mild cry" },
  { slug: "exclamation", label: "Exclamation" },
  { slug: "awkward", label: "Awkward" },
  { slug: "tired", label: "Tired" },
  { slug: "eh", label: "Eh" },
]

export const faceSrc = (slug: string) => `/faces/${slug}.webp`
