const links = [
  { href: "#work", label: "Work" },
  { href: "#activity", label: "Activity" },
  { href: "#moments", label: "Moments" },
  { href: "#contact", label: "Elsewhere" },
]

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-gradient-to-b from-background/90 to-transparent pt-[env(safe-area-inset-top)] backdrop-blur-[2px]">
      <nav aria-label="Primary" className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="font-blackletter text-[1.35rem] leading-none text-foreground">
          Daniel Robinson
        </a>
        <ul className="m-0 flex list-none items-center gap-4 p-0 text-[14px] sm:gap-7">
          {links.map((l, i) => (
            <li key={l.href} className={i === 1 || i === 2 ? "hidden sm:block" : ""}>
              <a href={l.href} className="text-muted-foreground transition-colors hover:text-brand focus-visible:text-brand">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
