import * as React from "react"
import { useMood } from "@/components/theme-provider"
import { prefersReducedMotion } from "@/hooks/use-in-view"

type Ember = { x: number; y: number; vx: number; vy: number; r: number; life: number; speed: number; phase: number }

/**
 * Fixed backdrop: embers drift upward in the active mood's colour, scatter away from
 * the pointer, and a soft glow follows it. One canvas, paused when the tab is hidden.
 */
export function Atmosphere() {
  const ref = React.useRef<HTMLCanvasElement>(null)
  const { rgbRef } = useMood()

  React.useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const still = prefersReducedMotion()
    let W = 0
    let H = 0
    let dpr = 1
    let raf = 0
    let last = performance.now()
    const embers: Ember[] = []
    const ptr = { x: -999, y: -999, gx: -999, gy: -999, on: false }
    const color: [number, number, number] = [...rgbRef.current]

    const spawn = (anywhere: boolean): Ember => ({
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + 10,
      vx: (Math.random() - 0.5) * 8,
      vy: 0,
      r: 0.5 + Math.random() * 1.9,
      life: Math.random(),
      speed: 10 + Math.random() * 28,
      phase: Math.random() * Math.PI * 2,
    })

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      dpr = Math.min(1.5, window.devicePixelRatio || 1)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.width = W + "px"
      canvas.style.height = H + "px"
      const target = Math.min(90, Math.max(18, Math.floor((W * H) / 20000)))
      while (embers.length < target) embers.push(spawn(true))
      embers.length = target
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const k = 1 - Math.exp(-dt * 4)
      for (let i = 0; i < 3; i++) color[i] += (rgbRef.current[i] - color[i]) * k
      ptr.gx += (ptr.x - ptr.gx) * (1 - Math.exp(-dt * 8))
      ptr.gy += (ptr.y - ptr.gy) * (1 - Math.exp(-dt * 8))
      const c = `${color[0] | 0},${color[1] | 0},${color[2] | 0}`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      if (ptr.on) {
        const g = ctx.createRadialGradient(ptr.gx, ptr.gy, 0, ptr.gx, ptr.gy, 280)
        g.addColorStop(0, `rgba(${c},0.16)`)
        g.addColorStop(1, `rgba(${c},0)`)
        ctx.fillStyle = g
        ctx.fillRect(ptr.gx - 280, ptr.gy - 280, 560, 560)
      }

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i]
        e.phase += dt * 1.4
        e.vx += Math.sin(e.phase) * 6 * dt
        const dx = e.x - ptr.x
        const dy = e.y - ptr.y
        const d2 = dx * dx + dy * dy
        if (ptr.on && d2 < 16000) {
          const d = Math.sqrt(d2) || 1
          const f = (1 - d / 126) * 260 * dt
          e.vx += (dx / d) * f
          e.vy += (dy / d) * f
        }
        e.vx *= 1 - dt * 1.5
        e.vy *= 1 - dt * 1.5
        e.x += e.vx * dt
        e.y += (e.vy - e.speed) * dt
        e.life += dt * 0.12
        if (e.y < -12 || e.x < -20 || e.x > W + 20 || e.life > 1) {
          embers[i] = spawn(false)
          continue
        }
        const fade = Math.sin(Math.min(1, e.life) * Math.PI)
        const a = (0.25 + 0.55 * Math.abs(Math.sin(e.phase * 1.7))) * fade
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${c},${a.toFixed(3)})`
        ctx.fill()
        if (e.r > 1.5) {
          ctx.beginPath()
          ctx.arc(e.x, e.y, e.r * 3.2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${c},${(a * 0.12).toFixed(3)})`
          ctx.fill()
        }
      }
    }

    const onMove = (ev: PointerEvent) => {
      if (!ptr.on) {
        ptr.gx = ev.clientX
        ptr.gy = ev.clientY
      }
      ptr.x = ev.clientX
      ptr.y = ev.clientY
      ptr.on = true
    }
    const onLeave = () => {
      ptr.on = false
      ptr.x = ptr.y = -999
    }
    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden && !still) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }

    resize()
    if (still) frame(performance.now() + 16)
    cancelAnimationFrame(raf)
    if (!still) raf = requestAnimationFrame(frame)
    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", onMove, { passive: true })
    document.documentElement.addEventListener("pointerleave", onLeave)
    document.addEventListener("visibilitychange", onVis)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [rgbRef])

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0" />
}
