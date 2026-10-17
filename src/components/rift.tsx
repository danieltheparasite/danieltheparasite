import * as React from "react"
import { ArrowUpRight } from "lucide-react"
import { Section, SectionHead } from "@/components/section"
import { prefersReducedMotion } from "@/hooks/use-in-view"

const SHOWCASE = "https://daniels-github-showcase.vercel.app/"

/** The rift is the one thing on the page that is not the active mood colour. It is leaking in from somewhere else. */
const GREEN = "61,255,134"
const BONE = "236,231,221"

/** Raw lines that scroll through the crack. Kept short so a column never runs into the next one. */
const CODE = [
  "$ git clone danieltheparasite",
  "const repos = await gh.list()",
  "for (const r of repos) {",
  "  r.open()",
  "}",
  "def build(idea):",
  "    return demo(idea)",
  "import * as THREE from 'three'",
  "scene.add(desk, laptop, book)",
  "camera.lookAt(desk.position)",
  "$ npm run build",
  "✓ compiled in 2.1s",
  "git push origin main",
  "fetch('/api/github')",
  "  .then((r) => r.json())",
  "if (!finished) keep_going()",
  "while (true) { ship() }",
  "export default function Desk()",
  "renderer.setAnimationLoop(tick)",
  "{ commits: 1, stars: 0 }",
  "$ vercel --prod",
  "<button id=\"red\" />",
  "raycaster.intersectObjects()",
  "// you found the crack",
  "0x4f 0x70 0x65 0x6e",
  "await page.goto(showcase)",
  "const mood = 'wrath'",
  "console.log('hello?')",
]

/* ---------- small deterministic helpers ---------- */

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const hash = (a: number, b: number) => {
  const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453
  return s - Math.floor(s)
}
const mod = (n: number, m: number) => ((n % m) + m) % m

/* ---------- the crack's shape, fixed once ---------- */

const N = 34
const BASE = 0.34
const REST = 0.58

interface Pt {
  x: number
  env: number
  mid: number
  t: number
  b: number
}
interface Hover {
  target: number
  px: number
}
interface Branch {
  i: number
  side: 1 | -1
  steps: [number, number][]
}

const { GEO, BRANCHES } = (() => {
  const r = mulberry32(20261018)
  const geo: Pt[] = []
  for (let i = 0; i <= N; i++) {
    const edge = i === 0 || i === N
    const x = edge ? i / N : (i + (r() - 0.5) * 0.7) / N
    const env = Math.pow(Math.sin(Math.PI * x), 0.6)
    const mid = Math.sin(x * 7.1 + 0.6) * 0.04 + Math.sin(x * 15.3 + 2.1) * 0.02
    geo.push({ x, env, mid, t: 0.3 + r() * 0.85, b: 0.3 + r() * 0.85 })
  }
  const branches: Branch[] = []
  const starts = [4, 7, 10, 13, 17, 20, 23, 26, 29]
  starts.forEach((i, n) => {
    const side = (n % 2 ? 1 : -1) as 1 | -1
    const len = 3 + Math.floor(r() * 3)
    const steps: [number, number][] = []
    for (let k = 0; k < len; k++) steps.push([(r() - 0.5) * 1.6, 0.35 + r() * 0.65])
    branches.push({ i, side, steps })
  })
  return { GEO: geo, BRANCHES: branches }
})()

/**
 * A crack torn across the page with raw green code scrolling inside it.
 * It opens wider as you reach for it, and the whole thing is a link to the showcase site.
 */
