import * as React from "react"
import { Section, SectionHead } from "@/components/section"
import { prefersReducedMotion } from "@/hooks/use-in-view"

const SHOWCASE = "https://daniels-github-showcase.vercel.app/"

/** The rift is the one thing on the page that is not the active mood colour. It is leaking in from somewhere else. */
const GREEN = "61,255,134"

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

/** Short scraps that drift out of the crack and fade. */
const SCRAPS = ["0x4f", "git", "=>", "{ }", "01", "fn()", ";", "</>", "npm", "&&", "0b1", "tick", "!==", "[0]", "open", "$ _"]

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

function inPoly(poly: [number, number][], x: number, y: number) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

/* ---------- the crack's shape, fixed once ---------- */

const N = 34
const BASE = 0.28
const REST = 0.7
/** Extra room around the crack, in pixels, that still counts as touching it. */
const REACH = 22

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
  hit: (x: number, y: number) => boolean
}
interface Scrap {
  x: number
  y: number
  vx: number
  vy: number
  age: number
  life: number
  text: string
  bright: boolean
}

const GEO: Pt[] = (() => {
  const r = mulberry32(20261018)
  const geo: Pt[] = []
  for (let i = 0; i <= N; i++) {
    const edge = i === 0 || i === N
    const x = edge ? i / N : (i + (r() - 0.5) * 0.7) / N
    const env = Math.pow(Math.sin(Math.PI * x), 0.6)
    const mid = Math.sin(x * 7.1 + 0.6) * 0.04 + Math.sin(x * 15.3 + 2.1) * 0.02
    geo.push({ x, env, mid, t: 0.3 + r() * 0.85, b: 0.3 + r() * 0.85 })
  }
  return geo
})()

/**
 * A clean crack torn across the page, with raw green code scrolling inside it and scraps of it drifting out.
 * It opens wider as you reach for it.
 */
