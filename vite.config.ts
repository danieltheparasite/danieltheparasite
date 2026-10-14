import path from "node:path"
import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

/**
 * Serves the files in /api (the same ones Vercel runs in production) while you
 * work with `npm run dev`, so /api/github and /api/leetcode behave locally too.
 */
function localApi(): Plugin {
  return {
    name: "local-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const route = /^\/api\/([a-z0-9-]+)(?:\?.*)?$/i.exec(req.url ?? "")
        if (!route) return next()
        let mod: { GET?: (req: Request) => Promise<Response> | Response }
        try {
          mod = await server.ssrLoadModule(`/api/${route[1]}.ts`)
        } catch {
          return next()
        }
        if (!mod.GET) return next()
        try {
          const r = await mod.GET(new Request(new URL(req.url!, "http://localhost")))
          res.statusCode = r.status
          r.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(await r.text())
        } catch (err) {
          res.statusCode = 500
          res.setHeader("content-type", "application/json")
          res.end(JSON.stringify({ error: (err as Error).message }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localApi()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
})
