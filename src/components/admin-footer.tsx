import { Heart } from "lucide-react";

export function AdminFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background/40 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          {/* Left: Copyright */}
          <div className="flex items-center gap-1.5">
            <span>© {year} ONE MEDI.</span>
            <span className="hidden sm:inline">All rights reserved.</span>
            <span className="hidden md:inline-flex items-center gap-1">
              Built with <Heart className="h-3 w-3 text-primary fill-primary inline" /> by ONE MEDI
              Engineering
            </span>
          </div>

          {/* Center: Links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="hover:text-foreground transition-colors duration-200"
            >
              Documentation
            </a>
            <span className="text-border">•</span>
            <a
              href="#"
              className="hover:text-foreground transition-colors duration-200"
            >
              API Reference
            </a>
            <span className="text-border">•</span>
            <a
              href="#"
              className="hover:text-foreground transition-colors duration-200"
            >
              Support
            </a>
          </div>

          {/* Right: Version + Env */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-border/60 px-2 py-0.5 text-[10px] font-mono font-medium text-muted-foreground/80">
              v2.4.0
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Production
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
