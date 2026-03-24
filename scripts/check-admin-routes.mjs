import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const repoRoot = resolve(process.cwd())
const sidebarPath = resolve(repoRoot, 'src/components/admin-sidebar.tsx')

const source = readFileSync(sidebarPath, 'utf8')
const routeMatches = [...source.matchAll(/url:\s*"(\/admin[^\"]*)"/g)]
const routes = [...new Set(routeMatches.map((m) => m[1]))]

const knownFallback = existsSync(resolve(repoRoot, 'src/app/admin/[...slug]/page.tsx'))

const missing = routes.filter((route) => {
  const pagePath = resolve(repoRoot, `src/app${route}/page.tsx`)
  if (existsSync(pagePath)) return false
  return !knownFallback
})

if (missing.length > 0) {
  console.error('Admin routes declared in sidebar but not implemented:')
  for (const route of missing) {
    console.error(` - ${route}`)
  }
  process.exit(1)
}

console.log(`Admin route check passed (${routes.length} routes).`)