function RiftCanvas({ hoverRef }: { hoverRef: React.RefObject<Hover> }) {
  const ref = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const cv = ref.current
    const ctx = cv?.getContext("2d")
    if (!cv || !ctx) return
    const still = prefersReducedMotion()
    const state = hoverRef.current

    let W = 0
    let H = 0
    let raf = 0
    let running = false
    let visible = true
    let last = 0
    let phase = 0
    let h = 0
    let spawn = 0
    let hitPoly: [number, number][] = []
    const scraps: Scrap[] = []
    const rnd = Math.random

    state.hit = (x, y) => inPoly(hitPoly, x, y)

    const draw = (now: number, dt: number) => {
      const open = REST + (1 - REST) * h + (still ? 0 : (1 - h) * 0.06 * Math.sin(now / 1300))

      // The two jagged edges, in pixels.
      const top: [number, number][] = []
      const bot: [number, number][] = []
      for (const g of GEO) {
        const bulge = Math.exp(-Math.pow((g.x - state.px) / 0.14, 2)) * 0.26 * h
        const mid = 0.5 + g.mid
        const up = BASE * g.env * (open * g.t + bulge)
        const down = BASE * g.env * (open * g.b + bulge)
        top.push([g.x * W, Math.max(2, (mid - up) * H)])
        bot.push([g.x * W, Math.min(H - 2, (mid + down) * H)])
      }
      const poly = [...top, ...bot.slice().reverse()]
      hitPoly = [
        ...top.map(([x, y]): [number, number] => [x, y - REACH]),
        ...bot.slice().reverse().map(([x, y]): [number, number] => [x, y + REACH]),
      ]
      const path = new Path2D()
      poly.forEach(([x, y], i) => (i ? path.lineTo(x, y) : path.moveTo(x, y)))
      path.closePath()

      ctx.clearRect(0, 0, W, H)

      // Light spilling out around the crack.
      ctx.lineJoin = "round"
      ctx.lineWidth = 46
      ctx.strokeStyle = `rgba(${GREEN},${0.035 + 0.03 * h})`
      ctx.stroke(path)
      ctx.lineWidth = 22
      ctx.strokeStyle = `rgba(${GREEN},${0.05 + 0.04 * h})`
      ctx.stroke(path)

      // The void inside the crack.
      ctx.save()
      ctx.clip(path)
      ctx.fillStyle = "#020a05"
      ctx.fillRect(0, 0, W, H)
      const glow = ctx.createRadialGradient(state.px * W, H / 2, 0, state.px * W, H / 2, Math.max(W, H) * 0.55)
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

      // Scraps of code leaking out of the crack, up from the top lip and down from the bottom one.
      if (!still && dt > 0) {
        spawn += dt * (7 + 14 * h)
        while (spawn >= 1 && scraps.length < 70) {
          spawn -= 1
          const i = 1 + Math.floor(rnd() * (N - 1))
          const [x, yTop] = top[i]
          const yBot = bot[i][1]
          const up = rnd() < 0.5
          const y = up ? yTop + rnd() * (yBot - yTop) * 0.4 : yBot - rnd() * (yBot - yTop) * 0.4
          scraps.push({
            x,
            y,
            vx: (rnd() - 0.5) * 16,
            vy: (up ? -1 : 1) * (14 + rnd() * 34),
            age: 0,
            life: 2.2 + rnd() * 2.4,
            text: SCRAPS[Math.floor(rnd() * SCRAPS.length)],
            bright: rnd() > 0.9,
          })
        }
        spawn = Math.min(spawn, 1)
        for (let i = scraps.length - 1; i >= 0; i--) {
          const s = scraps[i]
          s.age += dt
          if (s.age >= s.life) {
            scraps.splice(i, 1)
            continue
          }
          s.x += s.vx * dt
          s.y += s.vy * dt
        }
      }
      ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
      for (const s of scraps) {
        const u = s.age / s.life
        const a = Math.pow(Math.sin(Math.PI * u), 0.7) * 0.85
        ctx.fillStyle = s.bright ? `rgba(214,255,228,${a})` : `rgba(${GREEN},${a})`
        ctx.fillText(s.text, s.x, s.y)
      }
    }

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const target = state.target
      h = still ? target : h + (target - h) * (1 - Math.exp(-dt * 7))
      if (!still) phase += dt * (1 + 1.8 * h)
      draw(now, dt)
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
      draw(performance.now(), 0)
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
    const link = cv.closest("a")
    link?.addEventListener("pointermove", poke)
    link?.addEventListener("pointerleave", poke)
    link?.addEventListener("focus", poke)
    link?.addEventListener("blur", poke)
    resize()
    kick()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      link?.removeEventListener("pointermove", poke)
      link?.removeEventListener("pointerleave", poke)
      link?.removeEventListener("focus", poke)
      link?.removeEventListener("blur", poke)
    }
  }, [hoverRef])

  return <canvas ref={ref} aria-hidden className="block h-[20rem] w-full sm:h-[28rem]" />
}

export function Rift() {
  const hover = React.useRef<Hover>({ target: 0, px: 0.5, hit: () => false })

  /** Pointer position inside the canvas, or null if there is no canvas yet. */
  const local = (e: React.PointerEvent | React.MouseEvent) => {
    const cv = e.currentTarget.querySelector("canvas")
    if (!cv) return null
    const r = cv.getBoundingClientRect()
    return { cv, x: e.clientX - r.left, y: e.clientY - r.top, w: r.width }
  }
  const move = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const p = local(e)
    if (!p) return
    const over = hover.current.hit(p.x, p.y)
    hover.current.target = over ? 1 : 0
    if (over) hover.current.px = Math.min(1, Math.max(0, p.x / p.w))
    p.cv.style.cursor = over ? "pointer" : "default"
  }
  /** Only the crack itself is a door. A click on the empty page around it does nothing. */
  const click = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const p = local(e)
    if (!p || e.detail === 0) return // keyboard activation goes through
    if (!hover.current.hit(p.x, p.y)) e.preventDefault()
  }

  return (
    <Section id="showcase" mood="ash">
      <SectionHead
        title={
          <>
            Something is leaking through. <span className="text-muted-foreground">Explore to find out.</span>
          </>
        }
      />

      <a
        href={SHOWCASE}
        target="_blank"
        rel="noreferrer"
        aria-label="Explore the crack. It opens my GitHub showcase, a separate website, in a new tab."
        onPointerMove={move}
        onPointerDown={move}
        onPointerLeave={() => {
          hover.current.target = 0
        }}
        onFocus={() => {
          hover.current.target = 1
        }}
        onBlur={() => {
          hover.current.target = 0
        }}
        onClick={click}
        className="block cursor-default rounded-sm no-underline"
      >
        <RiftCanvas hoverRef={hover} />
      </a>
    </Section>
  )
}