function RiftCanvas({ hoverRef }: { hoverRef: React.RefObject<Hover> }) {
  const ref = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const cv = ref.current
    const ctx = cv?.getContext("2d")
    if (!cv || !ctx) return
    const still = prefersReducedMotion()

    let W = 0
    let H = 0
    let raf = 0
    let running = false
    let visible = true
    let last = 0
    let phase = 0
    let h = 0

    const draw = (now: number) => {
      const s = hoverRef.current
      const open = REST + (1 - REST) * h + (still ? 0 : (1 - h) * 0.06 * Math.sin(now / 1300))

      // The two jagged edges, in pixels.
      const top: [number, number][] = []
      const bot: [number, number][] = []
      for (const g of GEO) {
        const bulge = Math.exp(-Math.pow((g.x - s.px) / 0.14, 2)) * 0.32 * h
        const mid = 0.5 + g.mid
        const up = BASE * g.env * (open * g.t + bulge)
        const down = BASE * g.env * (open * g.b + bulge)
        top.push([g.x * W, Math.max(2, (mid - up) * H)])
        bot.push([g.x * W, Math.min(H - 2, (mid + down) * H)])
      }
      const poly = [...top, ...bot.slice().reverse()]
      const path = new Path2D()
      poly.forEach(([x, y], i) => (i ? path.lineTo(x, y) : path.moveTo(x, y)))
      path.closePath()

      ctx.clearRect(0, 0, W, H)

      // Hairline fractures running off the main crack.
      const grow = 0.45 + 0.55 * open
      ctx.lineWidth = 1
      ctx.strokeStyle = `rgba(${BONE},0.2)`
      for (const b of BRANCHES) {
        const [sx, sy] = b.side < 0 ? top[b.i] : bot[b.i]
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        let x = sx
        let y = sy
        for (const [dx, dy] of b.steps) {
          x += dx * W * 0.045 * grow
          y += b.side * dy * H * 0.07 * grow
          ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // The void inside the crack.
      ctx.save()
      ctx.clip(path)
      ctx.fillStyle = "#020a05"
      ctx.fillRect(0, 0, W, H)
      const glow = ctx.createRadialGradient(s.px * W, H / 2, 0, s.px * W, H / 2, Math.max(W, H) * 0.55)
      glow.addColorStop(0, `rgba(${GREEN},${0.12 + 0.12 * h})`)
      glow.addColorStop(1, `rgba(${GREEN},0)`)
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, W, H)

      // Raw code, one column per strip, alternating up and down.
      ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
      ctx.textBaseline = "top"
      const LH = 19
      const colW = W < 520 ? 200 : 236
      const cols = Math.ceil(W / colW) + 1
      for (let c = 0; c < cols; c++) {
        const dir = c % 2 ? -1 : 1
        const o = phase * (10 + hash(c, 3.1) * 28) * dir
        const k0 = Math.floor(-o / LH) - 1
        const k1 = Math.floor((H - o) / LH) + 1
        for (let k = k0; k <= k1; k++) {
          const hh = hash(k, c)
          ctx.fillStyle = hh > 0.94 ? "rgba(214,255,228,0.95)" : `rgba(${GREEN},${0.2 + 0.6 * hh})`
          ctx.fillText(CODE[mod(k + c * 11, CODE.length)], c * colW + 14, k * LH + o)
        }
      }

      // Darken toward the lips so the code sinks into the crack.
      ctx.lineJoin = "round"
      ctx.lineWidth = 22
      ctx.strokeStyle = "rgba(2,10,6,0.45)"
      ctx.stroke(path)
      ctx.restore()

      // The lit edge.
      ctx.lineJoin = "miter"
      ctx.lineWidth = 9
      ctx.strokeStyle = `rgba(${GREEN},${0.1 + 0.08 * h})`
      ctx.stroke(path)
      ctx.lineWidth = 1.5
      ctx.strokeStyle = `rgba(${GREEN},0.95)`
      ctx.stroke(path)
    }

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const target = hoverRef.current.target
      h = still ? target : h + (target - h) * (1 - Math.exp(-dt * 7))
      if (!still) phase += dt * (1 + 1.8 * h)
      draw(now)
      if (!still && visible) raf = requestAnimationFrame(frame)
      else running = false
    }
    const kick = () => {
      if (running || !visible) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    const resize = () => {
      const r = cv.getBoundingClientRect()
      W = r.width
      H = r.height
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      cv.width = Math.round(W * dpr)
      cv.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(performance.now())
    }

    const ro = new ResizeObserver(resize)
    ro.observe(cv)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) kick()
    })
    io.observe(cv)
    // Reduced motion draws on demand instead of looping.
    const poke = () => kick()
    cv.addEventListener("pointerenter", poke)
    cv.addEventListener("pointermove", poke)
    cv.addEventListener("pointerleave", poke)
    const link = cv.closest("a")
    link?.addEventListener("focus", poke)
    link?.addEventListener("blur", poke)
    resize()
    kick()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      cv.removeEventListener("pointerenter", poke)
      cv.removeEventListener("pointermove", poke)
      cv.removeEventListener("pointerleave", poke)
      link?.removeEventListener("focus", poke)
      link?.removeEventListener("blur", poke)
    }
  }, [hoverRef])

  return <canvas ref={ref} aria-hidden className="block h-[19rem] w-full sm:h-[25rem]" />
}

export function Rift() {
  const hover = React.useRef<Hover>({ target: 0, px: 0.5 })
  const move = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.querySelector("canvas")?.getBoundingClientRect()
    if (!r) return
    hover.current.px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    hover.current.target = 1
  }
  const set = (v: number) => () => {
    hover.current.target = v
  }

  return (
    <Section id="showcase" mood="ash">
      <SectionHead title="There's a crack in this page.">
        Something is leaking through. Step in and you land on my GitHub, laid out as a 3D desk you can look around.
      </SectionHead>

      <a
        href={SHOWCASE}
        target="_blank"
        rel="noreferrer"
        aria-label="Step through the crack to my GitHub showcase. It is a separate website and opens in a new tab."
        onPointerEnter={move}
        onPointerMove={move}
        onPointerLeave={set(0)}
        onFocus={set(1)}
        onBlur={set(0)}
        className="group/rift block rounded-sm no-underline"
      >
        <RiftCanvas hoverRef={hover} />
        <span className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-4 text-[14px]">
          <span className="min-w-0 truncate font-mono text-muted-foreground">daniels-github-showcase.vercel.app</span>
          <span className="inline-flex shrink-0 items-center gap-1.5 font-medium text-foreground transition-colors group-hover/rift:text-[#3dff86] group-focus-visible/rift:text-[#3dff86]">
            Step through
            <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover/rift:-translate-y-0.5 group-hover/rift:translate-x-0.5" />
          </span>
        </span>
      </a>
    </Section>
  )
}
