import type { CSSProperties, ReactNode } from "react"
import { prefersReducedMotion } from "@/hooks/use-in-view"

/** Small looping illustrations, one per project. They draw with the active mood's accent. */
const i = (n: number) => ({ "--i": n }) as CSSProperties

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 240 150" role="img" aria-label={label} className="block h-auto w-full font-sans text-brand">
      {children}
    </svg>
  )
}

export function SteelmanPlate() {
  const bars = [30, 55, 80, 105]
  return (
    <Frame label="Four bars rising from round one to round four">
      <text x="120" y="20" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">Generate, critique, strengthen</text>
      {bars.map((h, n) => (
        <g key={n}>
          <rect className="plate-bar" style={i(n)} x={30 + n * 50} y={130 - h} width="36" height={h} fill={n === 3 ? "var(--accent)" : "var(--foreground)"} opacity={n === 3 ? 1 : 0.8} />
          <text x={48 + n * 50} y="144" textAnchor="middle" fontSize="9" fill="var(--muted-foreground)">R{n + 1}</text>
        </g>
      ))}
      <line x1="20" y1="130" x2="220" y2="130" stroke="var(--foreground)" strokeWidth="1.5" />
    </Frame>
  )
}

export function TerminalPlate() {
  const lines = [190, 150, 172, 104]
  return (
    <Frame label="A terminal asking what RAS is, with answer lines appearing">
      <text x="22" y="42" fontSize="15" fill="var(--accent)" fontFamily="ui-monospace, Menlo, monospace">&gt; what is RAS?</text>
      <rect className="plate-caret" x="140" y="30" width="8" height="15" fill="var(--accent)" />
      {lines.map((w, n) => (
        <rect key={n} className="plate-line" style={i(n)} x="22" y={64 + n * 17} width={w} height="7" fill="var(--foreground)" opacity="0.7" />
      ))}
    </Frame>
  )
}

export function SlingshotPlate() {
  const still = prefersReducedMotion()
  const path = "M 41 74 Q 105 -22 168 118"
  return (
    <Frame label="A slingshot firing an electron at a metal surface">
      <path d="M 40 136 V 94 M 40 94 L 26 68 M 40 94 L 54 68" stroke="var(--foreground)" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d={path} stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 5" fill="none" />
      <circle cx="41" cy="74" r="7" fill="var(--accent)">
        {!still && <animateMotion dur="3.2s" repeatCount="indefinite" path={path} keyPoints="0;1;1" keyTimes="0;0.7;1" calcMode="linear" />}
      </circle>
      <rect x="146" y="124" width="76" height="9" fill="var(--foreground)" />
      {[150, 164, 178, 192, 206].map((x) => (
        <line key={x} x1={x} y1="133" x2={x - 6} y2="142" stroke="var(--foreground)" strokeWidth="1.2" />
      ))}
      {[[196, 70], [212, 88], [202, 104]].map(([x, y], n) => (
        <circle key={n} cx={x} cy={y} r="2.6" fill="var(--accent)" opacity="0.7" />
      ))}
    </Frame>
  )
}

export function VoicePlate() {
  const arcs = ["M 80 58 A 24 24 0 0 1 80 92", "M 96 44 A 42 42 0 0 1 96 106", "M 112 30 A 60 60 0 0 1 112 120"]
  return (
    <Frame label="Sound waves leaving a dot, next to the word open">
      <circle cx="62" cy="75" r="7" fill="var(--accent)" />
      {arcs.map((d, n) => (
        <path key={n} className="plate-wave" style={i(n)} d={d} stroke="var(--accent)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      ))}
      <text x="150" y="84" fontSize="24" fill="var(--foreground)" fontFamily="ui-monospace, Menlo, monospace">open_</text>
    </Frame>
  )
}

export function DeskPlate() {
  const repos = [58, 74, 90]
  return (
    <Frame label="A laptop on a desk showing a list of repositories, with a red button beside it">
      <line x1="16" y1="122" x2="224" y2="122" stroke="var(--foreground)" strokeWidth="1.5" />
      <path d="M 70 122 L 82 40 H 170 L 182 122" fill="none" stroke="var(--foreground)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 54 122 H 198" stroke="var(--foreground)" strokeWidth="4" strokeLinecap="round" />
      {repos.map((y, n) => (
        <g key={n}>
          <rect x="94" y={y - 5} width="7" height="7" fill="var(--accent)" opacity="0.85" />
          <rect className="plate-line" style={i(n)} x="108" y={y - 4} width={52 - n * 8} height="5" fill="var(--foreground)" opacity="0.7" />
        </g>
      ))}
      <rect x="28" y="104" width="22" height="18" fill="none" stroke="var(--foreground)" strokeWidth="1.5" />
      <circle className="plate-caret" cx="212" cy="116" r="6" fill="var(--accent)" />
    </Frame>
  )
}

export function ChatPlate() {
  return (
    <Frame label="Two chat bubbles appearing one after the other">
      <g className="plate-bubble-a">
        <rect x="24" y="28" width="116" height="46" rx="4" fill="var(--foreground)" />
        <rect x="36" y="42" width="72" height="5" fill="var(--background)" />
        <rect x="36" y="55" width="52" height="5" fill="var(--background)" />
        <path d="M 38 74 L 38 90 L 56 74 Z" fill="var(--foreground)" />
      </g>
      <g className="plate-bubble-b">
        <rect x="100" y="84" width="116" height="46" rx="4" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="7 5" />
        <rect x="112" y="98" width="80" height="5" fill="var(--accent)" />
        <rect x="112" y="111" width="46" height="5" fill="var(--accent)" />
      </g>
    </Frame>
  )
}
